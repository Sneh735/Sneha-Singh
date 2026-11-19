import { Course, CourseModule } from '../types';

export const COURSE_VIDEO_MAP: Record<string, string> = {
  'web-dev-101': 'https://www.youtube.com/embed/mU6anWqZJcc', // FreeCodeCamp Web Dev
  'dsa-201': 'https://www.youtube.com/embed/8hly31xKli0', // DSA Crash Course
  'java-301': 'https://www.youtube.com/embed/A74TOX803D0', // Java Full Course
  'python-401': 'https://www.youtube.com/embed/rfscVS0vtbw', // Python Full Course
  'aiml-501': 'https://www.youtube.com/embed/GwIo3g5ChFI', // Machine Learning
  'ds-601': 'https://www.youtube.com/embed/LHBE6Q9XlzI', // Data Science
  'react-701': 'https://www.youtube.com/embed/bMknfKXIFA8', // React 19 / Modern React
  'node-801': 'https://www.youtube.com/embed/Oe421EPjeBE', // Node.js and Express
  'sql-901': 'https://www.youtube.com/embed/HXV3zeQKqGY', // SQL Database Masterclass
  'cloud-1001': 'https://www.youtube.com/embed/fqMOX6JJhGo', // Docker & DevOps
  'cyber-1101': 'https://www.youtube.com/embed/inWWhr5tnEA', // Cybersecurity Fundamentals
  'uiux-2001': 'https://www.youtube.com/embed/c9Wg6Cb_YlU', // UI/UX & Figma
  'pm-2101': 'https://www.youtube.com/embed/XqCszZuhj9k', // Product Management
  'mkt-2201': 'https://www.youtube.com/embed/nU-IIXBWlS4', // Digital Marketing
  'biz-2301': 'https://www.youtube.com/embed/r-uolZl5gTE', // Business Analytics & Power BI
};

export const COURSE_MODULES_MAP: Record<string, CourseModule[]> = {
  'web-dev-101': [
    {
      id: 'web-m1',
      title: 'Module 1: Modern Web Foundations & Semantic HTML5',
      duration: '45 mins',
      summary: 'Master the architectural backbone of web pages, DOM trees, and accessibility standards.',
      content: [
        'Web applications run on client-server protocols where browsers request HTML documents and render the Document Object Model (DOM). Semantic elements like <header>, <main>, <nav>, and <article> provide critical structure for search engine crawlers and screen readers.',
        'Modern responsive web design relies on flexible layout models. CSS Grid allows 2-dimensional layouts (rows and columns simultaneously), while Flexbox provides 1-dimensional distribution along a main or cross axis.'
      ],
      codeLanguage: 'html',
      codeSnippet: `<!-- Modern Semantic & Responsive Structure -->
<main class="grid-layout">
  <article class="card">
    <header>
      <h2>Enterprise Microservice</h2>
      <span class="badge">Production</span>
    </header>
    <p>Semantic layout ensures accessibility and optimal SEO crawling.</p>
  </article>
</main>`,
      keyTakeaways: [
        'Always prioritize semantic HTML tags over generic <div> for accessibility (a11y).',
        'Use Flexbox for single-direction alignment and CSS Grid for complex 2D layouts.',
        'Implement CSS clamp() and rem units for fluid typography.'
      ]
    },
    {
      id: 'web-m2',
      title: 'Module 2: JavaScript ES6+, Async/Await & Event Loop',
      duration: '60 mins',
      summary: 'Understand asynchronous JavaScript, Promises, the Browser Event Loop, and modern ES6+ features.',
      content: [
        'JavaScript is single-threaded and non-blocking, orchestrated by the Event Loop. Synchronous code executes on the Call Stack, while async tasks (timers, network fetches) delegate to Web APIs and queue in the Microtask (Promises) and Macrotask queues.',
        'ES6+ introduces destructuring, spread/rest operators, optional chaining (?.), nullish coalescing (??), and native async/await for clean asynchronous orchestration without callback hell.'
      ],
      codeLanguage: 'javascript',
      codeSnippet: `// Asynchronous API Fetch with Error Handling
async function fetchCandidateData(candidateId) {
  try {
    const res = await fetch(\`/api/v1/candidates/\${candidateId}\`);
    if (!res.ok) throw new Error(\`HTTP status \${res.status}\`);
    const data = await res.json();
    return { name: data?.fullName ?? 'Anonymous', skills: data?.skills || [] };
  } catch (err) {
    console.error("Pipeline failure:", err.message);
    throw err;
  }
}`,
      keyTakeaways: [
        'Microtasks (Promise.then, queueMicrotask) execute before Macrotasks (setTimeout, setInterval).',
        'Always wrap await statements in try/catch or use higher-order error handlers.',
        'Use optional chaining (?.) and nullish coalescing (??) to prevent TypeError: cannot read properties of undefined.'
      ]
    },
    {
      id: 'web-m3',
      title: 'Module 3: RESTful APIs, State Management & Fetch Architecture',
      duration: '50 mins',
      summary: 'Design robust client-side network calls, HTTP headers, authentication tokens, and caching.',
      content: [
        'Full-stack applications communicate via standard HTTP methods: GET (idempotent retrieval), POST (resource creation), PUT/PATCH (replacement/modification), and DELETE.',
        'Proper state management separates server state (cached API responses) from client state (modal toggles, active form inputs). Use bearer token authorization headers for authenticated endpoints.'
      ],
      codeLanguage: 'typescript',
      codeSnippet: `// Standard Auth Header Request
const fetchWithAuth = async (url: string, token: string) => {
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
};`,
      keyTakeaways: [
        'GET and PUT requests must remain idempotent.',
        'Never store sensitive authentication tokens in unencrypted plain localStorage without XSS defenses.',
        'Implement debounced inputs for search queries to prevent server request thrashing.'
      ]
    },
    {
      id: 'web-m4',
      title: 'Module 4: Performance, Production Deployment & Security',
      duration: '45 mins',
      summary: 'Optimize Core Web Vitals (LCP, CLS, INP), asset bundling, and Cross-Site Scripting defenses.',
      content: [
        'Modern performance revolves around Google Core Web Vitals: Largest Contentful Paint (LCP < 2.5s), Interaction to Next Paint (INP < 200ms), and Cumulative Layout Shift (CLS < 0.1).',
        'Security best practices require sanitizing user HTML input (DOMPurify), implementing Content Security Policies (CSP), and enabling HTTPS and HTTP-only cookies.'
      ],
      codeLanguage: 'bash',
      codeSnippet: `# Production Build & Bundle Inspection
npm run build
npx source-map-explorer 'dist/assets/*.js'`,
      keyTakeaways: [
        'Always set explicit width and height on images to prevent Cumulative Layout Shift (CLS).',
        'Use tree-shaking and dynamic import() for code-splitting large route dependencies.',
        'Sanitize all dynamic user-generated content before rendering to eliminate XSS vectors.'
      ]
    }
  ],

  'sql-901': [
    {
      id: 'sql-m1',
      title: 'Module 1: Relational Database Architecture & Normalization',
      duration: '45 mins',
      summary: 'Understand tables, Primary Keys, Foreign Keys, and 1NF to 3NF normalization rules.',
      content: [
        'Relational databases store structured records in tables with enforced schemas. A Primary Key uniquely identifies every row and enforces NOT NULL and UNIQUE constraints by default.',
        'Database Normalization eliminates data redundancy and prevents update anomalies. 1NF removes repeating groups, 2NF removes partial functional dependencies, and 3NF removes transitive dependencies.'
      ],
      codeLanguage: 'sql',
      codeSnippet: `CREATE TABLE users (
  user_id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_enrollments (
  enrollment_id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
  course_id VARCHAR(50) NOT NULL,
  progress INT CHECK (progress >= 0 AND progress <= 100)
);`,
      keyTakeaways: [
        'Primary keys must never be null and must guarantee absolute uniqueness.',
        'Foreign keys preserve referential integrity across related parent and child entities.',
        'Use 3NF to eliminate duplicate information and prevent data synchronization errors.'
      ]
    },
    {
      id: 'sql-m2',
      title: 'Module 2: Advanced JOINs, Subqueries & Aggregations',
      duration: '50 mins',
      summary: 'Master INNER, LEFT, RIGHT, and FULL OUTER JOINs alongside GROUP BY and HAVING clauses.',
      content: [
        'JOINs combine columns from one or more tables based on a related column. INNER JOIN returns matching rows from both tables, whereas LEFT JOIN preserves all records from the left table even if right table matches are missing (producing NULLs).',
        'The WHERE clause filters individual rows before grouping takes place. The HAVING clause filters grouped records after aggregation (e.g. HAVING COUNT(*) > 5).'
      ],
      codeLanguage: 'sql',
      codeSnippet: `-- Find departments with more than 5 high-performing engineers
SELECT 
  d.department_name,
  COUNT(e.emp_id) AS total_engineers,
  AVG(e.salary) AS avg_salary
FROM departments d
INNER JOIN employees e ON d.dept_id = e.dept_id
WHERE e.performance_rating >= 4.0
GROUP BY d.department_name
HAVING COUNT(e.emp_id) >= 5
ORDER BY avg_salary DESC;`,
      keyTakeaways: [
        'Use LEFT JOIN when you must retain all records from the primary entity regardless of related matches.',
        'WHERE filters before GROUP BY; HAVING filters aggregated results after GROUP BY.',
        'Always ensure JOIN condition columns are indexed in foreign tables.'
      ]
    },
    {
      id: 'sql-m3',
      title: 'Module 3: Window Functions, CTEs & ACID Transactions',
      duration: '60 mins',
      summary: 'Write elegant Common Table Expressions and analytical window functions without collapsing rows.',
      content: [
        'Unlike aggregate functions with GROUP BY, Window Functions (ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG()) perform calculations across a partition of rows while preserving individual row identity.',
        'ACID transactions (Atomicity, Consistency, Isolation, Durability) guarantee database reliability during concurrent operations. If any step fails, ROLLBACK restores the prior valid state.'
      ],
      codeLanguage: 'sql',
      codeSnippet: `-- Common Table Expression (CTE) with DENSE_RANK
WITH RankedSalaries AS (
  SELECT 
    emp_id,
    emp_name,
    dept_id,
    salary,
    DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as salary_rank
  FROM employees
)
SELECT * FROM RankedSalaries WHERE salary_rank <= 3;`,
      keyTakeaways: [
        'DENSE_RANK() provides contiguous ranks without skipping numbers for ties (1, 2, 2, 3).',
        'CTEs (WITH clause) dramatically improve readability and reusability over deeply nested subqueries.',
        'ACID principles ensure database safety in high-concurrency payment and registration workflows.'
      ]
    },
    {
      id: 'sql-m4',
      title: 'Module 4: Indexes, EXPLAIN Execution Plans & Query Optimization',
      duration: '45 mins',
      summary: 'Diagnose slow database queries using B-Tree indexes, composite indexes, and query execution plans.',
      content: [
        'Without indexes, databases perform a sequential Full Table Scan. B-Tree indexes allow logarithmic O(log N) lookups for equality and range filters.',
        'The EXPLAIN command reveals whether the SQL query optimizer performs Index Scans or sequential table scans, showing the estimated cost and rows fetched.'
      ],
      codeLanguage: 'sql',
      codeSnippet: `-- Create Composite Index for Multi-Column Filtering
CREATE INDEX idx_emp_dept_status ON employees(dept_id, active_status);

-- Inspect query execution plan
EXPLAIN ANALYZE 
SELECT emp_name FROM employees 
WHERE dept_id = 'ENG' AND active_status = true;`,
      keyTakeaways: [
        'Place the most selective columns first in composite indexes.',
        'Avoid wrapping indexed columns in functions (e.g. WHERE LOWER(email) = ...) without functional indexes.',
        'Always check EXPLAIN output before shipping queries to production.'
      ]
    }
  ],

  'react-701': [
    {
      id: 'react-m1',
      title: 'Module 1: Component Architecture, JSX & Reconciliation',
      duration: '45 mins',
      summary: 'Explore React 19 component lifecycle, the Virtual DOM, and state immutability.',
      content: [
        'React represents UI as pure functions of state and props. When state changes, React constructs a new Virtual DOM tree and performs Fiber reconciliation to compute minimal atomic updates to the real DOM.',
        'Never mutate state directly (e.g. array.push()). Always provide fresh object/array references using the spread operator or functional updater patterns to trigger proper re-renders.'
      ],
      codeLanguage: 'tsx',
      codeSnippet: `// Immutability in State Updates
const [skills, setSkills] = useState<string[]>(['React', 'TypeScript']);

const addSkill = (newSkill: string) => {
  // Correct: produces a new array reference
  setSkills(prev => [...prev, newSkill]);
};`,
      keyTakeaways: [
        'Props are read-only and immutable for the child component.',
        'Always pass unique stable keys in mapped lists (never use array indices for mutable lists).',
        'Treat state objects as immutable snapshots.'
      ]
    },
    {
      id: 'react-m2',
      title: 'Module 2: Hooks Deep Dive: useState, useEffect & Custom Hooks',
      duration: '55 mins',
      summary: 'Master effect synchronization, cleanup functions, and encapsulating reusable logic.',
      content: [
        'useEffect synchronizes your component with external systems (timers, event listeners, WebSocket connections). The cleanup return function prevents memory leaks when the component unmounts or before re-running.',
        'Custom hooks allow you to extract stateful component logic into reusable functions named with the use prefix (e.g. useDebounce, useAuth, useLocalStorage).'
      ],
      codeLanguage: 'tsx',
      codeSnippet: `// Custom Window Dimensions Hook with Cleanup
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}`,
      keyTakeaways: [
        'Never place effects inside loops, conditions, or nested functions (Rules of Hooks).',
        'Always return a cleanup function when subscribing to browser events or intervals.',
        'Custom hooks share logic, not state instance.'
      ]
    },
    {
      id: 'react-m3',
      title: 'Module 3: Performance Optimization (useMemo, useCallback & memo)',
      duration: '50 mins',
      summary: 'Prevent unnecessary re-renders, cache expensive calculations, and stabilize function props.',
      content: [
        'React re-renders all child components whenever a parent updates unless optimized. React.memo prevents re-renders if props have not changed by shallow comparison.',
        'useMemo caches the result of an expensive calculation between renders, while useCallback caches a function definition so it retains reference stability when passed to memoized children.'
      ],
      codeLanguage: 'tsx',
      codeSnippet: `// Stabilizing Props with useCallback and useMemo
const filteredList = useMemo(() => {
  return items.filter(item => item.score >= threshold);
}, [items, threshold]);

const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);`,
      keyTakeaways: [
        'Do not prematurely memoize everything; use profiling tools to identify actual render bottlenecks.',
        'useCallback is essential when passing callbacks to optimized children (React.memo).',
        'useMemo is ideal for heavy data filtering, parsing, or geometric computations.'
      ]
    },
    {
      id: 'react-m4',
      title: 'Module 4: Enterprise State Management & Next.js Architecture',
      duration: '50 mins',
      summary: 'Scale applications with Context API, Zustand, Server Components, and Next.js App Router.',
      content: [
        'For global application state (user auth, theme, notifications), Zustand or Context API eliminates prop drilling without the boilerplate of Redux.',
        'Modern React 19 and Next.js introduce React Server Components (RSC), allowing data fetching directly on the server without shipping JavaScript bundles to the client.'
      ],
      codeLanguage: 'tsx',
      codeSnippet: `// Lightweight Zustand Global Store
import { create } from 'zustand';

interface UserStore {
  userRole: 'student' | 'employee';
  setRole: (role: 'student' | 'employee') => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userRole: 'student',
  setRole: (role) => set({ userRole: role })
}));`,
      keyTakeaways: [
        'Keep state as close to where it is needed as possible.',
        'Separate UI state from persisted backend cache.',
        'Server Components reduce client bundle size and optimize initial page load speeds.'
      ]
    }
  ],

  'cloud-1001': [
    {
      id: 'cloud-m1',
      title: 'Module 1: Cloud Architecture, IaaS/PaaS & AWS Core Services',
      duration: '45 mins',
      summary: 'Explore compute, storage, VPC networking, and high availability across availability zones.',
      content: [
        'Cloud computing replaces on-premises data centers with on-demand computing resources over the internet. Major models include IaaS (AWS EC2), PaaS (AWS Elastic Beanstalk, Heroku), and SaaS.',
        'Architecting for high availability requires distributing workloads across multiple Availability Zones (AZs) behind an Application Load Balancer (ALB) with Auto Scaling Groups.'
      ],
      codeLanguage: 'bash',
      codeSnippet: `# AWS CLI S3 Static Deployment
aws s3 sync ./dist s3://skilltohire-production-bucket --delete
aws cloudfront create-invalidation --distribution-id E1234567 --paths "/*"`,
      keyTakeaways: [
        'Design for failure: always deploy applications across at least two Availability Zones.',
        'Use Object Storage (S3) for static assets and user uploads rather than block storage.',
        'Enforce least-privilege IAM policies for all services and developers.'
      ]
    },
    {
      id: 'cloud-m2',
      title: 'Module 2: Docker Containerization & Multi-Stage Builds',
      duration: '50 mins',
      summary: 'Build production-ready, lightweight Docker containers with multi-stage builds and layer caching.',
      content: [
        'Containers package application code, system libraries, and runtime dependencies together, guaranteeing identical behavior across development and production environments.',
        'Multi-stage Docker builds separate the build environment (Node, compilers, devDependencies) from the final production runtime image, reducing image sizes from 1GB+ down to under 50MB.'
      ],
      codeLanguage: 'dockerfile',
      codeSnippet: `# Multi-stage Node.js Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`,
      keyTakeaways: [
        'Never run Docker containers as the root user in production.',
        'Leverage .dockerignore to exclude node_modules, git histories, and local secrets.',
        'Multi-stage builds drastically minimize attack surface and download latencies.'
      ]
    },
    {
      id: 'cloud-m3',
      title: 'Module 3: Kubernetes (K8s) Cluster Architecture & Deployments',
      duration: '60 mins',
      summary: 'Master Pods, Services, Deployments, ConfigMaps, and rolling zero-downtime updates.',
      content: [
        'Kubernetes coordinates and orchestrates container fleets across worker nodes. The Control Plane (API Server, etcd, Scheduler) maintains desired state, while Kubelet executes pods on nodes.',
        'Deployments manage declarative pod replicas with rolling updates. ClusterIP exposes pods internally, while Ingress routes external HTTP traffic into the cluster.'
      ],
      codeLanguage: 'yaml',
      codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: skilltohire-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: skilltohire
  template:
    metadata:
      labels:
        app: skilltohire
    spec:
      containers:
      - name: api
        image: myregistry/skilltohire:v2.0
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"`,
      keyTakeaways: [
        'Always set resource requests and limits to prevent noisy-neighbor pod crashes.',
        'Use Readiness and Liveness probes to guarantee zero-downtime rolling deployments.',
        'Store secrets in Kubernetes Secrets or external secret managers (HashiCorp Vault, AWS Secrets Manager).'
      ]
    },
    {
      id: 'cloud-m4',
      title: 'Module 4: CI/CD Pipelines & Infrastructure as Code (Terraform)',
      duration: '50 mins',
      summary: 'Automate linting, unit testing, image builds, and infrastructure provisioning with GitHub Actions.',
      content: [
        'Continuous Integration (CI) validates every commit via automated unit tests and lint checks. Continuous Delivery (CD) automatically stages and deploys validated artifacts to production.',
        'Infrastructure as Code (IaC) with Terraform enables version-controlled, reproducible cloud provisioning across cloud providers using declarative configuration.'
      ],
      codeLanguage: 'yaml',
      codeSnippet: `# GitHub Actions CI/CD Pipeline
name: Deploy Production
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build`,
      keyTakeaways: [
        'Break deployment steps into fail-fast stages: Lint -> Test -> Build -> Deploy.',
        'Never commit raw API keys or database connection strings to git repositories.',
        'Use immutable container tags (e.g. git commit SHA) instead of latest in production.'
      ]
    }
  ],

  'uiux-2001': [
    {
      id: 'uiux-m1',
      title: 'Module 1: Design Thinking & User Experience Research',
      duration: '45 mins',
      summary: 'Empathize with users, conduct stakeholder interviews, construct personas, and map user journeys.',
      content: [
        'User Experience (UX) encompasses the entire journey, emotions, and friction a user experiences while interacting with a product. In contrast, User Interface (UI) focuses on the visual presentation, typography, color harmony, and interactive affordances.',
        'The 5-stage Design Thinking framework (Empathize, Define, Ideate, Prototype, Test) ensures you solve genuine user pain points before writing any code.'
      ],
      codeLanguage: 'text',
      codeSnippet: `User Journey Map Stages:
[Discovery] -> [Registration] -> [Skill Assessment] -> [Course Learning] -> [Job Match]
Pain Point: Confusing quiz transition with no study material
Solution: Add rich modules and AI Tutor before quiz attempt`,
      keyTakeaways: [
        'UI is what you see; UX is how you feel and flow through the experience.',
        'Always validate problem statements with qualitative user interviews before designing solutions.',
        'Create empathy maps to align stakeholders on user emotions and motivations.'
      ]
    },
    {
      id: 'uiux-m2',
      title: 'Module 2: Wireframing, Information Architecture & Heuristics',
      duration: '45 mins',
      summary: 'Design low-fidelity wireframes, intuitive navigation taxonomies, and apply Nielsen Norman heuristics.',
      content: [
        'Information Architecture (IA) organizes and structures content logically so users find what they need intuitively. Tree testing and card sorting help determine natural categorizations.',
        'Apply Jakob Nielsens 10 Usability Heuristics: Visibility of system status, match between system and the real world, user control and freedom, consistency and standards, and error prevention.'
      ],
      codeLanguage: 'text',
      codeSnippet: `Key Usability Heuristics in Action:
1. System Status: Displaying live timer and % completed progress bar during quiz.
2. Error Prevention: Confirming with candidate before submitting final exam answers.
3. Flexibility: Offering both Technical and Non-Technical course categories.`,
      keyTakeaways: [
        'Start with low-fidelity grayscale wireframes to focus on hierarchy before color styling.',
        'Keep cognitive load low: limit navigation menus to 5-7 core items (Millers Law).',
        'Always provide clear undo/cancel actions for destructive user actions.'
      ]
    },
    {
      id: 'uiux-m3',
      title: 'Module 3: Figma Mastery: Auto-Layout, Components & Design Systems',
      duration: '60 mins',
      summary: 'Build scalable design tokens, responsive auto-layout components, and accessible color palettes.',
      content: [
        'Modern UI teams rely on Design Systems: a single source of truth containing design tokens (colors, spacing, typography scales), atomic components (buttons, input fields), and composite patterns.',
        'Figma Auto-Layout replicates CSS Flexbox and Grid directly inside designs, allowing components to adapt automatically to variable content lengths and mobile screen sizes.'
      ],
      codeLanguage: 'text',
      codeSnippet: `Design Token Structure:
Color Palette:
- brand.primary: #1A6EF5
- brand.surface: #FFFFFF
- brand.text: #1E293B
Spacing Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px
Typography: Inter (Body: 14px/20px, Heading: 24px/32px, Display: 36px/44px)`,
      keyTakeaways: [
        'Use Figma Auto-Layout on all dynamic components to ensure responsive adaptability.',
        'Establish component variants and properties for button states (default, hover, active, disabled).',
        'Check color contrast ratios against WCAG AA standards (minimum 4.5:1 for body text).'
      ]
    },
    {
      id: 'uiux-m4',
      title: 'Module 4: High-Fidelity Prototyping, Usability Testing & Handoff',
      duration: '50 mins',
      summary: 'Create micro-interactions, run unmoderated user tests, and write developer handoff specs.',
      content: [
        'Micro-interactions and subtle transitions (hover states, drawer animations) make digital interfaces feel alive and provide instant sensory feedback for user interactions.',
        'Developer handoff involves documenting layout constraints, component states, asset exports (SVG/PNG), responsive breakpoints, and accessibility labels.'
      ],
      codeLanguage: 'text',
      codeSnippet: `Developer Handoff Checklist:
1. Export icons in vector SVG format with 24x24px uniform bounding boxes.
2. Provide exact token names (e.g. text-brand-blue, p-4) matching frontend design tokens.
3. Specify animation timing curves (e.g. 200ms ease-out).`,
      keyTakeaways: [
        'Test interactive prototypes with 5 representative users to discover 85% of usability bottlenecks.',
        'Avoid jarring, slow animations; keep micro-interactions between 150ms and 300ms.',
        'Provide clear state specifications (loading, empty, error, success) for every view.'
      ]
    }
  ]
};

// Generic Fallback Generator for any course (including AI custom generated courses)
export function getCourseModules(course: Course): CourseModule[] {
  if (course.modules && course.modules.length > 0) {
    return course.modules;
  }

  if (COURSE_MODULES_MAP[course.id]) {
    return COURSE_MODULES_MAP[course.id];
  }

  // Synthesize customized modules for this course topic
  const title = course.title;
  const domain = course.domain || 'Technology';
  const isNonTech = course.category === 'Non-Technical';

  return [
    {
      id: `${course.id}-m1`,
      title: `Module 1: Foundations & Architecture of ${title}`,
      duration: '45 mins',
      summary: `Master the essential core concepts, terminology, and foundational mental model of ${title}.`,
      content: [
        `${title} forms a foundational pillar within ${domain}. To develop industry-standard competency, professionals must first understand the fundamental paradigms, historical context, and architectural principles that govern this domain.`,
        `By learning how individual components interact within the overarching ecosystem, you avoid common rookie misconceptions and establish an analytical framework for solving complex real-world challenges.`
      ],
      codeLanguage: isNonTech ? 'text' : 'javascript',
      codeSnippet: isNonTech 
        ? `Foundational Principles for ${title}:
1. Clear Problem Formulation & Stakeholder Alignment
2. Quantitative Tracking of Core KPI Benchmarks
3. Iterative Feedback & Continuous Improvement Cycle`
        : `// Core Architectural Pattern in ${title}
class ${title.replace(/[^a-zA-Z]/g, '')}Pipeline {
  constructor(config = {}) {
    this.config = config;
    this.status = 'INITIALIZED';
  }

  execute() {
    console.log("Executing standard workflow for ${title}...");
    return { success: true, timestamp: Date.now() };
  }
}`,
      keyTakeaways: [
        `Understand the core terminology and architecture of ${title}.`,
        `Recognize how ${title} integrates into the broader ${domain} landscape.`,
        `Formulate questions from first principles before jumping to execution.`
      ]
    },
    {
      id: `${course.id}-m2`,
      title: `Module 2: Practical Implementation & Key Frameworks`,
      duration: '50 mins',
      summary: `Hands-on syntax, methodologies, workflows, and standard industry toolchains for ${title}.`,
      content: [
        `Theoretical knowledge is solidified through hands-on practice. In this module, we dissect standard modern tools, design patterns, and workflows used by leading tech organizations.`,
        `We examine concrete code and procedural examples, analyzing how parameters, properties, and configurations produce measurable results in production environments.`
      ],
      codeLanguage: isNonTech ? 'text' : 'typescript',
      codeSnippet: isNonTech
        ? `Execution Framework for ${title}:
Step 1: Define clear measurable objectives (OKRs / SMART Goals).
Step 2: Collect baseline metrics and benchmark against competitors.
Step 3: Execute in 2-week iterations with stakeholder review.`
        : `// Production Implementation Example
interface ExecutionContext {
  id: string;
  topic: string;
  active: boolean;
}

export function process${title.replace(/[^a-zA-Z]/g, '')}(ctx: ExecutionContext): boolean {
  if (!ctx.active) return false;
  // Apply domain best practice algorithms
  return true;
}`,
      keyTakeaways: [
        `Apply standard design patterns and workflows directly to practical problems.`,
        `Avoid antipatterns that degrade efficiency or reliability.`,
        `Ensure clean documentation and maintainable execution.`
      ]
    },
    {
      id: `${course.id}-m3`,
      title: `Module 3: Real-World Case Studies & Industry Projects`,
      duration: '60 mins',
      summary: `Analyze end-to-end industry implementations, trade-offs, and scaling challenges in ${title}.`,
      content: [
        `Real-world enterprise environments present unexpected constraints, high concurrency, tight deadlines, and legacy integrations that textbooks rarely address.`,
        `We review realistic case studies showing how high-growth startups and Fortune 500 companies deploy ${title} at scale, manage technical and business debt, and make cost-benefit trade-offs.`
      ],
      codeLanguage: isNonTech ? 'text' : 'json',
      codeSnippet: `{
  "projectName": "${title} Production Case Study",
  "scalabilityScore": "99.9%",
  "latencyTargetMs": 150,
  "verifiedImpact": "High Efficiency across ${domain}"
}`,
      keyTakeaways: [
        `Identify hidden bottlenecks before shipping to production.`,
        `Balance immediate delivery velocity with long-term architectural stability.`,
        `Conduct systematic root-cause analyses when edge cases arise.`
      ]
    },
    {
      id: `${course.id}-m4`,
      title: `Module 4: Advanced Mastery, Security & Certification Exam Prep`,
      duration: '40 mins',
      summary: `Prepare for the 15-question professional certification exam with high-yield review notes.`,
      content: [
        `Before attempting the 15-question certification assessment, review this high-yield summary of critical formulas, edge cases, and best practices.`,
        `Passing the exam requires an 80% score (12 out of 15 questions correct). Review the key takeaways below, then launch the examination when you are ready to claim your verified certificate.`
      ],
      codeLanguage: 'text',
      codeSnippet: `Exam Readiness Checklist:
[✓] Thoroughly reviewed all 4 modules.
[✓] Understood core architecture and execution trade-offs.
[✓] Ready for 20-minute timed 15-question assessment.
[✓] Target score: >= 80% for official credential badge.`,
      keyTakeaways: [
        `Double-check question scenarios carefully before confirming your answer.`,
        `Manage your 20-minute timer efficiently across all 15 questions.`,
        `Upon achieving 80%+, generate and download your official PDF Certificate.`
      ]
    }
  ];
}

export function getCourseVideoUrl(course: Course): string {
  if (course.videoUrl) return course.videoUrl;
  if (COURSE_VIDEO_MAP[course.id]) return COURSE_VIDEO_MAP[course.id];
  // Default high-quality education video fallback
  return 'https://www.youtube.com/embed/mU6anWqZJcc';
}
