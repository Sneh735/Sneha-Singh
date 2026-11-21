export interface RoadmapMilestone {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  duration: string;
  description: string;
  skillsToAcquire: string[];
  recommendedCourseId?: string;
  recommendedCourseTitle?: string;
  practicalProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
  resources: { title: string; type: 'Docs' | 'Guide' | 'Course' | 'Repo'; url: string }[];
}

export interface CareerRoadmapData {
  id: string;
  role: string;
  domain: string;
  overview: string;
  estimatedDuration: string;
  averageSalary: string;
  hiringCompanies: string[];
  requiredTechnicalSkills: string[];
  requiredSoftSkills: string[];
  milestones: RoadmapMilestone[];
}

export const CAREER_ROADMAPS: CareerRoadmapData[] = [
  {
    id: 'frontend-dev',
    role: 'Frontend Developer',
    domain: 'Engineering',
    overview: 'Frontend Developers craft responsive, accessible, and high-performance client applications. They translate Figma UI designs into interactive digital experiences using modern frameworks like React, Next.js, and TypeScript.',
    estimatedDuration: '4 - 6 Months · 12 hrs/week',
    averageSalary: '₹8 - 18 LPA (Freshers to 3 yrs)',
    hiringCompanies: ['Razorpay', 'Swiggy', 'Flipkart', 'Postman', 'Zepto'],
    requiredTechnicalSkills: ['HTML5 & Semantic DOM', 'CSS3 & Tailwind CSS', 'JavaScript (ES6+)', 'TypeScript', 'React 19', 'Next.js App Router', 'State Management (Zustand/Redux)', 'REST APIs & Fetch'],
    requiredSoftSkills: ['Attention to Detail', 'Design Empathy', 'Cross-Functional Collaboration', 'Problem Solving'],
    milestones: [
      {
        id: 'fe-lvl1',
        level: 'Beginner',
        title: 'Level 1: Web Foundations & Modern JavaScript',
        duration: 'Month 1 - 2',
        description: 'Master semantic layout architecture, responsive Flexbox/Grid systems, DOM manipulation, and asynchronous JavaScript with Promises and async/await.',
        skillsToAcquire: ['Semantic HTML5', 'Responsive CSS3', 'Flexbox & CSS Grid', 'Tailwind CSS', 'ES6+ Syntax', 'DOM Manipulation', 'Async/Await & Promises'],
        recommendedCourseId: 'web-dev-101',
        recommendedCourseTitle: 'Full-Stack Web Architecture',
        practicalProject: {
          title: 'Interactive SaaS Analytics Dashboard',
          description: 'Build a mobile-first dashboard with dark/light mode toggle, dynamic data filtering, and responsive charts.',
          deliverables: ['Semantic HTML & Tailwind layout', 'Debounced search & filter', 'Zero Cumulative Layout Shift (CLS)']
        },
        resources: [
          { title: 'MDN Web Docs (JavaScript Guide)', type: 'Docs', url: 'https://developer.mozilla.org' },
          { title: 'SkillHire Web Dev Module', type: 'Course', url: '#course-web-dev' }
        ]
      },
      {
        id: 'fe-lvl2',
        level: 'Intermediate',
        title: 'Level 2: React 19 Ecosystem & State Architecture',
        duration: 'Month 3 - 4',
        description: 'Deep dive into component lifecycle, hooks (useState, useEffect, useMemo, useCallback), custom hooks, routing, and client-server synchronization.',
        skillsToAcquire: ['React 19 Components', 'Hooks Architecture', 'TypeScript with React', 'Zustand State Management', 'TanStack Query / SWR', 'API Integration'],
        recommendedCourseId: 'react-701',
        recommendedCourseTitle: 'Modern React 19 & Frontend Architecture',
        practicalProject: {
          title: 'E-Commerce Storefront with Real-Time Cart & Checkout',
          description: 'Create an online shopping app with persistent cart state, optimistic updates, and animated page transitions with Framer Motion.',
          deliverables: ['Global Zustand cart state', 'Custom debounced search hook', '100% TypeScript typed props']
        },
        resources: [
          { title: 'React 19 Official Documentation', type: 'Docs', url: 'https://react.dev' },
          { title: 'SkillHire React Certification Exam', type: 'Course', url: '#course-react' }
        ]
      },
      {
        id: 'fe-lvl3',
        level: 'Advanced',
        title: 'Level 3: Next.js, Performance Optimization & Production Scaling',
        duration: 'Month 5 - 6',
        description: 'Master React Server Components, Server-Side Rendering (SSR), Core Web Vitals optimization, bundle analysis, and automated CI/CD testing.',
        skillsToAcquire: ['Next.js App Router', 'Server Components (RSC)', 'Web Vitals (LCP, INP, CLS)', 'Code Splitting & Lazy Loading', 'Unit Testing with Vitest', 'CI/CD Deployment'],
        recommendedCourseId: 'cloud-1001',
        recommendedCourseTitle: 'Cloud Infrastructure & DevOps',
        practicalProject: {
          title: 'Full-Stack Production Job Portal with Server Actions',
          description: 'Architect a server-rendered job platform with instant search indexing, SEO metadata, and Vercel/Docker production deployment.',
          deliverables: ['Lighthouse Performance score > 95', 'End-to-end testing with Playwright', 'Secure authentication & cookies']
        },
        resources: [
          { title: 'Next.js App Router Mastery', type: 'Docs', url: 'https://nextjs.org/docs' },
          { title: 'Web Vitals Performance Handbook', type: 'Guide', url: 'https://web.dev/vitals' }
        ]
      }
    ]
  },
  {
    id: 'backend-dev',
    role: 'Backend Developer',
    domain: 'Engineering',
    overview: 'Backend Developers architect secure, resilient server-side services, APIs, and databases. They handle business logic, distributed data pipelines, transactional ACID safety, and cloud microservices.',
    estimatedDuration: '4 - 6 Months · 12 hrs/week',
    averageSalary: '₹9 - 22 LPA',
    hiringCompanies: ['CRED', 'Infosys Finacle', 'Google Cloud', 'Paytm', 'PhonePe'],
    requiredTechnicalSkills: ['Java Spring Boot / Node.js / Python', 'SQL & PostgreSQL', 'RESTful & GraphQL APIs', 'Redis Caching', 'Kafka / RabbitMQ', 'Docker', 'Authentication & JWT'],
    requiredSoftSkills: ['Analytical Rigor', 'System Design Thinking', 'Security Mindset', 'Communication'],
    milestones: [
      {
        id: 'be-lvl1',
        level: 'Beginner',
        title: 'Level 1: Server Runtimes, HTTP Protocols & Relational SQL',
        duration: 'Month 1 - 2',
        description: 'Learn request-response lifecycles, RESTful design principles, database normalization, indexing, and writing robust SQL queries.',
        skillsToAcquire: ['HTTP Methods & Status Codes', 'Node.js Express / Spring Boot Basics', 'Relational Databases (SQL)', 'Table Normalization (3NF)', 'Complex JOINs & Subqueries', 'Environment Secrets Management'],
        recommendedCourseId: 'sql-901',
        recommendedCourseTitle: 'Relational Databases & Advanced SQL',
        practicalProject: {
          title: 'RESTful Student Academic & Grade Management API',
          description: 'Build a secure REST API with CRUD endpoints, relational foreign keys, input validation, and SQLite/PostgreSQL storage.',
          deliverables: ['Swagger / OpenAPI Documentation', 'Input sanitization & error middleware', 'Relational database migrations']
        },
        resources: [
          { title: 'REST API Architectural Constraints', type: 'Guide', url: 'https://restfulapi.net' },
          { title: 'SkillHire SQL Masterclass', type: 'Course', url: '#course-sql' }
        ]
      },
      {
        id: 'be-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Authentication, ORMs & Caching Architecture',
        duration: 'Month 3 - 4',
        description: 'Implement secure JWT authentication, password hashing, role-based access control (RBAC), Prisma / Hibernate ORMs, and Redis in-memory caching.',
        skillsToAcquire: ['JWT & Refresh Tokens', 'Bcrypt Hashing', 'Role-Based Access Control', 'Redis Caching', 'Database Indexing & Query Tuning', 'Microservices Basics'],
        recommendedCourseId: 'node-801',
        recommendedCourseTitle: 'Node.js Backend & Scalable APIs',
        practicalProject: {
          title: 'Scalable Fintech Payment Transaction Engine',
          description: 'Design a double-entry ledger service with atomic transactions, idempotency keys, and sub-10ms Redis balance caching.',
          deliverables: ['ACID-compliant transactions', 'Rate limiting middleware', 'Idempotent checkout endpoints']
        },
        resources: [
          { title: 'OWASP Backend Security Guide', type: 'Guide', url: 'https://owasp.org' },
          { title: 'Redis In-Memory Architecture', type: 'Docs', url: 'https://redis.io/docs' }
        ]
      },
      {
        id: 'be-lvl3',
        level: 'Advanced',
        title: 'Level 3: Distributed Systems, Message Queues & Docker',
        duration: 'Month 5 - 6',
        description: 'Scale systems horizontally with Docker containers, asynchronous event streaming (Kafka/RabbitMQ), and database read-replicas.',
        skillsToAcquire: ['Docker & Containerization', 'Asynchronous Event Queues (Kafka)', 'Horizontal Scaling & Load Balancing', 'Database Sharding & Replication', 'Prometheus & Grafana Monitoring'],
        recommendedCourseId: 'cloud-1001',
        recommendedCourseTitle: 'Cloud Infrastructure & DevOps',
        practicalProject: {
          title: 'Distributed Asynchronous Notification Hub',
          description: 'Implement a high-throughput message consumer service that dispatches thousands of emails/push alerts via Kafka queues without blocking web servers.',
          deliverables: ['Dockerized multi-service compose', 'Dead-letter queue error recovery', 'Real-time throughput metrics']
        },
        resources: [
          { title: 'Designing Data-Intensive Applications', type: 'Guide', url: 'https://dataintensive.net' },
          { title: 'Docker Production Best Practices', type: 'Docs', url: 'https://docs.docker.com' }
        ]
      }
    ]
  },
  {
    id: 'fullstack-dev',
    role: 'Full Stack Developer',
    domain: 'Engineering',
    overview: 'Full Stack Developers bridge the gap between user experience and system architecture. They build end-to-end applications from responsive frontend interfaces to scalable backend APIs and database schemas.',
    estimatedDuration: '6 Months · 15 hrs/week',
    averageSalary: '₹10 - 24 LPA',
    hiringCompanies: ['Swiggy', 'Zomato', 'Atlassian', 'Microsoft', 'Razorpay'],
    requiredTechnicalSkills: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'PostgreSQL / MongoDB', 'Tailwind CSS', 'Docker', 'Git & CI/CD', 'REST & GraphQL'],
    requiredSoftSkills: ['End-to-End Ownership', 'Product Thinking', 'Agile Mindset', 'Adaptability'],
    milestones: [
      {
        id: 'fs-lvl1',
        level: 'Beginner',
        title: 'Level 1: Client & Server Core Protocols',
        duration: 'Month 1 - 2',
        description: 'Connect responsive frontend web pages with backend endpoints, handling JSON payloads and basic database queries.',
        skillsToAcquire: ['HTML5/CSS3/JavaScript', 'Tailwind CSS', 'Node.js Core', 'Express.js', 'PostgreSQL Basics', 'Git Version Control'],
        recommendedCourseId: 'web-dev-101',
        recommendedCourseTitle: 'Full-Stack Web Architecture',
        practicalProject: {
          title: 'Collaborative Notes & Task Manager',
          description: 'Build a full-stack CRUD application where users can create, tag, and organize notes with real-time UI updates.',
          deliverables: ['Connected React UI + Express backend', 'PostgreSQL relational database schema', 'Input validation on client and server']
        },
        resources: [
          { title: 'The Odin Project Full Stack Path', type: 'Guide', url: 'https://theodinproject.com' },
          { title: 'SkillHire Web Architecture Course', type: 'Course', url: '#course-web-dev' }
        ]
      },
      {
        id: 'fs-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Modern React, TypeScript & Secure APIs',
        duration: 'Month 3 - 4',
        description: 'Unify frontend and backend codebases using TypeScript, secure authentication tokens, and state management.',
        skillsToAcquire: ['React 19 & TypeScript', 'Prisma ORM / Mongoose', 'JWT Authentication & Refresh Flow', 'Cloud Storage for Uploads', 'RESTful API Standards'],
        recommendedCourseId: 'react-701',
        recommendedCourseTitle: 'Modern React 19 & Frontend Architecture',
        practicalProject: {
          title: 'Campus Job & Internship Referral Board',
          description: 'A platform connecting verified recruiters with college freshers, complete with profile builders and application status tracking.',
          deliverables: ['Role-based authentication (Student vs Recruiter)', 'PDF resume parsing & storage', 'Animated filtering & search']
        },
        resources: [
          { title: 'TypeScript Deep Dive Handbook', type: 'Docs', url: 'https://typescriptlang.org' },
          { title: 'SkillHire React Certification', type: 'Course', url: '#course-react' }
        ]
      },
      {
        id: 'fs-lvl3',
        level: 'Advanced',
        title: 'Level 3: Full Stack Next.js & Cloud Production',
        duration: 'Month 5 - 6',
        description: 'Deploy full-stack monorepos with Next.js App Router, automated CI/CD pipelines, Docker containers, and database replication.',
        skillsToAcquire: ['Next.js Server Actions', 'Docker Containerization', 'AWS / Vercel Cloud Deployment', 'CI/CD with GitHub Actions', 'Redis Caching & WebSockets'],
        recommendedCourseId: 'cloud-1001',
        recommendedCourseTitle: 'Cloud Infrastructure & DevOps',
        practicalProject: {
          title: 'Real-Time Collaborative Code & Interview Workspace',
          description: 'Full-stack platform with live code editor, speech/video chat integration, and automated code execution container.',
          deliverables: ['WebSocket real-time synchronization', 'Dockerized sandbox execution', 'Production SSL & Custom Domain deployment']
        },
        resources: [
          { title: 'Full Stack Open University of Helsinki', type: 'Guide', url: 'https://fullstackopen.com' },
          { title: 'SkillHire Cloud & DevOps Certification', type: 'Course', url: '#course-cloud' }
        ]
      }
    ]
  },
  {
    id: 'ai-ml-engineer',
    role: 'AI / ML Engineer',
    domain: 'Data & AI',
    overview: 'AI & Machine Learning Engineers build, train, evaluate, and deploy intelligent algorithms and neural networks. They work on predictive models, computer vision, natural language processing (NLP), and large language models (LLMs).',
    estimatedDuration: '6 Months · 15 hrs/week',
    averageSalary: '₹12 - 26 LPA',
    hiringCompanies: ['Zomato AI Labs', 'Swiggy Tech', 'Google', 'Microsoft', 'NVIDIA'],
    requiredTechnicalSkills: ['Python (Advanced)', 'Linear Algebra & Calculus', 'Pandas, NumPy, Scikit-Learn', 'PyTorch / TensorFlow', 'Deep Learning & CNNs', 'Transformer Architecture & LLMs', 'FastAPI & Model Deployment'],
    requiredSoftSkills: ['Scientific Rigor', 'Mathematical Intuition', 'Experimentation Discipline', 'Technical Communication'],
    milestones: [
      {
        id: 'aiml-lvl1',
        level: 'Beginner',
        title: 'Level 1: Mathematics of ML & Classical Algorithms',
        duration: 'Month 1 - 2',
        description: 'Master vector math, matrices, derivatives, data manipulation with Pandas, and supervised learning algorithms (Regression, Decision Trees).',
        skillsToAcquire: ['Python Data Stack (NumPy, Pandas)', 'Linear Algebra & Statistics', 'Exploratory Data Analysis (EDA)', 'Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Cross-Validation & Metrics (F1, AUC)'],
        recommendedCourseId: 'aiml-501',
        recommendedCourseTitle: 'Machine Learning & Applied AI Systems',
        practicalProject: {
          title: 'Predictive Candidate Hiring & Salary Estimator',
          description: 'Train and evaluate multiple regression and classification models to predict salary bands and hiring likelihood based on candidate skills.',
          deliverables: ['Jupyter notebook with comprehensive EDA', 'Hyperparameter tuning with GridSearchCV', 'Model evaluation report']
        },
        resources: [
          { title: 'Scikit-Learn User Guide', type: 'Docs', url: 'https://scikit-learn.org' },
          { title: 'SkillHire Machine Learning Module', type: 'Course', url: '#course-aiml' }
        ]
      },
      {
        id: 'aiml-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Deep Learning & Neural Networks with PyTorch',
        duration: 'Month 3 - 4',
        description: 'Understand backpropagation, activation functions, Multilayer Perceptrons (MLPs), Convolutional Neural Networks (CNNs), and PyTorch tensors.',
        skillsToAcquire: ['PyTorch Tensor Operations', 'Feedforward Neural Networks', 'Loss Functions & Optimizers (Adam, SGD)', 'Computer Vision with CNNs', 'Transfer Learning (ResNet)', 'Overfitting Mitigation (Dropout, BatchNorm)'],
        recommendedCourseId: 'aiml-501',
        recommendedCourseTitle: 'Machine Learning & Applied AI Systems',
        practicalProject: {
          title: 'Document & Resume Text Classification Model',
          description: 'Construct a deep neural network that automatically categorizes uploaded PDFs into specific engineering domains (Frontend, Backend, AI/ML, Design).',
          deliverables: ['PyTorch training & validation loop', 'Confusion matrix visualization', 'Saved model checkpoint weights']
        },
        resources: [
          { title: 'PyTorch Deep Learning Tutorials', type: 'Docs', url: 'https://pytorch.org/tutorials' },
          { title: 'Fast.ai Practical Deep Learning', type: 'Guide', url: 'https://fast.ai' }
        ]
      },
      {
        id: 'aiml-lvl3',
        level: 'Advanced',
        title: 'Level 3: Transformers, LLMs & Production MLOps',
        duration: 'Month 5 - 6',
        description: 'Fine-tune open-weights models, work with vector embeddings (Pinecone, ChromaDB), Retrieval-Augmented Generation (RAG), and deploy APIs with FastAPI and Docker.',
        skillsToAcquire: ['Attention Mechanism & Transformers', 'Vector Embeddings & Semantic Search', 'Retrieval-Augmented Generation (RAG)', 'FastAPI Model Serving', 'Docker for ML Workloads', 'Model Monitoring & Drift Detection'],
        recommendedCourseId: 'cloud-1001',
        recommendedCourseTitle: 'Cloud Infrastructure & DevOps',
        practicalProject: {
          title: 'Autonomous Career Mentor & AI RAG Assistant',
          description: 'Deploy an intelligent career advisor that ingests company job specs, performs semantic vector search, and generates contextual interview advice.',
          deliverables: ['Vector database embedding pipeline', 'Sub-200ms FastAPI inference API', 'Containerized Docker production image']
        },
        resources: [
          { title: 'Hugging Face NLP Course', type: 'Guide', url: 'https://huggingface.co/learn' },
          { title: 'DeepLearning.AI Short Courses', type: 'Guide', url: 'https://deeplearning.ai' }
        ]
      }
    ]
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst',
    domain: 'Data & AI',
    overview: 'Data Analysts transform raw numbers and database records into actionable business insights. They write advanced SQL queries, clean complex datasets, and build executive Power BI and Tableau dashboards to guide company strategy.',
    estimatedDuration: '4 Months · 10 hrs/week',
    averageSalary: '₹6 - 15 LPA',
    hiringCompanies: ['Flipkart', 'PhonePe', 'Deloitte', 'Amazon', 'EY'],
    requiredTechnicalSkills: ['Advanced SQL (JOINs, Window Functions)', 'Microsoft Power BI / Tableau', 'Advanced Excel & Pivot Tables', 'Python for Analytics (Pandas)', 'Data Modeling & DAX', 'Business KPI Frameworks'],
    requiredSoftSkills: ['Business Acumen', 'Data Storytelling', 'Stakeholder Communication', 'Curiosity'],
    milestones: [
      {
        id: 'da-lvl1',
        level: 'Beginner',
        title: 'Level 1: Advanced Excel & SQL Data Querying',
        duration: 'Month 1 - 2',
        description: 'Master spreadsheet modeling, VLOOKUP/XLOOKUP, relational databases, filtering, aggregations, and window ranking functions.',
        skillsToAcquire: ['Advanced Excel Formulas & Pivot Tables', 'SQL SELECT, WHERE, GROUP BY', 'INNER/LEFT/RIGHT JOINs', 'Subqueries & CTEs', 'Window Functions (ROW_NUMBER, RANK)'],
        recommendedCourseId: 'sql-901',
        recommendedCourseTitle: 'Relational Databases & Advanced SQL',
        practicalProject: {
          title: 'E-Commerce Festive Sales & Customer Churn Analysis',
          description: 'Analyze 500,000 transaction records in SQL to determine customer acquisition costs, repeat purchase rates, and revenue leaks.',
          deliverables: ['Cleaned SQL dataset', 'Cohort retention analysis table', 'Executive summary presentation']
        },
        resources: [
          { title: 'SQLZoo Interactive SQL Tutorial', type: 'Guide', url: 'https://sqlzoo.net' },
          { title: 'SkillHire Advanced SQL Module', type: 'Course', url: '#course-sql' }
        ]
      },
      {
        id: 'da-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Power BI, DAX & Executive Dashboards',
        duration: 'Month 3',
        description: 'Model relational star-schemas in Power BI, write custom DAX measures, and design clean interactive visual reports.',
        skillsToAcquire: ['Power BI Desktop', 'Star Schema & Snowflake Data Modeling', 'DAX Expressions (CALCULATE, FILTER)', 'Interactive Drill-Through Visuals', 'KPI Tracking & Alerts'],
        recommendedCourseId: 'biz-2301',
        recommendedCourseTitle: 'Business Analytics & Power BI',
        practicalProject: {
          title: 'C-Suite Executive Business KPI Dashboard',
          description: 'Design an interactive Power BI report with MoM growth rates, customer lifetime value (CLV), and geographic heatmaps.',
          deliverables: ['Published interactive Power BI report', 'Optimized DAX measures with zero performance lag', 'Color-coded KPI alert cards']
        },
        resources: [
          { title: 'Microsoft Power BI Official Documentation', type: 'Docs', url: 'https://learn.microsoft.com/power-bi' },
          { title: 'SkillHire Power BI Certification Exam', type: 'Course', url: '#course-biz' }
        ]
      },
      {
        id: 'da-lvl3',
        level: 'Advanced',
        title: 'Level 3: Python for Analytics & Statistical Storytelling',
        duration: 'Month 4',
        description: 'Automate repetitive reporting tasks with Python, perform statistical hypothesis testing, and present insights to stakeholders.',
        skillsToAcquire: ['Python Pandas & NumPy', 'Data Visualization (Matplotlib, Seaborn)', 'Hypothesis Testing (A/B Testing)', 'Automated Email Reporting', 'Executive Presentation'],
        recommendedCourseId: 'ds-601',
        recommendedCourseTitle: 'Data Science & Quantitative Analytics',
        practicalProject: {
          title: 'Automated Marketing Funnel & A/B Test Evaluator',
          description: 'Python script and dashboard evaluating conversion rates between landing page variants with p-value statistical significance.',
          deliverables: ['Automated ETL cleaning script', 'Statistical A/B test confidence interval graph', 'Actionable recommendation memo']
        },
        resources: [
          { title: 'Storytelling with Data by Cole Nussbaumer', type: 'Guide', url: 'https://storytellingwithdata.com' },
          { title: 'SkillHire Data Science Track', type: 'Course', url: '#course-ds' }
        ]
      }
    ]
  },
  {
    id: 'data-scientist',
    role: 'Data Scientist',
    domain: 'Data & AI',
    overview: 'Data Scientists combine programming, mathematics, and business strategy to extract predictive patterns from big data. They formulate hypotheses, train machine learning models, and build experimental frameworks.',
    estimatedDuration: '6 Months · 15 hrs/week',
    averageSalary: '₹11 - 25 LPA',
    hiringCompanies: ['Swiggy', 'Zomato', 'Amazon', 'Fractal Analytics', 'Microsoft'],
    requiredTechnicalSkills: ['Python & R', 'Probability & Statistics', 'SQL & Data Warehouses', 'Machine Learning Algorithms', 'Feature Engineering', 'Big Data (Spark basics)', 'Model Interpretation (SHAP/LIME)'],
    requiredSoftSkills: ['Critical Inquiry', 'Hypothesis Formulation', 'Translating Data to Strategy', 'Communication'],
    milestones: [
      {
        id: 'ds-lvl1',
        level: 'Beginner',
        title: 'Level 1: Statistical Foundations & Exploratory Data Analysis',
        duration: 'Month 1 - 2',
        description: 'Master distributions, Bayes theorem, central limit theorem, hypothesis testing, and exploratory data visualization with Seaborn.',
        skillsToAcquire: ['Probability Distributions', 'Inferential Statistics & Confidence Intervals', 'Pandas & NumPy Advanced Wrangling', 'Data Cleaning & Outlier Imputation', 'Data Storytelling with Seaborn'],
        recommendedCourseId: 'ds-601',
        recommendedCourseTitle: 'Data Science & Quantitative Analytics',
        practicalProject: {
          title: 'Comprehensive Healthcare Outcomes Exploratory Study',
          description: 'Analyze patient health metrics across 100,000 records, discovering non-linear correlations and significant demographic variances.',
          deliverables: ['Statistical hypothesis testing write-up', 'Interactive correlation matrix', 'Cleaned feature dataset']
        },
        resources: [
          { title: 'StatQuest with Josh Starmer', type: 'Guide', url: 'https://statquest.org' },
          { title: 'SkillHire Data Science Exam', type: 'Course', url: '#course-ds' }
        ]
      },
      {
        id: 'ds-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Predictive Machine Learning & Feature Engineering',
        duration: 'Month 3 - 4',
        description: 'Construct end-to-end predictive models, handle imbalanced datasets (SMOTE), engineer interaction features, and tune hyperparameters.',
        skillsToAcquire: ['Feature Engineering & Encoding', 'Imbalanced Data Handling (SMOTE)', 'Ensemble Modeling (XGBoost, LightGBM)', 'Model Explainability (SHAP Values)', 'Pipeline Construction with Scikit-Learn'],
        recommendedCourseId: 'aiml-501',
        recommendedCourseTitle: 'Machine Learning & Applied AI Systems',
        practicalProject: {
          title: 'Loan Default Prediction & Risk Classification Model',
          description: 'Train an XGBoost model on financial loan application records, explaining risk drivers using SHAP attribution plots.',
          deliverables: ['Scikit-Learn ColumnTransformer pipeline', 'ROC-AUC > 0.88 benchmark model', 'Feature importance summary deck']
        },
        resources: [
          { title: 'XGBoost Documentation', type: 'Docs', url: 'https://xgboost.readthedocs.io' },
          { title: 'SHAP Interpretability Toolkit', type: 'Docs', url: 'https://shap.readthedocs.io' }
        ]
      },
      {
        id: 'ds-lvl3',
        level: 'Advanced',
        title: 'Level 3: Production ML Pipelines, Big Data & Causal Inference',
        duration: 'Month 5 - 6',
        description: 'Build reproducible ML pipelines with MLflow, deploy APIs with FastAPI, and conduct rigorous causal impact analyses.',
        skillsToAcquire: ['Experiment Tracking with MLflow', 'FastAPI Prediction Endpoints', 'Causal Inference & Quasi-Experiments', 'Big Data Processing with PySpark', 'Automated Retraining Pipelines'],
        recommendedCourseId: 'cloud-1001',
        recommendedCourseTitle: 'Cloud Infrastructure & DevOps',
        practicalProject: {
          title: 'Real-Time Dynamic Pricing & Demand Forecasting Engine',
          description: 'Containerized API forecasting ride-share or grocery delivery demand in real-time, complete with automated drift detection.',
          deliverables: ['FastAPI REST endpoint', 'MLflow experiment registry', 'Docker production deployment script']
        },
        resources: [
          { title: 'MLflow Production Registry', type: 'Docs', url: 'https://mlflow.org' },
          { title: 'Causal Inference for the Brave and True', type: 'Guide', url: 'https://matheusfacure.github.io' }
        ]
      }
    ]
  },
  {
    id: 'uiux-designer',
    role: 'UI/UX Designer',
    domain: 'Design',
    overview: 'UI/UX Designers sculpt how people experience digital products. They empathize with users, conduct usability tests, craft wireframes and design systems in Figma, and guarantee accessible visual harmony.',
    estimatedDuration: '4 - 5 Months · 10 hrs/week',
    averageSalary: '₹7 - 18 LPA',
    hiringCompanies: ['Adobe', 'Razorpay', 'Flipkart', 'CRED', 'Swiggy'],
    requiredTechnicalSkills: ['Figma (Mastery)', 'Wireframing & Information Architecture', 'Design Systems & Tokens', 'Auto-Layout & Variants', 'Interactive Prototyping', 'User Research & Personas', 'Usability Testing'],
    requiredSoftSkills: ['Empathy', 'Visual Storytelling', 'Active Listening', 'Constructive Feedback Receptivity'],
    milestones: [
      {
        id: 'uiux-lvl1',
        level: 'Beginner',
        title: 'Level 1: UX Foundations, User Research & Wireframing',
        duration: 'Month 1 - 2',
        description: 'Understand the 5 stages of Design Thinking, conduct user interviews, construct empathy maps, and create grayscale wireframes.',
        skillsToAcquire: ['Design Thinking Framework', 'User Research Methodologies', 'User Personas & Journey Mapping', 'Information Architecture', 'Low-Fidelity Grayscale Wireframing'],
        recommendedCourseId: 'uiux-2001',
        recommendedCourseTitle: 'UI/UX Design & Product Experience',
        practicalProject: {
          title: 'Campus Food Delivery & Meal Booking App Concept',
          description: 'Conduct 5 user interviews with college students, pinpoint checkout friction points, and draw comprehensive mobile wireframe flows.',
          deliverables: ['User journey map & empathy map', '20+ grayscale wireframe screens', 'Heuristic evaluation report']
        },
        resources: [
          { title: 'Nielsen Norman Group UX Articles', type: 'Guide', url: 'https://nngroup.com' },
          { title: 'SkillHire UI/UX Certification Module', type: 'Course', url: '#course-uiux' }
        ]
      },
      {
        id: 'uiux-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Figma Mastery, Auto-Layout & Design Systems',
        duration: 'Month 3',
        description: 'Master Figma components, variants, design tokens (colors, typography scales), auto-layout responsiveness, and WCAG accessibility standards.',
        skillsToAcquire: ['Figma Auto-Layout', 'Component Variants & Properties', 'Atomic Design Tokens', 'WCAG AA Color Contrast Standards', 'Responsive Layout Grids'],
        recommendedCourseId: 'uiux-2001',
        recommendedCourseTitle: 'UI/UX Design & Product Experience',
        practicalProject: {
          title: 'Scalable Enterprise Design System for FinTech',
          description: 'Construct a complete atomic design system in Figma with button states, input fields, badges, modals, and dark/light mode themes.',
          deliverables: ['Figma library with 50+ component variants', 'Design token documentation sheet', 'Zero WCAG color contrast violations']
        },
        resources: [
          { title: 'Figma Auto-Layout Masterclass', type: 'Docs', url: 'https://figma.com/resources' },
          { title: 'Material Design 3 Guidelines', type: 'Guide', url: 'https://m3.material.io' }
        ]
      },
      {
        id: 'uiux-lvl3',
        level: 'Advanced',
        title: 'Level 3: High-Fidelity Prototyping, Usability Testing & Handoff',
        duration: 'Month 4 - 5',
        description: 'Build interactive prototypes with micro-interactions, run unmoderated user tests (Maze), and write pixel-perfect developer handoff specifications.',
        skillsToAcquire: ['Figma Smart Animate & Micro-Interactions', 'Interactive State Prototyping', 'Usability Testing & Task Completion Metrics', 'Developer Handoff Documentation', 'Design Portfolio Presentation'],
        recommendedCourseId: 'uiux-2001',
        recommendedCourseTitle: 'UI/UX Design & Product Experience',
        practicalProject: {
          title: 'Flagship Portfolio Case Study & Clickable App',
          description: 'An end-to-end published case study showcasing problem definition, iterations, user testing validation metrics, and final prototype.',
          deliverables: ['Clickable interactive Figma prototype', 'Published Notion / Behance case study', 'Developer specification sheet']
        },
        resources: [
          { title: 'Laws of UX Principles Guide', type: 'Guide', url: 'https://lawsofux.com' },
          { title: 'Checklist Design Handoff Specs', type: 'Guide', url: 'https://checklist.design' }
        ]
      }
    ]
  },
  {
    id: 'product-manager',
    role: 'Project / Product Manager',
    domain: 'Management',
    overview: 'Product and Project Managers steer technology initiatives from concept to launch. They define product visions, write detailed Product Requirement Documents (PRDs), prioritize features, and coordinate cross-functional engineering and design teams.',
    estimatedDuration: '4 - 5 Months · 10 hrs/week',
    averageSalary: '₹12 - 28 LPA',
    hiringCompanies: ['Microsoft', 'Amazon', 'Blinkit', 'Razorpay', 'Atlassian'],
    requiredTechnicalSkills: ['Product Strategy & Roadmapping', 'PRD & User Story Writing', 'Agile, Scrum & Sprint Ceremonies', 'Data Analytics & Funnel Tracking', 'A/B Testing Frameworks', 'Jira / Linear Mastery', 'Competitive Analysis'],
    requiredSoftSkills: ['Leadership Without Authority', 'Strategic Prioritization', 'Stakeholder Alignment', 'Negotiation', 'Executive Communication'],
    milestones: [
      {
        id: 'pm-lvl1',
        level: 'Beginner',
        title: 'Level 1: Product Fundamentals, Problem Discovery & Agile',
        duration: 'Month 1 - 2',
        description: 'Understand the Product Lifecycle, user problem discovery, Minimum Viable Product (MVP) scoping, and Agile Scrum sprint ceremonies.',
        skillsToAcquire: ['Product Lifecycle Stages', 'Problem Statement Formulation', 'MVP Scoping & Lean Canvas', 'Agile & Scrum Frameworks', 'Sprint Planning & Backlog Grooming'],
        recommendedCourseId: 'pm-2101',
        recommendedCourseTitle: 'Product Management & Agile Leadership',
        practicalProject: {
          title: 'Campus Peer Tutoring Marketplace PRD',
          description: 'Draft a comprehensive Product Requirement Document (PRD) detailing user personas, functional specs, out-of-scope boundaries, and success metrics.',
          deliverables: ['Complete 5-page PRD document', 'Lean canvas business model', 'User story map with acceptance criteria']
        },
        resources: [
          { title: 'Lenny’s Product Management Guide', type: 'Guide', url: 'https://lennysnewsletter.com' },
          { title: 'SkillHire PM Certification Module', type: 'Course', url: '#course-pm' }
        ]
      },
      {
        id: 'pm-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Metrics, Prioritization & Feature Execution',
        duration: 'Month 3',
        description: 'Master prioritization frameworks (RICE, MoSCoW), define North Star metrics, track retention funnels, and manage sprints in Jira/Linear.',
        skillsToAcquire: ['RICE Prioritization Framework', 'North Star Metric Definition', 'Cohort Retention & Funnel Drop-off', 'User Acceptance Criteria (Gherkin syntax)', 'Jira / Linear Issue Management'],
        recommendedCourseId: 'pm-2101',
        recommendedCourseTitle: 'Product Management & Agile Leadership',
        practicalProject: {
          title: 'Checkout Conversion Optimization Strategy & Backlog',
          description: 'Prioritize a 15-feature backlog using the RICE formula to maximize payment completion rates for a consumer shopping platform.',
          deliverables: ['RICE scoring matrix spreadsheet', 'Groomed Jira/Linear sprint backlog', 'Executive roadmap presentation']
        },
        resources: [
          { title: 'Atlassian Agile Coach Guide', type: 'Guide', url: 'https://atlassian.com/agile' },
          { title: 'Product School Resource Hub', type: 'Docs', url: 'https://productschool.com' }
        ]
      },
      {
        id: 'pm-lvl3',
        level: 'Advanced',
        title: 'Level 3: Go-to-Market (GTM), A/B Testing & Executive Leadership',
        duration: 'Month 4 - 5',
        description: 'Formulate Go-to-Market launch playbooks, design statistical A/B experiments, analyze market feedback, and align executive leadership.',
        skillsToAcquire: ['Go-to-Market (GTM) Strategy', 'A/B Testing Experiment Design', 'Stakeholder Management & Negotiation', 'Post-Launch Product Analytics', 'Executive Presentation Deck'],
        recommendedCourseId: 'biz-2301',
        recommendedCourseTitle: 'Business Analytics & Power BI',
        practicalProject: {
          title: 'End-to-End Product Launch & GTM Deck for AI Assistant',
          description: 'Create a full launch playbook including pricing tiers, competitive differentiation, marketing alignment, and 30-60-90 day KPI targets.',
          deliverables: ['15-slide executive pitch deck', 'A/B test launch plan', 'Risk mitigation playbook']
        },
        resources: [
          { title: 'Inspired by Marty Cagan', type: 'Guide', url: 'https://svpg.com' },
          { title: 'SkillHire PM Certification Assessment', type: 'Course', url: '#course-pm' }
        ]
      }
    ]
  },
  {
    id: 'digital-marketing',
    role: 'Digital Marketing Specialist',
    domain: 'Marketing',
    overview: 'Digital Marketing Specialists accelerate user acquisition and brand visibility. They run high-converting Pay-Per-Click (PPC) ad campaigns, optimize technical SEO for search engine rankings, and build viral product-led growth loops.',
    estimatedDuration: '4 Months · 10 hrs/week',
    averageSalary: '₹6 - 15 LPA',
    hiringCompanies: ['Atlassian', 'Zomato', 'Amazon India', 'Nykaa', 'Swiggy'],
    requiredTechnicalSkills: ['Search Engine Optimization (SEO)', 'Google Analytics 4 (GA4)', 'Pay-Per-Click Advertising (Google & Meta Ads)', 'Conversion Rate Optimization (CRO)', 'Email Marketing & Drip Campaigns', 'Content Marketing', 'A/B Testing'],
    requiredSoftSkills: ['Copywriting Creativity', 'Data-Driven Mindset', 'Consumer Psychology', 'Analytical Curiosity'],
    milestones: [
      {
        id: 'mkt-lvl1',
        level: 'Beginner',
        title: 'Level 1: SEO Mastery & Content Architecture',
        duration: 'Month 1 - 2',
        description: 'Understand search engine algorithms, on-page SEO, technical SEO (schema, sitemaps, page speed), and keyword research tools.',
        skillsToAcquire: ['Keyword Intent & Volume Research', 'On-Page SEO (Meta tags, H1-H6, Image alt)', 'Technical SEO & Core Web Vitals', 'Backlink Building Strategies', 'Content Strategy & Calendars'],
        recommendedCourseId: 'mkt-2201',
        recommendedCourseTitle: 'Digital Marketing, SEO & Growth Hacking',
        practicalProject: {
          title: 'Technical SEO Audit & Keyword Growth Blueprint',
          description: 'Perform a full audit of an existing website, uncover broken links and keyword opportunities, and create a 3-month ranking roadmap.',
          deliverables: ['SEO audit spreadsheet report', '50-keyword target cluster list', 'Optimized pillar content brief']
        },
        resources: [
          { title: 'Google Search Central Documentation', type: 'Docs', url: 'https://developers.google.com/search' },
          { title: 'SkillHire Digital Marketing Module', type: 'Course', url: '#course-mkt' }
        ]
      },
      {
        id: 'mkt-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Paid Ads (PPC), Google Ads & Conversion Funnels',
        duration: 'Month 3',
        description: 'Design, launch, and optimize paid search and social campaigns across Google Ads and Meta Ads Manager with maximum Return on Ad Spend (ROAS).',
        skillsToAcquire: ['Google Search & Display Campaigns', 'Meta Ads Manager (Facebook/Instagram)', 'Ad Copywriting & Creative Hooks', 'Conversion Tracking & Pixels', 'ROAS & CPA Cost Optimization'],
        recommendedCourseId: 'mkt-2201',
        recommendedCourseTitle: 'Digital Marketing, SEO & Growth Hacking',
        practicalProject: {
          title: 'Full-Funnel Paid Advertising Campaign Plan',
          description: 'Develop a ₹50,000 monthly ad budget plan targeting student enrollments with top-of-funnel (TOFU) awareness and bottom-of-funnel (BOFU) retargeting.',
          deliverables: ['Ad copy variations with A/B headlines', 'Target audience persona breakdown', 'Estimated ROAS forecast model']
        },
        resources: [
          { title: 'Google Ads Skillshop Learning', type: 'Docs', url: 'https://skillshop.withgoogle.com' },
          { title: 'SkillHire Digital Marketing Certification', type: 'Course', url: '#course-mkt' }
        ]
      },
      {
        id: 'mkt-lvl3',
        level: 'Advanced',
        title: 'Level 3: GA4 Analytics, Growth Loops & Retention Automation',
        duration: 'Month 4',
        description: 'Track multi-touch attribution in Google Analytics 4, construct automated email drip campaigns, and engineer viral user referral loops.',
        skillsToAcquire: ['Google Analytics 4 (GA4) Event Tracking', 'Multi-Touch Attribution Modeling', 'Email Automation & Drip Funnels', 'Viral Referral Loops (K-Factor)', 'Landing Page Conversion Rate Optimization (CRO)'],
        recommendedCourseId: 'biz-2301',
        recommendedCourseTitle: 'Business Analytics & Power BI',
        practicalProject: {
          title: 'Automated Lifecycle Email & Referral Engine',
          description: 'Design a 7-day onboarding email sequence with personalized dynamic triggers and a viral student referral reward mechanism.',
          deliverables: ['7-email automated sequence copy', 'GA4 custom event tracking schema', 'CRO landing page wireframe']
        },
        resources: [
          { title: 'Reforge Growth Series Articles', type: 'Guide', url: 'https://reforge.com' },
          { title: 'SkillHire Analytics & Certification', type: 'Course', url: '#course-biz' }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    role: 'Cybersecurity Analyst',
    domain: 'Security',
    overview: 'Cybersecurity Analysts defend enterprise systems, networks, and databases against cyberattacks, data breaches, and ransomware. They perform penetration testing, enforce security compliance, and mitigate vulnerabilities.',
    estimatedDuration: '5 Months · 12 hrs/week',
    averageSalary: '₹8 - 20 LPA',
    hiringCompanies: ['Paytm Security', 'TCS Cyber Defense', 'Wipro Security', 'Cisco', 'PwC'],
    requiredTechnicalSkills: ['Network Security & Firewalls', 'OWASP Top 10 Web Vulnerabilities', 'Penetration Testing (Kali Linux, Burp Suite)', 'Cryptography (Symmetric/Asymmetric)', 'SIEM Log Analysis', 'Vulnerability Assessment'],
    requiredSoftSkills: ['Vigilance', 'Ethical Integrity', 'Analytical Problem Solving', 'Crisis Management'],
    milestones: [
      {
        id: 'sec-lvl1',
        level: 'Beginner',
        title: 'Level 1: Networking Protocols & Security Fundamentals',
        duration: 'Month 1 - 2',
        description: 'Understand TCP/IP, DNS, OSI 7-layer model, packet inspection with Wireshark, Linux security fundamentals, and the CIA Triad.',
        skillsToAcquire: ['OSI Model & TCP/IP Protocols', 'Wireshark Packet Analysis', 'Linux Command Line Security', 'CIA Triad (Confidentiality, Integrity, Availability)', 'Firewalls & Port Scanning (Nmap)'],
        recommendedCourseId: 'cyber-1101',
        recommendedCourseTitle: 'Cybersecurity & Ethical Defense',
        practicalProject: {
          title: 'Network Traffic & Port Vulnerability Scan Report',
          description: 'Use Nmap and Wireshark in a virtual machine environment to audit open ports and analyze unencrypted HTTP credentials.',
          deliverables: ['Nmap network audit report', 'Wireshark packet capture analysis', 'Hardening checklist']
        },
        resources: [
          { title: 'Professor Messer CompTIA Security+ Guide', type: 'Guide', url: 'https://professormesser.com' },
          { title: 'SkillHire Cybersecurity Course', type: 'Course', url: '#course-cyber' }
        ]
      },
      {
        id: 'sec-lvl2',
        level: 'Intermediate',
        title: 'Level 2: Web Application Security & OWASP Top 10',
        duration: 'Month 3',
        description: 'Identify and remediate SQL Injection, Cross-Site Scripting (XSS), CSRF, and broken authentication using Burp Suite and Kali Linux.',
        skillsToAcquire: ['OWASP Top 10 Vulnerabilities', 'SQL Injection (SQLi) Defense', 'Cross-Site Scripting (XSS) Mitigation', 'Burp Suite Interception Proxy', 'Secure Password Hashing & Salts'],
        recommendedCourseId: 'cyber-1101',
        recommendedCourseTitle: 'Cybersecurity & Ethical Defense',
        practicalProject: {
          title: 'Penetration Testing & Remediation on Vulnerable App',
          description: 'Exploit SQL Injection and stored XSS vulnerabilities in a test environment, then write production code fixes to remediate them.',
          deliverables: ['Vulnerability exploitation proof-of-concept', 'Remediated source code patch', 'Security advisory report']
        },
        resources: [
          { title: 'PortSwigger Web Security Academy', type: 'Guide', url: 'https://portswigger.net/web-security' },
          { title: 'SkillHire Cyber Defense Exam', type: 'Course', url: '#course-cyber' }
        ]
      },
      {
        id: 'sec-lvl3',
        level: 'Advanced',
        title: 'Level 3: Cryptography, SIEM Monitoring & Incident Response',
        duration: 'Month 4 - 5',
        description: 'Understand public-key cryptography (RSA/AES), analyze intrusion logs in SIEM tools, and formulate enterprise incident response playbooks.',
        skillsToAcquire: ['Symmetric & Asymmetric Cryptography (AES, RSA)', 'Public Key Infrastructure (PKI) & SSL/TLS', 'SIEM Log Monitoring (Splunk / Elastic)', 'Incident Response Lifecycle', 'Enterprise Hardening & Compliance'],
        recommendedCourseId: 'cloud-1001',
        recommendedCourseTitle: 'Cloud Infrastructure & DevOps',
        practicalProject: {
          title: 'Enterprise Incident Response Playbook & SIEM Detection',
          description: 'Construct an automated alert rule for brute-force SSH logins and write an incident containment playbook for security teams.',
          deliverables: ['SIEM alert query specification', 'Step-by-step containment playbook', 'Post-mortem review template']
        },
        resources: [
          { title: 'NIST Cybersecurity Framework', type: 'Docs', url: 'https://nist.gov/cyberframework' },
          { title: 'SkillHire Cloud Security Track', type: 'Course', url: '#course-cloud' }
        ]
      }
    ]
  }
];
