export const seedModules = [
  // --- TRACK 1: FOUNDATIONS ---
  {
    moduleId: 1,
    title: "Customer Discovery",
    description: "Validate your customer hypothesis through structured interviews and deep problem understanding.",
    track: 1,
    trackName: "Foundations",
    order: 1,
    price: 0,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder1",
      sections: [
        { type: "header", body: "Introduction to Customer Discovery" },
        { type: "text", body: "Customer discovery is the process of identifying who your customers are and whether they actually have the problem you think they have. It prevents you from building products that nobody wants." },
        { type: "header", body: "Key Steps in Customer Discovery" },
        { type: "bullet", body: "1. Define your hypothesis about the customer's problem." },
        { type: "bullet", body: "2. Plan open-ended interview questions (avoid leading questions)." },
        { type: "bullet", body: "3. Identify and reach out to at least 10-15 target interviewees." },
        { type: "bullet", body: "4. Conduct interviews, listen 90% of the time, and look for patterns." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "targetCustomer", label: "Target Customer Profile", placeholder: "Who is your ideal user? Be specific (e.g., 'Freelance copywriters in Europe')." },
      { fieldKey: "coreProblem", label: "Core Problem", placeholder: "What is the primary pain point they experience?" },
      { fieldKey: "currentAlternatives", label: "Current Alternatives", placeholder: "How do they solve or cope with this problem today?" },
      { fieldKey: "severity", label: "Severity & Frequency", placeholder: "How often do they face this problem, and how severe is it?" },
      { fieldKey: "firstCustomer", label: "Ideal First Customer", placeholder: "Describe one specific person or company who would buy this on Day 1." }
    ]
  },
  {
    moduleId: 2,
    title: "Problem Solution Fit",
    description: "Test whether your proposed solution solves the customer pain in a viable and compelling way.",
    track: 1,
    trackName: "Foundations",
    order: 2,
    price: 0,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder2",
      sections: [
        { type: "header", body: "Validating your Solution" },
        { type: "text", body: "Once you have validated a deep customer pain point, you must test whether your proposed solution actually solves it in a way that is viable and compelling." },
        { type: "header", body: "The Problem-Solution Fit Canvas" },
        { type: "bullet", body: "Value Proposition: How your product solves problems or improves situations." },
        { type: "bullet", body: "Pain Relievers: Exactly how your features ease the customer's specific pains." },
        { type: "bullet", body: "Gain Creators: How it creates benefits or outcomes the customer expects or desires." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "proposedSolution", label: "Proposed Solution", placeholder: "Describe your solution in plain language." },
      { fieldKey: "valueProposition", label: "Value Proposition", placeholder: "What is the single most compelling reason a customer would choose you?" },
      { fieldKey: "coreFeatures", label: "Core Value-Add Features", placeholder: "List 3 features that directly solve the core customer pain." }
    ]
  },
  {
    moduleId: 3,
    title: "Business Model",
    description: "Define how your startup creates, delivers, and captures value through revenue streams.",
    track: 1,
    trackName: "Foundations",
    order: 3,
    price: 0,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder3",
      sections: [
        { type: "header", body: "Defining How You Make Money" },
        { type: "text", body: "A business model describes how your startup creates, delivers, and captures value. We will explore various pricing and revenue mechanisms." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "revenueStreams", label: "Revenue Streams", placeholder: "How will you charge customers (Subscription, Transactional, Ads)?" },
      { fieldKey: "pricingStrategy", label: "Pricing Strategy", placeholder: "What is your pricing tier (e.g. '₹199/month, ₹999/year')?" },
      { fieldKey: "costStructure", label: "Key Cost Drivers", placeholder: "What are your largest expenses (hosting, marketing, manufacturing)?" }
    ]
  },
  {
    moduleId: 4,
    title: "Go To Market Strategy",
    description: "Create an action plan to acquire your first cohort of users and scale efficiently.",
    track: 1,
    trackName: "Foundations",
    order: 4,
    price: 0,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder4",
      sections: [
        { type: "header", body: "Reaching Your Customers" },
        { type: "text", body: "Your Go-To-Market (GTM) strategy is an action plan specifying how you will acquire your first cohort of users and scale your reach." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "acquisitionChannels", label: "Primary Acquisition Channels", placeholder: "SEO, outbound sales, influencers, paid ads?" },
      { fieldKey: "launchPlan", label: "Launch Plan", placeholder: "How will you announce and roll out your product to your first 100 users?" },
      { fieldKey: "keyMessaging", label: "Key Hook / Messaging", placeholder: "What copy or headline will you use to grab attention?" }
    ]
  },
  {
    moduleId: 5,
    title: "Competitive Landscape",
    description: "Analyze direct and indirect competitors to identify your unfair advantage.",
    track: 1,
    trackName: "Foundations",
    order: 5,
    price: 0,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder5",
      sections: [
        { type: "header", body: "Analyzing Competitors" },
        { type: "text", body: "Every startup has competition. Direct competitors offer a similar solution, while indirect competitors solve the same problem differently." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "directCompetitors", label: "Direct Competitors", placeholder: "List 2-3 direct competitors and their URLs/names." },
      { fieldKey: "indirectCompetitors", label: "Indirect Competitors / Status Quo", placeholder: "How else are users coping? (e.g. Excel spreadsheets, manual work)" },
      { fieldKey: "moat", label: "Unfair Advantage / Moat", placeholder: "Why is your solution hard to copy or replace?" }
    ]
  },
  {
    moduleId: 6,
    title: "Pitch Prep",
    description: "Master the structure and delivery of your investor pitch presentation.",
    track: 1,
    trackName: "Foundations",
    order: 6,
    price: 0,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder6",
      sections: [
        { type: "header", body: "Structuring Your Pitch" },
        { type: "text", body: "Preparing to present your business to investors or clients. A standard pitch contains: Problem, Solution, Market, Business Model, Traction, Team, and the Ask." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "elevatorPitch", label: "Elevator Pitch (30 seconds)", placeholder: "One sentence stating what you do, for whom, and why it matters." },
      { fieldKey: "investorAsk", label: "The Ask", placeholder: "How much money are you raising, and what milestones will it unlock?" },
      { fieldKey: "teamSlide", label: "Why Your Team?", placeholder: "What unique experiences or credentials make your team ideal?" }
    ]
  },
  {
    moduleId: 7,
    title: "Financial Projections",
    description: "Build a bottom-up financial model to project revenue and expenses for 3-5 years.",
    track: 2,
    trackName: "Finance",
    order: 1,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder7",
      sections: [
        { type: "header", body: "Building Financial Models" },
        { type: "text", body: "Creating a bottom-up forecast to project revenue, expenses, and growth over 3 to 5 years." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "year1Revenue", label: "Year 1 Target Revenue", placeholder: "Estimate your total sales/revenue for the first 12 months." },
      { fieldKey: "expenseEstimate", label: "Monthly Burn Rate", placeholder: "How much cash will you spend each month before breaking even?" },
      { fieldKey: "breakEvenMonth", label: "Estimated Month to Break-Even", placeholder: "e.g., 'Month 18'." }
    ]
  },
  {
    moduleId: 8,
    title: "Unit Economics",
    description: "Master LTV and CAC analysis to understand your business profitability metrics.",
    track: 2,
    trackName: "Finance",
    order: 2,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder8",
      sections: [
        { type: "header", body: "LTV and CAC Analysis" },
        { type: "text", body: "Understanding the cost to acquire a single customer (CAC) relative to the lifetime value (LTV) they bring." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "cacEstimate", label: "Estimated CAC ($)", placeholder: "How much will you spend in marketing to get one paying customer?" },
      { fieldKey: "ltvEstimate", label: "Estimated Customer Lifetime Value ($)", placeholder: "Average revenue from a customer before they churn." },
      { fieldKey: "paybackPeriod", label: "CAC Payback Period", placeholder: "How many months does it take to recover the cost of CAC?" }
    ]
  },
  {
    moduleId: 9,
    title: "Funding Strategy",
    description: "Evaluate bootstrapping vs venture capital and plan your fundraising approach.",
    track: 2,
    trackName: "Finance",
    order: 3,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder9",
      sections: [
        { type: "header", body: "Bootstrapping vs Venture Capital" },
        { type: "text", body: "Evaluating whether to bootstrap your startup, seek angel investors, apply for grants, or raise VC funding." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "fundingSource", label: "Preferred Funding Method", placeholder: "e.g., 'Angel Round', 'VC Seed', 'Grants', 'Bootstrapping'." },
      { fieldKey: "fundingMilestones", label: "Key Milestones Needed to Raise", placeholder: "What traction do you need before raising (e.g. 10k MRR)?" }
    ]
  },
  {
    moduleId: 10,
    title: "Cap Table Basics",
    description: "Understand equity distribution, founder splits, and investor dilution mechanics.",
    track: 2,
    trackName: "Finance",
    order: 4,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder10",
      sections: [
        { type: "header", body: "Equity & Ownership" },
        { type: "text", body: "A capitalization table manages the distribution of equity ownership among founders, early hires, and investors." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "founderEquitySplit", label: "Founder Equity Split", placeholder: "e.g. 'Founder A: 60%, Founder B: 40%'" },
      { fieldKey: "optionPoolSize", label: "Employee Option Pool Size", placeholder: "Typically 10% to 15%." }
    ]
  },
  {
    moduleId: 11,
    title: "Cash Flow",
    description: "Master cash runway management and prevent your startup from running out of money.",
    track: 2,
    trackName: "Finance",
    order: 5,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder11",
      sections: [
        { type: "header", body: "Managing Runway" },
        { type: "text", body: "Cash is king. Keeping track of cash inflows and outflows to ensure you do not run out of money unexpectedly." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "cashRunway", label: "Current Cash Runway (Months)", placeholder: "How long can your startup survive at current burn rates?" },
      { fieldKey: "cashBufferStrategy", label: "Cash Buffer Strategy", placeholder: "How do you manage late invoices or unexpected costs?" }
    ]
  },
  {
    moduleId: 12,
    title: "Investor Metrics",
    description: "Track MRR growth, churn rates, and metrics that matter to venture investors.",
    track: 2,
    trackName: "Finance",
    order: 6,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder12",
      sections: [
        { type: "header", body: "Traction Metrics that Matter" },
        { type: "text", body: "Investors look for metrics like MRR growth, churn rates, net revenue retention (NRR), and active user engagement." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "primaryMetric", label: "Primary North Star Metric", placeholder: "e.g. Monthly Recurring Revenue (MRR), Active Users." },
      { fieldKey: "churnTarget", label: "Monthly Churn Target (%)", placeholder: "What is an acceptable percentage of customer loss?" }
    ]
  },
  {
    moduleId: 13,
    title: "Team Building",
    description: "Find co-founders, hire key talent, and build a culture of high performance.",
    track: 3,
    trackName: "Operations",
    order: 1,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder13",
      sections: [
        { type: "header", body: "Hiring and Recruiting" },
        { type: "text", body: "How to find early co-founders, hire key engineers, and build a culture of high performance." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "nextHires", label: "Next 3 Key Hires", placeholder: "e.g. 'CTO, Lead Designer, Growth Marketer'." },
      { fieldKey: "compensationModel", label: "Early Hire Compensation", placeholder: "Salary + Equity split strategy." }
    ]
  },
  {
    moduleId: 14,
    title: "Legal Structure",
    description: "Incorporate your startup and set up IP assignment agreements with clarity.",
    track: 3,
    trackName: "Operations",
    order: 2,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder14",
      sections: [
        { type: "header", body: "Incorporating Your Startup" },
        { type: "text", body: "Choosing the correct legal entity (LLC, C-Corp, etc.) and putting in place IP assignment agreements." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "legalEntity", label: "Planned Legal Entity", placeholder: "Delaware C-Corp, local LLC, etc." },
      { fieldKey: "ipProtection", label: "IP Protection Steps", placeholder: "How will you secure ownership of the code, designs, and brand?" }
    ]
  },
  {
    moduleId: 15,
    title: "MVP Planning",
    description: "Define the minimum viable product scope to solve your core customer problem.",
    track: 3,
    trackName: "Operations",
    order: 3,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder15",
      sections: [
        { type: "header", body: "Building the Minimum Viable Product" },
        { type: "text", body: "Defining the absolute smallest feature set needed to solve the customer's problem and begin collecting feedback." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "mvpFeatures", label: "MVP Core Scope", placeholder: "What features are included in the MVP?" },
      { fieldKey: "mvpExclusions", label: "MVP Out-of-Scope Features", placeholder: "What features are explicitly excluded for V1?" }
    ]
  },
  {
    moduleId: 16,
    title: "Product Roadmap",
    description: "Map product development milestones for the next 6-12 months after MVP launch.",
    track: 3,
    trackName: "Operations",
    order: 4,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder16",
      sections: [
        { type: "header", body: "Scaling from MVP to Version 1" },
        { type: "text", body: "Mapping product development milestones over the next 6-12 months following initial validation." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "milestone3Months", label: "3-Month Milestones", placeholder: "What will the product look like in 3 months?" },
      { fieldKey: "milestone6Months", label: "6-Month Milestones", placeholder: "What will the product look like in 6 months?" }
    ]
  },
  {
    moduleId: 17,
    title: "Tech Stack Decisions",
    description: "Choose infrastructure and tools that enable rapid prototyping and scalability.",
    track: 3,
    trackName: "Operations",
    order: 5,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder17",
      sections: [
        { type: "header", body: "Choosing Your Tech Infrastructure" },
        { type: "text", body: "Selecting backend, frontend, database, hosting, and SaaS tools that support rapid prototyping and scalability." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "coreStack", label: "Frontend/Backend Stack", placeholder: "e.g., 'React, Node, Express, MongoDB'." },
      { fieldKey: "cloudInfrastructure", label: "Cloud Provider & Hosting", placeholder: "AWS, Vercel, Heroku, Supabase, etc." }
    ]
  },
  {
    moduleId: 18,
    title: "KPIs & Metrics",
    description: "Set up operational dashboards to track performance and customer satisfaction.",
    track: 3,
    trackName: "Operations",
    order: 6,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder18",
      sections: [
        { type: "header", body: "Operational Dashboard" },
        { type: "text", body: "Setting up system performance metrics, ticket resolutions, and key customer satisfaction indicators." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "operationalKpi", label: "Operational KPI", placeholder: "e.g. System Uptime, Customer Support Response Time." },
      { fieldKey: "satisfactionMetric", label: "Customer Satisfaction Target", placeholder: "e.g., 'NPS > 50' or 'CSAT > 90%'." }
    ]
  },
  {
    moduleId: 19,
    title: "Brand Identity",
    description: "Create compelling brand voice, visual design, and assets that resonate.",
    track: 4,
    trackName: "Marketing",
    order: 1,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder19",
      sections: [
        { type: "header", body: "Creating Brand Voice and Assets" },
        { type: "text", body: "Developing the visual design, logo, font systems, color palette, and copywriting tone for your company." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "brandTone", label: "Brand Voice & Tone", placeholder: "e.g., 'Professional but casual', 'Authoritative', 'Bold & humorous'." },
      { fieldKey: "brandKeywords", label: "3 Brand Keywords", placeholder: "Three words that describe your brand personality." }
    ]
  },
  {
    moduleId: 20,
    title: "Content Strategy",
    description: "Build an audience through blogging, newsletters, videos, and thought leadership.",
    track: 4,
    trackName: "Marketing",
    order: 2,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder20",
      sections: [
        { type: "header", body: "Organic Growth via Content" },
        { type: "text", body: "Blogging, newsletters, videos, and podcasts. How to build an audience by teaching or entertaining." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "contentMediums", label: "Primary Content Mediums", placeholder: "Substack newsletter, YouTube videos, Twitter/LinkedIn posts?" },
      { fieldKey: "postingFrequency", label: "Posting Frequency", placeholder: "Daily, weekly, bi-weekly?" }
    ]
  },
  {
    moduleId: 21,
    title: "Growth Hacking",
    description: "Create referral loops and viral mechanisms to drive low-cost user acquisition.",
    track: 4,
    trackName: "Marketing",
    order: 3,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder21",
      sections: [
        { type: "header", body: "Creative Acquisition Loops" },
        { type: "text", body: "Using referral loops, viral mechanisms, and automated scraping/outreach to drive low-cost growth." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "viralMechanism", label: "Viral Loop / Referral Program", placeholder: "How do users invite other users? (e.g. 'Get ₹10 for every referral')." },
      { fieldKey: "growthExperiment", label: "First Growth Experiment", placeholder: "Describe a 1-week test to get 50 signups." }
    ]
  },
  {
    moduleId: 22,
    title: "Customer Acquisition",
    description: "Set up paid advertising and build B2B sales pipelines that convert.",
    track: 4,
    trackName: "Marketing",
    order: 4,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder22",
      sections: [
        { type: "header", body: "Paid Advertising & Sales" },
        { type: "text", body: "Setting up Google Ads, Meta Ads, or building an outbound B2B sales pipeline." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "leadGeneration", label: "Lead Generation Process", placeholder: "How do you source contact details of prospects?" },
      { fieldKey: "salesCycleLength", label: "Estimated Sales Cycle", placeholder: "1 day, 2 weeks, 3 months?" }
    ]
  },
  {
    moduleId: 23,
    title: "Social Media",
    description: "Build communities and engage with target customers across multiple channels.",
    track: 4,
    trackName: "Marketing",
    order: 5,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder23",
      sections: [
        { type: "header", body: "Community and Channels" },
        { type: "text", body: "Building communities on Discord, Slack, LinkedIn, or Reddit. Engaging with target customers online." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "socialChannels", label: "Key Channels to Own", placeholder: "LinkedIn, Twitter, TikTok, Instagram, Reddit?" },
      { fieldKey: "communityHub", label: "Community Platform", placeholder: "Where will your community live (e.g., 'Slack group')?" }
    ]
  },
  {
    moduleId: 24,
    title: "PR & Media",
    description: "Secure press coverage, pitch journalists, and launch on Product Hunt successfully.",
    track: 4,
    trackName: "Marketing",
    order: 6,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder24",
      sections: [
        { type: "header", body: "Press Coverage and Pitching Journalists" },
        { type: "text", body: "How to write a press release, contact tech reporters, and launch on Product Hunt." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "prAngle", label: "PR Hook / Angle", placeholder: "What makes your launch newsworthy?" },
      { fieldKey: "productHuntLaunch", label: "Product Hunt Date & Plan", placeholder: "When do you launch and who is your Hunter?" }
    ]
  },
  {
    moduleId: 25,
    title: "Pitch Deck",
    description: "Design compelling investor pitch deck slides with proper flow and visual hierarchy.",
    track: 5,
    trackName: "Fundraising",
    order: 1,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder25",
      sections: [
        { type: "header", body: "Designing the Slides" },
        { type: "text", body: "A deep dive into slide layout, design aesthetic, font readability, and ordering rules for a 10-12 slide deck." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "deckFormat", label: "Deck Style / Format", placeholder: "Google Slides, PDF, Notion, Pitch.com?" },
      { fieldKey: "tractionSlideData", label: "Traction Highlight", placeholder: "What key metric will be the center of your traction slide?" }
    ]
  },
  {
    moduleId: 26,
    title: "Investor Targeting",
    description: "Research investors, identify sector fit, and secure warm introductions strategically.",
    track: 5,
    trackName: "Fundraising",
    order: 2,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder26",
      sections: [
        { type: "header", body: "Finding the Right Capital" },
        { type: "text", body: "How to research investors on Crunchbase, verify sector fit, and request warm introductions." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "investorList", label: "Top 5 Target Investors", placeholder: "List 5 venture firms or angels that fit your sector and stage." },
      { fieldKey: "warmIntroPath", label: "Warm Introduction Plan", placeholder: "Who in your network can introduce you to these targets?" }
    ]
  },
  {
    moduleId: 27,
    title: "Term Sheets",
    description: "Understand SAFEs, convertible notes, valuation caps, and investment terms thoroughly.",
    track: 5,
    trackName: "Fundraising",
    order: 3,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder27",
      sections: [
        { type: "header", body: "Understanding Term Sheet Economics" },
        { type: "text", body: "Pre-money valuation, SAFEs vs Convertible Notes, liquidation preferences, and board seats." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "fundingVehicle", label: "Funding Instrument", placeholder: "SAFE (YC standard), Convertible Note, or Priced Equity?" },
      { fieldKey: "valuationCap", label: "Target Valuation Cap (₹)", placeholder: "What cap are you setting for your SAFE (e.g. ₹5,000,000)?" }
    ]
  },
  {
    moduleId: 28,
    title: "Due Diligence",
    description: "Organize cap tables, contracts, and legal documents in a secure investor data room.",
    track: 5,
    trackName: "Fundraising",
    order: 4,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder28",
      sections: [
        { type: "header", body: "Setting Up Your Data Room" },
        { type: "text", body: "Organizing customer contracts, employee agreements, cap table, and tax filings in a secure folder." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "dataRoomStructure", label: "Data Room Folders", placeholder: "List the 4 folders you have ready (e.g., Legal, Financials, Tech, Corporate)." }
    ]
  },
  {
    moduleId: 29,
    title: "Negotiation",
    description: "Master investor negotiations and handle multi-sheet management with confidence.",
    track: 5,
    trackName: "Fundraising",
    order: 5,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder29",
      sections: [
        { type: "header", body: "Handling Investor Discussions" },
        { type: "text", body: "How to handle valuation pushback, manage multiple term sheets, and create FOMO (Fear Of Missing Out)." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "negotiationLevers", label: "Key Negotiation Levers", placeholder: "What terms are you willing to compromise on? (e.g. Valuation Cap vs Board seat)." }
    ]
  },
  {
    moduleId: 30,
    title: "Closing the Round",
    description: "Execute legal documents, issue certificates, and finalize wire transfers smoothly.",
    track: 5,
    trackName: "Fundraising",
    order: 6,
    price: 999,
    region: "India",
    content: {
      videoUrl: "https://www.youtube.com/embed/placeholder30",
      sections: [
        { type: "header", body: "Signing and Wiring" },
        { type: "text", body: "Closing the legal documents, issuing stock/SAFE certificates, and executing wire transfers." }
      ]
    },
    deliverableSchema: [
      { fieldKey: "closingTimeline", label: "Estimated Closing Date", placeholder: "When do you plan to have funds in bank?" },
      { fieldKey: "firstUseOfCapital", label: "First Use of Capital", placeholder: "What is the first immediate expense you will pay with the new funds?" }
    ]
  }
];
