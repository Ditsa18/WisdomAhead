import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

// Setup mock directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper to read JSON collection file
function readCollection(modelName) {
  const filePath = path.join(DATA_DIR, `${modelName}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading mock collection ${modelName}:`, e);
    return [];
  }
}

// Helper to write JSON collection file
function writeCollection(modelName, data) {
  const filePath = path.join(DATA_DIR, `${modelName}.json`);
  try {
    // Serialize Map properties for Progress collection
    const serialized = data.map(item => {
      const copy = { ...item };
      if (copy.deliverableAnswers && typeof copy.deliverableAnswers.toJSON === 'function') {
        copy.deliverableAnswers = copy.deliverableAnswers.toJSON();
      }
      return copy;
    });
    fs.writeFileSync(filePath, JSON.stringify(serialized, null, 2));
  } catch (e) {
    console.error(`Error writing mock collection ${modelName}:`, e);
  }
}

// Mock Query Class to simulate Mongoose query chains (.sort, .select, then/catch)
class MockQuery {
  constructor(data, isArray = true) {
    this.data = data;
    this.isArray = isArray;
  }
  sort(sortObj) {
    if (this.isArray && Array.isArray(this.data)) {
      if (sortObj.moduleId) {
        this.data.sort((a, b) => a.moduleId - b.moduleId);
      } else if (sortObj.order) {
        this.data.sort((a, b) => a.order - b.order);
      }
    }
    return this;
  }
  select(fields) {
    return this;
  }
  async then(resolve, reject) {
    try {
      return resolve(this.data);
    } catch (err) {
      if (reject) return reject(err);
      throw err;
    }
  }
  async catch(reject) {
    return this;
  }
}

// Setup a mock Mongoose document with .save() method and map methods
function decorateDocument(modelName, doc) {
  if (!doc) return null;
  
  if (!doc._id) {
    doc._id = new mongoose.Types.ObjectId().toString();
  }

  // Handle progress map methods: get() & set()
  if (modelName === 'Progress') {
    const rawAnswers = doc.deliverableAnswers || {};
    // Check if it already has get and set
    if (typeof rawAnswers.get !== 'function') {
      doc.deliverableAnswers = {
        get: (key) => rawAnswers[key],
        set: (key, val) => { rawAnswers[key] = val; },
        toJSON: () => rawAnswers
      };
    }
  }

  return doc;
}

// Enable Mock DB mode by patching mongoose Model class and prototype methods
function enableMockDB(error) {
  console.log('⚠️  MongoDB connection failed/unavailable. Switching to local JSON mock database.', error);
  process.env.USE_MOCK_DB = 'true';

  // Prevent Mongoose from buffering queries by setting readyState to connected (1)
  mongoose.connection.readyState = 1;

  // Override mongoose.connect to resolve successfully
  mongoose.connect = async () => {
    console.log('Mock Database connected successfully.');
    return mongoose.connection;
  };

  // Patch mongoose.Model static methods directly on the class
  mongoose.Model.find = function(query = {}) {
    const name = this.modelName;
    let list = readCollection(name);
    
    // Filter list based on simple query keys
    Object.keys(query).forEach(key => {
      const val = query[key];
      if (val !== undefined) {
        list = list.filter(item => {
          if (item[key] && item[key].toString() === val.toString()) return true;
          return item[key] === val;
        });
      }
    });
    
    const docs = list.map(item => decorateDocument(name, item));
    return new MockQuery(docs, true);
  };

  mongoose.Model.findOne = function(query = {}) {
    const name = this.modelName;
    let list = readCollection(name);
    
    Object.keys(query).forEach(key => {
      const val = query[key];
      if (val !== undefined) {
        list = list.filter(item => {
          if (item[key] && item[key].toString() === val.toString()) return true;
          return item[key] === val;
        });
      }
    });
    
    const doc = list.length > 0 ? decorateDocument(name, list[0]) : null;
    return new MockQuery(doc, false);
  };

  mongoose.Model.findById = function(id) {
    const name = this.modelName;
    const list = readCollection(name);
    const doc = list.find(item => item._id.toString() === id.toString());
    const mockDoc = doc ? decorateDocument(name, doc) : null;
    return new MockQuery(mockDoc, false);
  };

  mongoose.Model.create = async function(data) {
    const name = this.modelName;
    if (Array.isArray(data)) {
      return this.insertMany(data);
    }
    
    const doc = decorateDocument(name, { ...data });
    const list = readCollection(name);
    
    const serializable = { ...doc };
    if (doc.deliverableAnswers && typeof doc.deliverableAnswers.toJSON === 'function') {
      serializable.deliverableAnswers = doc.deliverableAnswers.toJSON();
    }
    
    list.push(serializable);
    writeCollection(name, list);
    return doc;
  };

  mongoose.Model.insertMany = async function(arr) {
    const name = this.modelName;
    const list = readCollection(name);
    
    const created = arr.map(item => {
      const doc = decorateDocument(name, { ...item });
      const serializable = { ...doc };
      list.push(serializable);
      return doc;
    });
    
    writeCollection(name, list);
    return created;
  };

  mongoose.Model.deleteMany = async function(query = {}) {
    const name = this.modelName;
    let list = readCollection(name);
    const initialLength = list.length;
    
    if (Object.keys(query).length === 0) {
      list = [];
    } else {
      Object.keys(query).forEach(key => {
        const val = query[key];
        list = list.filter(item => {
          if (item[key] && item[key].toString() === val.toString()) return false;
          return item[key] !== val;
        });
      });
    }
    
    writeCollection(name, list);
    return { deletedCount: initialLength - list.length };
  };

  // Patch mongoose.Model.prototype.save method
  mongoose.Model.prototype.save = async function() {
    const name = this.constructor.modelName;
    const doc = this;
    const list = readCollection(name);
    
    if (!doc._id) {
      doc._id = new mongoose.Types.ObjectId().toString();
    }

    const index = list.findIndex(item => item._id.toString() === doc._id.toString());
    
    // Serialize standard fields
    const serializable = doc.toObject ? doc.toObject() : { ...doc };
    
    // Clean serializable of save functions
    delete serializable.save;
    
    // Map serialization
    if (doc.deliverableAnswers && typeof doc.deliverableAnswers.toJSON === 'function') {
      serializable.deliverableAnswers = doc.deliverableAnswers.toJSON();
    } else if (serializable.deliverableAnswers instanceof Map) {
      serializable.deliverableAnswers = Object.fromEntries(serializable.deliverableAnswers);
    }
    
    if (index >= 0) {
      list[index] = serializable;
    } else {
      list.push(serializable);
    }
    
    writeCollection(name, list);
    
    // Ensure document keeps map helper functions after save
    decorateDocument(name, doc);
    
    return doc;
  };
}

export async function connectDB(MONGODB_URI) {
  try {
    // Attempt Mongoose connection with a short 2-second timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    enableMockDB(err);
    await mongoose.connect(MONGODB_URI);
  }
}
