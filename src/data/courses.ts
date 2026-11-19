import { Course } from '../types';

const GENERATE_THEORY_PAGES = (title: string, domain: string): string[] => {
  return Array.from({ length: 10 }, (_, i) => `
# Module ${i + 1}: ${title} - ${i === 0 ? 'Foundations' : i === 9 ? 'Advanced Orchestration' : 'Core Analytics'}

## 1. The 'Why' (Page ${i + 1}/10)
In module ${i + 1}, we analyze the architectural implications of ${title} within the ${domain} landscape. The primary goal is to understand how this specific layer manages systemic complexity.

## 2. Deep Dive
At this stage of ${title}, we focus on the under-the-hood mechanics. Professional-grade implementation requires mastering deterministic state and axiomatic security principles.

## 3. Industry Standard
Top-tier engineering organizations like Google, Amazon, and Meta utilize these ${domain} patterns to scale to billions of users.

## 4. Final Goal
Completion of this 6-hour curriculum ensures candidate readiness for high-density technical roles.
`);
};

export const COURSES: Course[] = [
  {
    id: 'web-dev-101',
    title: "Web Development (HTML, CSS, JS)",
    description: "Intensive Certification: Master the DOM, Semantic layers, CSS Grid, and high-performance rendering.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Frontend",
    points: 1000,
    theoryPages: [],
    passingScore: 12, // 12/15 = 80%
    quiz: [
      {
        question: "You need to build a layout where items are centered both vertically and horizontally within a container. Which CSS property combination is most efficient?",
        options: ["display: flex; justify-content: center; align-items: center;", "float: left; margin: auto;", "text-align: center; vertical-align: middle;", "position: absolute; top: 50%; left: 50%;"],
        correctAnswer: 0
      },
      {
        question: "A search engine crawler is indexing your site. Which HTML tag best describes the primary navigation block for SEO?",
        options: ["<div id='nav'>", "<nav>", "<ul>", "<section>"],
        correctAnswer: 1
      },
      {
        question: "Which JavaScript method should be used to combine two arrays into a new array without mutating the originals?",
        options: ["push()", "splice()", "concat()", "pop()"],
        correctAnswer: 2
      },
      {
        question: "You want to create a responsive grid where columns automatically wrap as the screen shrinks. Which CSS Grid property is ideal?",
        options: ["grid-template-columns: 1fr 1fr 1fr;", "grid-template-columns: repeat(3, 33%);", "grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));", "display: block;"],
        correctAnswer: 2
      },
      {
        question: "What is the primary difference between 'let' and 'var' in JavaScript scope?",
        options: ["'var' is block-scoped, 'let' is function-scoped", "'let' is block-scoped, 'var' is function-scoped", "There is no difference", "'let' cannot be reassigned"],
        correctAnswer: 1
      },
      {
        question: "Scenario: A user clicks a button, and you want to prevent the default form submission while running your code. Which event method do you call?",
        options: ["event.stopImmediatePropagation()", "event.stopPropagation()", "event.preventDefault()", "event.cancelBubble = true"],
        correctAnswer: 2
      },
      {
        question: "Which HTML5 attribute allows you to store custom data that can be accessed via JavaScript's dataset property?",
        options: ["custom-*", "data-*", "info-*", "val-*"],
        correctAnswer: 1
      },
      {
        question: "In CSS, which selector has the highest specificity?",
        options: ["#header", ".main-nav", "div h1", "p"],
        correctAnswer: 0
      },
      {
        question: "What does the 'defer' attribute in a <script> tag do?",
        options: ["Stops the script from running", "Executes the script after the HTML document is parsed", "Executes the script immediately", "Loads the script only on mobile devices"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You need a high-performance background image that doesn't slow down initial page load. Which format is generally preferred?",
        options: ["BMP", "TIFF", "WebP", "GIF"],
        correctAnswer: 2
      },
      {
        question: "Which JavaScript function converts a JSON string into a JavaScript object?",
        options: ["JSON.stringify()", "JSON.parse()", "Object.toJSON()", "String.parseJSON()"],
        correctAnswer: 1
      },
      {
        question: "What is the purpose of the 'alt' attribute on an <img> tag?",
        options: ["To provide a tooltip", "To provide alternative text for screen readers and broken links", "To set the image height", "To define the image source"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You are designing a mobile-first site. Which media query approach do you follow?",
        options: ["@media (max-width: 768px)", "@media (min-width: 768px)", "@media (orientation: portrait)", "@media (color)"],
        correctAnswer: 1
      },
      {
        question: "Which array method creates a new array with all elements that pass a specific test function?",
        options: ["map()", "filter()", "forEach()", "every()"],
        correctAnswer: 1
      },
      {
        question: "What does DOM stand for in web development?",
        options: ["Data Objects Model", "Document Object Model", "Digital Oriented Metadata", "Distributed Object Management"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'dsa-201',
    title: "Data Structures & Algorithms (DSA)",
    description: "Technical Depth Certification: Graphs, Tries, Dynamic Programming, and Space-Time complexity.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Advanced",
    domain: "Computer Science",
    points: 1200,
    theoryPages: [],
    passingScore: 12,
    quiz: [
      {
        question: "Scenario: You need to implement an 'Undo' feature in a text editor. Which data structure is most appropriate?",
        options: ["Queue", "Stack", "Linked List", "Hash Table"],
        correctAnswer: 1
      },
      {
        question: "What is the Big O time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: 2
      },
      {
        question: "Scenario: You have a list of entries and need to find duplicates quickly. Which data structure provides the fastest average lookups?",
        options: ["Array", "Linked List", "HashSet / HashMap", "Binary Tree"],
        correctAnswer: 2
      },
      {
        question: "Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?",
        options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
        correctAnswer: 2
      },
      {
        question: "In a 'Queue' data structure, which principle is followed for adding and removing elements?",
        options: ["LIFO (Last-In-First-Out)", "FIFO (First-In-First-Out)", "Random Access", "Priority Based"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You need to find the shortest path between two nodes in an unweighted graph. Which algorithm should you use?",
        options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
        correctAnswer: 0
      },
      {
        question: "What is the main advantage of a 'Linked List' over an 'Array'?",
        options: ["Constant time access to any element", "Better memory locality", "Easier insertions and deletions at any point", "Requires less memory overall"],
        correctAnswer: 2
      },
      {
        question: "Scenario: You are designing a system to handle printable tasks sent to a printer. Which data structure is best?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: 1
      },
      {
        question: "What does 'Space Complexity' measure in an algorithm?",
        options: ["The time it takes to run", "The amount of memory it uses relative to input size", "The number of lines of code", " the physical volume of the server"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You need to store dynamic hierarchical data like a file system. Which structure is most logical?",
        options: ["Array", "Stack", "Tree", "Queue"],
        correctAnswer: 2
      },
      {
        question: "What is a 'Collision' in a Hash Table?",
        options: ["When two different keys hash to the same index", "When the table runs out of memory", "When the search takes too long", "When the program crashes"],
        correctAnswer: 0
      },
      {
        question: "Which traversal method visits the root node first, then the left subtree, then the right subtree?",
        options: ["In-order", "Pre-order", "Post-order", "Level-order"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You want to maintain a list of numbers where you always need quick access to the largest value. Which structure is best?",
        options: ["Min-Heap", "Max-Heap", "Hash Map", "Linked List"],
        correctAnswer: 1
      },
      {
        question: "What is the primary difference between a 'Graph' and a 'Tree'?",
        options: ["A Tree can have cycles, a Graph cannot", "A Tree is a type of Graph without cycles and with a single root", "Graphs are only for numbers", "There is no difference"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You are developing a recursive algorithm. Which data structure is implicitly used by the system to manage its execution?",
        options: ["Queue", "Heap", "Stack", "Array"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'java-301',
    title: "Java Mastery (Core & Advanced)",
    description: "Deep Dive Certification: JVM Architecture, Multithreading, Streams API, and Design Patterns.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    duration: "8 Hours",
    difficulty: "Advanced",
    domain: "Backend",
    points: 1500,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: `Java Assessment ${i + 1}: Which concept is primary for ${i % 2 === 0 ? 'Memory Management' : 'Thread Safety'}?`,
      options: ["Garbage Collection", "Keyword 'synchronized'", "Static methods", "Pointers"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'python-401',
    title: "Python for Professionals",
    description: "Professional Certification: Decorators, Generators, AsyncIO, and Enterprise-grade Pythonic patterns.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Automation",
    points: 1100,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: `Python Assessment ${i + 1}: What is the primary use of ${i % 2 === 0 ? 'Decorators' : 'Generators'}?`,
      options: ["Modifying function behavior", "Lazy evaluation of sequences", "Speeding up loops", "File I/O"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'aiml-501',
    title: "AI/ML (Intelligence Systems)",
    description: "Intensive Certification: Neural Networks, Transformers, Reinforcement Learning, and Smart Agents.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    duration: "10 Hours",
    difficulty: "Expert",
    domain: "AI/ML",
    points: 2000,
    theoryPages: [],
    passingScore: 12,
    quiz: [
      {
        question: "What is the primary purpose of an 'Activation Function' in a neural network?",
        options: ["To initialize weights", "To introduce non-linearity into the model", "To prevent overfitting", "To calculate the error"],
        correctAnswer: 1
      },
      {
        question: "Scenario: Your model performs exceptionally well on training data but poorly on test data. What is this phenomenon called?",
        options: ["Underfitting", "Overfitting", "Data Leakage", "Convergence"],
        correctAnswer: 1
      },
      {
        question: "In the context of Transformers, what does the 'Attention Mechanism' allow the model to do?",
        options: ["Focus on specific parts of the input sequence regardless of distance", "Increase the learning rate", "Filter out noisy data", "Compress images"],
        correctAnswer: 0
      },
      {
        question: "Which of these is a supervised learning task?",
        options: ["Clustering users by behavior", "Predicting house prices from features", "Dimensionality reduction with PCA", "Discovering hidden patterns in raw data"],
        correctAnswer: 1
      },
      {
        question: "What is 'Backpropagation' used for in deep learning?",
        options: ["To generate new data", "To update weights by propagating the error backwards", "To visualize neurons", "To stop the training process"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You are working with a very small dataset. Which technique is most helpful for improving model performance?",
        options: ["Transfer Learning", "Building a deeper network", "Removing all hidden layers", "Increasing batch size"],
        correctAnswer: 0
      },
      {
        question: "What is the role of a 'Loss Function'?",
        options: ["To measure the difference between predicted and actual values", "To speed up calculation", "To decrease memory usage", "To define the number of neurons"],
        correctAnswer: 0
      },
      {
        question: "In Reinforcement Learning, what does an 'Agent' receive from the 'Environment' after taking an action?",
        options: ["A bribe", "A Reward and a new State", "The entire codebase", "A stop signal"],
        correctAnswer: 1
      },
      {
        question: "Which optimizer is known for using adaptive learning rates for each parameter?",
        options: ["Stochastic Gradient Descent (SGD)", "Adam", "Momentum", "L-BFGS"],
        correctAnswer: 1
      },
      {
        question: "What is the primary benefit of using a CNN (Convolutional Neural Network) for images compared to a standard MLP?",
        options: ["Lower memory usage", "Spatial invariance and parameter sharing", "Faster text processing", "It doesn't require training"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You want to prevent a model from becoming too complex and dependent on specific training examples. Which technique do you implement?",
        options: ["Regularization (e.g., Dropout, L2)", "Increasing units in all layers", "Removing the test set", "Oversampling everything"],
        correctAnswer: 0
      },
      {
        question: "What is a 'Gradient' in the context of optimization?",
        options: ["A vector of partial derivatives representing the steepest ascent", "A type of layer", "A data visualization tool", "An error message"],
        correctAnswer: 0
      },
      {
        question: "Scenario: You are building a chatbot that needs to maintain context over long conversations. Which architecture is most suitable?",
        options: ["Linear Regression", "Transformer (Self-Attention)", "CNN", "K-Means"],
        correctAnswer: 1
      },
      {
        question: "What does 'Fine-tuning' a model involve?",
        options: ["Deleting the model and starting over", "Taking a pre-trained model and training it further on a specific dataset", "Adjusting the volume of the computer", "Renaming the variables"],
        correctAnswer: 1
      },
      {
        question: "In Machine Learning, what is the 'Bias-Variance Tradeoff'?",
        options: ["The balance between model simplicity and flexibility", "The cost of buying more GPUs", "The time taken to clean data", "The difference between Python and R"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'ds-601',
    title: "Data Science Mastery",
    description: "Advanced Certification: Statistical Modelling, ETL Pipelines, Pandas, and advanced Visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&auto=format&fit=crop&q=60",
    duration: "8 Hours",
    difficulty: "Advanced",
    domain: "Data Science",
    points: 1400,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: `DS Assessment ${i + 1}: Which library is standard for ${i % 2 === 0 ? 'Data Manipulation' : 'Visualization'}?`,
      options: ["Pandas", "Matplotlib", "Requests", "Flask"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'react-701',
    title: "React (Architecture & Hooks)",
    description: "Build Certification: Component Lifecycles, Context API, Performance Tuning with memo/callback.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Frontend",
    points: 1200,
    theoryPages: [],
    passingScore: 12,
    quiz: [
      {
        question: "Scenario: Your component is re-rendering too often because of an object passed as a prop from a parent. Which hook should the parent use to stabilize the object?",
        options: ["useEffect", "useMemo", "useCallback", "useRef"],
        correctAnswer: 1
      },
      {
        question: "When using the 'useEffect' hook, which dependency array behavior causes the effect to run only once after the initial mount?",
        options: ["No dependency array", "An empty array []", "A full array of all props", "[true]"],
        correctAnswer: 1
      },
      {
        question: "What is the primary purpose of the 'key' prop when rendering lists in React?",
        options: ["To style specific elements", "To help React identify which items have changed, been added, or removed", "To set the index of the element", "To bind events to the element"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You need a child component to call a function in its parent. How is this typically handled in React?",
        options: ["Using document.getElementById()", "Passing the function as a prop to the child", "Using a global variable", "React doesn't support this"],
        correctAnswer: 1
      },
      {
        question: "Which hook should you use if you need to persist a value between renders but don't want to trigger a re-render when the value changes?",
        options: ["useState", "useRef", "useReducer", "useContext"],
        correctAnswer: 1
      },
      {
        question: "In React, what is 'lifting state up' referring to?",
        options: ["Moving state to a higher-level common ancestor", "Making state global using Redux", "Increasing the performance of state updates", "Deleting unused state"],
        correctAnswer: 0
      },
      {
        question: "Scenario: You want to share a piece of data (like a theme or user info) across many components without passing props manually. What is the best built-in tool?",
        options: ["Redux", "Context API", "Local Storage", "React Router"],
        correctAnswer: 1
      },
      {
        question: "What is the 'Virtual DOM' in React?",
        options: ["A direct copy of the browser's DOM", "A lightweight representation of the real DOM in memory", "A separate browser window for testing", "A CSS styling engine"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You are fetching data from an API inside a component. In which hook should you place the fetch call?",
        options: ["useLayoutEffect", "useEffect", "useMemo", "useState"],
        correctAnswer: 1
      },
      {
        question: "What is the correct way to update a state variable named 'count' using the useState hook?",
        options: ["count = count + 1", "setCount(count + 1)", "count.update(1)", "forceUpdate()"],
        correctAnswer: 1
      },
      {
        question: "Which architectural pattern does React primarily follow?",
        options: ["MVC (Model-View-Controller)", "Component-Based Architecture", "Monolithic Architecture", "Event-Driven Backends"],
        correctAnswer: 1
      },
      {
        question: "What is a 'Higher-Order Component' (HOC)?",
        options: ["A component with many child elements", "A function that takes a component and returns a new component", "The top-level App component", "A component that renders in a modal"],
        correctAnswer: 1
      },
      {
        question: "Scenario: You need to access a DOM element directly, such as for focusing an input. Which React tool do you use?",
        options: ["findDOMNode", "refs (via useRef)", "Selectors", "Event listeners"],
        correctAnswer: 1
      },
      {
        question: "What happens if you update state directly (e.g., this.state.val = 5) in a class component?",
        options: ["React re-renders automatically", "React will not re-render, leading to stale UI", "An error is thrown immediately", "The page refreshes"],
        correctAnswer: 1
      },
      {
        question: "In the context of React hooks, what is 'Rules of Hooks' primary constraint?",
        options: ["Must only be called at the top level", "Can be called inside conditions", "Can be called inside loops", "Must be called in plain JavaScript files"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'node-801',
    title: "Node.js (Backend Ecosystem)",
    description: "Engineering Certification: Event Loop, Streams, Cluster Module, and Express Architecture.",
    image: "https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Advanced",
    domain: "Backend",
    points: 1300,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: `Node Assessment ${i + 1}: What manages ${i % 2 === 0 ? 'Asynchronous operations' : 'Process scaling'}?`,
      options: ["Event Loop", "Cluster Module", "FS Module", "NPM"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'sql-901',
    title: "SQL & Database Mastery",
    description: "Database Certification: Queries, Complex Joins, Indexing, ACID Transactions, and Schema Normalization.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
    duration: "5 Hours",
    difficulty: "Intermediate",
    domain: "Database",
    points: 1150,
    theoryPages: [],
    passingScore: 12,
    quiz: [
      {
        question: "Which SQL clause is used to filter rows after an aggregation like GROUP BY has taken place?",
        options: ["WHERE", "HAVING", "ORDER BY", "FILTER BY"],
        correctAnswer: 1
      },
      {
        question: "What is the primary difference between TRUNCATE and DELETE in SQL?",
        options: ["DELETE is faster than TRUNCATE", "TRUNCATE removes all rows without logging individual row deletions, making it faster", "TRUNCATE allows a WHERE clause", "There is no difference"],
        correctAnswer: 1
      },
      {
        question: "Which JOIN returns all records from the left table, and the matched records from the right table, filling with NULL if no match?",
        options: ["INNER JOIN", "FULL OUTER JOIN", "LEFT OUTER JOIN", "CROSS JOIN"],
        correctAnswer: 2
      },
      {
        question: "In relational database design, what does the 'A' in ACID transactions stand for?",
        options: ["Availability", "Atomicity", "Authentication", "Accuracy"],
        correctAnswer: 1
      },
      {
        question: "Which normalization form requires that all non-key attributes are fully functionally dependent on the entire Primary Key (no partial dependencies)?",
        options: ["1st Normal Form (1NF)", "2nd Normal Form (2NF)", "3rd Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
        correctAnswer: 1
      },
      {
        question: "How does a Clustered Index alter table data storage in SQL Server / MySQL InnoDB?",
        options: ["It physically sorts and stores data rows in the table based on the key values", "It stores pointers in a separate table without sorting data", "It disables write operations on the table", "It only indexes text columns"],
        correctAnswer: 0
      },
      {
        question: "Which SQL statement is recommended to protect backend database queries from SQL Injection vulnerabilities?",
        options: ["String concatenation", "Prepared Statements (Parameterized Queries)", "Base64 encoding", "Regular Expression replacement"],
        correctAnswer: 1
      },
      {
        question: "What is the output of COUNT(*) vs COUNT(column_name) when the column contains NULL values?",
        options: ["Both count NULL values", "COUNT(*) counts all rows; COUNT(column_name) ignores NULLs", "COUNT(*) ignores NULLs", "COUNT(column_name) throws an error"],
        correctAnswer: 1
      },
      {
        question: "Which SQL command is used to add a new column to an existing table?",
        options: ["MODIFY TABLE table_name ADD col_name datatype;", "ALTER TABLE table_name ADD col_name datatype;", "UPDATE TABLE table_name ADD col_name datatype;", "INSERT COLUMN col_name INTO table_name;"],
        correctAnswer: 1
      },
      {
        question: "In SQL, which window function provides a continuous rank without gaps for duplicate values?",
        options: ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "LEAD()"],
        correctAnswer: 2
      },
      {
        question: "What type of key uniquely identifies each record and enforces non-null, unique constraint by default?",
        options: ["Foreign Key", "Primary Key", "Candidate Key", "Super Key"],
        correctAnswer: 1
      },
      {
        question: "Which constraint ensures that all values in a column satisfy a specific Boolean condition (e.g., age >= 18)?",
        options: ["UNIQUE", "NOT NULL", "CHECK", "DEFAULT"],
        correctAnswer: 2
      },
      {
        question: "What does the SQL command EXPLAIN (or EXPLAIN PLAN) do?",
        options: ["Explains table documentation to user", "Shows the query execution plan and index usage determined by the optimizer", "Executes the query and prints human feedback", "Validates SQL syntax without connection"],
        correctAnswer: 1
      },
      {
        question: "Which SQL operator is used to search for a specified pattern in a column using wildcards (% and _)?",
        options: ["IN", "LIKE", "BETWEEN", "MATCHES"],
        correctAnswer: 1
      },
      {
        question: "What is a View in SQL?",
        options: ["A physical copy of the database", "A virtual table based on the result-set of an SQL query", "A backup snapshot stored on disk", "A temporary trigger"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'cloud-1001',
    title: "Cloud & DevOps (AWS, Docker, K8s)",
    description: "DevOps Certification: Containerization, Kubernetes Pod Orchestration, AWS Core Services (EC2, S3, IAM), and CI/CD Pipelines.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    duration: "7 Hours",
    difficulty: "Advanced",
    domain: "Cloud & DevOps",
    category: "Technical",
    points: 1350,
    theoryPages: [],
    passingScore: 12,
    quiz: [
      {
        question: "What is the primary architectural purpose of Docker containerization compared to a traditional Virtual Machine?",
        options: ["Containers share the host OS kernel, making them lightweight and fast to boot", "Containers emulate complete hardware including BIOS and virtual drivers", "Containers run only Python applications", "Containers require hypervisor hardware virtualization"],
        correctAnswer: 0
      },
      {
        question: "In Kubernetes architecture, which master control plane component is responsible for distributing workloads across worker nodes?",
        options: ["kube-proxy", "kube-scheduler", "kubelet", "etcd"],
        correctAnswer: 1
      },
      {
        question: "Which AWS service provides serverless compute execution triggered by HTTP requests or cloud events without managing EC2 instances?",
        options: ["AWS EC2", "AWS Lambda", "AWS ECS", "AWS RDS"],
        correctAnswer: 1
      },
      {
        question: "In CI/CD pipelines, what is the main goal of the Continuous Integration (CI) stage?",
        options: ["Automatically charge customer credit cards", "Automatically merge code, run automated tests, and detect syntax/regression bugs early", "Deploy untested code to production", "Scale down EC2 instances"],
        correctAnswer: 1
      },
      {
        question: "Which file format is standard for defining multi-container configurations in local development environments?",
        options: ["Dockerfile", "docker-compose.yml", "package.json", "k8s-pod.xml"],
        correctAnswer: 1
      },
      {
        question: "What is the default storage class for frequently accessed data in AWS Simple Storage Service (S3)?",
        options: ["S3 Glacier Deep Archive", "S3 Standard", "S3 One Zone-IA", "S3 Snowball"],
        correctAnswer: 1
      },
      {
        question: "In Kubernetes, what is the smallest deployable computing unit that can be created and managed?",
        options: ["Deployment", "Pod", "Cluster", "Service"],
        correctAnswer: 1
      },
      {
        question: "Which Infrastructure as Code (IaC) declarative tool uses HCL to provision cloud infrastructure across AWS, Azure, and GCP?",
        options: ["Ansible", "Terraform", "Docker Swarm", "Puppet"],
        correctAnswer: 1
      },
      {
        question: "What does a Kubernetes Ingress controller manage?",
        options: ["Internal pod-to-pod memory access", "External HTTP/HTTPS access routing to services within the cluster", "Container disk formatting", "Physical node cooling systems"],
        correctAnswer: 1
      },
      {
        question: "What is Blue-Green Deployment strategy?",
        options: ["Deploying code on blue terminals only", "Maintaining two identical production environments to switch traffic with zero downtime", "Deploying software only on weekends", "Rolling back versions on every deploy"],
        correctAnswer: 1
      },
      {
        question: "In AWS IAM, what principle recommends granting only the minimum permissions required to perform a task?",
        options: ["Principle of Maximum Availability", "Principle of Least Privilege", "Root Access Principle", "Zero Latency Policy"],
        correctAnswer: 1
      },
      {
        question: "Which tool is commonly used to monitor container metrics, memory, and CPU alerts in cloud native stacks?",
        options: ["Prometheus & Grafana", "WordPress", "FileZilla", "Vite"],
        correctAnswer: 0
      },
      {
        question: "What is the primary difference between a StatefulSet and a Deployment in Kubernetes?",
        options: ["StatefulSets provide unique, persistent network identifiers and ordered storage for databases", "Deployments cannot run web servers", "StatefulSets cannot be scaled", "There is no difference"],
        correctAnswer: 0
      },
      {
        question: "What is a Reverse Proxy commonly used for in modern web architectures?",
        options: ["Compiling TypeScript code", "Load balancing, SSL termination, and caching incoming client traffic (e.g. NGINX)", "Editing database tables", "Running unit tests"],
        correctAnswer: 1
      },
      {
        question: "Which Git branching strategy is characterized by short-lived feature branches merged frequently into the main trunk?",
        options: ["Trunk-Based Development", "Waterfall Branching", "Subversion Locking", "Deadlock Branching"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'cyber-1101',
    title: "Cybersecurity & Ethical Defense",
    description: "Security Certification: Network Vulnerability Scanning, OWASP Top 10, Penetration Testing Basics, Cryptography, and Zero-Trust Architecture.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Cybersecurity",
    category: "Technical",
    points: 1300,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: [
        "What is the primary countermeasure against Cross-Site Scripting (XSS) vulnerabilities in web applications?",
        "Which cryptographic algorithm is asymmetric (public-private key pair)?",
        "What does the principle of Zero Trust Security mandate?",
        "What type of attack involves overwhelming a network server with spoofed traffic until it crashes?",
        "In OWASP Top 10, what does Broken Access Control refer to?",
        "What is the difference between Hashing and Encryption?",
        "Which protocol provides secure encrypted terminal communication over an insecure network?",
        "What is a Man-in-the-Middle (MITM) attack?",
        "What is the primary function of a Web Application Firewall (WAF)?",
        "What is Phishing?",
        "What does Multi-Factor Authentication (MFA) enforce?",
        "Which HTTP header helps protect against clickjacking by preventing iframing?",
        "What is a SQL Injection (SQLi) vulnerability?",
        "What is Salting in password storage?",
        "What is Penetration Testing (Ethical Hacking)?"
      ][i],
      options: [
        ["Context-aware output encoding and Content Security Policy (CSP)", "Disabling HTTPS", "Using plain cookies", "Storing passwords in local storage"],
        ["AES-256", "RSA", "DES", "Blowfish"],
        ["Never trust, always verify every access request regardless of origin", "Trust everyone inside the office LAN", "Disable passwords", "Allow all API calls"],
        ["Distributed Denial of Service (DDoS)", "SQL Injection", "Buffer Overflow", "Phishing"],
        ["Users acting outside their intended permissions (e.g. user viewing admin data)", "Server overheating", "Syntax errors", "Slow internet connection"],
        ["Hashing is a one-way mathematical function; encryption is reversible with a key", "Hashing requires a secret key to decode", "They are identical", "Encryption cannot be decrypted"],
        ["Telnet", "SSH (Secure Shell)", "FTP", "HTTP"],
        ["An attacker intercepting and potentially altering communication between two parties", "A hardware failure", "A monitor glitch", "A compiler crash"],
        ["Filter and monitor HTTP traffic between web application and the Internet", "Compile JavaScript", "Format SSD drives", "Speed up CPU clock"],
        ["Social engineering attack designed to deceive users into disclosing sensitive credentials", "Installing RAM", "Testing software", "Writing documentation"],
        ["Requiring two or more distinct verification factors before granting account access", "Asking password twice", "Using capital letters only", "Disabling login on weekends"],
        ["X-Frame-Options: DENY", "Content-Type: text/html", "Server: Apache", "Accept: text/plain"],
        ["Flaw where untrusted user input alters backend database queries", "A slow hard drive", "A broken CSS style", "An expired domain name"],
        ["Adding unique random string data to passwords before hashing to defeat rainbow table attacks", "Encrypting database twice", "Deleting weak passwords", "Displaying passwords in clear text"],
        ["Authorized simulated cyberattack on computer system to evaluate its security", "Hacking for ransom", "Writing malicious code", "Formatting servers without permission"]
      ][i],
      correctAnswer: [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0][i]
    }))
  },
  {
    id: 'uiux-2001',
    title: "UI/UX Design & Design Systems (Figma)",
    description: "Design Certification: User Research, Wireframing, Auto Layout & Components in Figma, Usability Testing, and WCAG Accessibility Standards.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Design",
    category: "Non-Technical",
    points: 1250,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: [
        "What is the primary difference between UI (User Interface) and UX (User Experience)?",
        "In Figma, what feature allows elements to adapt dynamically to their content size and screen dimensions?",
        "What is the purpose of conducting User Research during the product discovery phase?",
        "What does the 60-30-10 Rule in UI color theory recommend?",
        "What does WCAG compliance ensure in digital product design?",
        "What is a Design System?",
        "In information architecture, what is a Wireframe?",
        "What is Hick's Law in user experience psychology?",
        "What is a Micro-interaction in UI design?",
        "What is the main objective of A/B Testing in product design?",
        "In typography, what is Leading (line-height)?",
        "What is an Empathy Map used for in Design Thinking?",
        "What is Responsive Design?",
        "What is the purpose of Usability Testing?",
        "What is Fitts's Law in interaction design?"
      ][i],
      options: [
        ["UI focuses on visual elements & aesthetics; UX focuses on user journey, usability & problem-solving", "UI is for mobile only; UX is for desktop only", "They are identical terms", "UI is backend coding; UX is sales"],
        ["Auto Layout", "Pen Tool", "Boolean Union", "Export to PDF"],
        ["Understand real user pain points, behaviors, and motivations before building", "Decide software pricing", "Choose hosting providers", "Write database schemas"],
        ["60% dominant color, 30% secondary color, 10% accent color", "60% font size, 30% margin, 10% padding", "60% images, 30% text, 10% icons", "Use 10 colors equally"],
        ["Accessibility for users with visual, auditory, motor, or cognitive disabilities", "Faster CPU performance", "Higher Google ranking only", "Cheaper font licensing"],
        ["A single source of truth containing reusable UI components, tokens, and style guidelines", "A folder of random screenshots", "A software license", "A database table"],
        ["A low-fidelity visual schematic representing page structure and content hierarchy", "A final code build", "A marketing banner", "An invoices spreadsheet"],
        ["The time it takes to make a decision increases with the number and complexity of choices", "Users read every word on a webpage", "Larger buttons are always cheaper", "More colors improve speed"],
        ["Subtle visual animations and feedback that communicate state changes to the user (e.g. button hover, switch toggle)", "A small bug", "A slow network request", "A short error message"],
        ["Comparing two variants (A vs B) of a design with real users to measure conversion and performance metrics", "Testing software on two monitors", "Writing code in two languages", "Checking grammar"],
        ["Vertical space between lines of text", "Space between individual letters (tracking)", "Font weight", "Font color"],
        ["Synthesizing what a target persona Says, Thinks, Does, and Feels", "Drawing app wireframes", "Calculating revenue", "Listing competitor features"],
        ["Designing layouts that seamlessly adjust and optimize across smartphones, tablets, and desktops", "Designing for dark mode only", "Writing fast server code", "Using static pixel dimensions"],
        ["Observing representative users interacting with a prototype to identify usability bottlenecks and friction", "Testing server memory limits", "Testing battery consumption", "Proofreading code comments"],
        ["The time required to rapidly move to a target area is a function of the target distance and target size", "Buttons should always be invisible", "Text must always be italicized", "Scroll speed must be constant"]
      ][i],
      correctAnswer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i]
    }))
  },
  {
    id: 'pm-2101',
    title: "Product Management & Agile Strategy",
    description: "Management Certification: Product Discovery, User Personas, PRD Drafting, OKRs & KPIs, Scrum/Kanban, and Go-to-Market (GTM) Execution.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60",
    duration: "5 Hours",
    difficulty: "Intermediate",
    domain: "Product Management",
    category: "Non-Technical",
    points: 1200,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: [
        "What is the primary role of a Product Manager (PM) in a tech organization?",
        "What does an MVP (Minimum Viable Product) represent in Lean Product Development?",
        "In Agile Scrum methodology, what is a Sprint?",
        "What is a PRD (Product Requirement Document)?",
        "What does the North Star Metric represent for a digital product?",
        "What is the difference between Scrum and Kanban?",
        "In product prioritization, what does the RICE framework evaluate?",
        "What is Product-Market Fit (PMF)?",
        "What is the primary purpose of a User Story in Agile?",
        "What does Churn Rate measure in SaaS business metrics?",
        "In OKRs (Objectives and Key Results), what should Key Results always be?",
        "What is a Go-to-Market (GTM) Strategy?",
        "What does Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) indicate?",
        "What is the MoSCoW prioritization technique?",
        "What is a Retrospective meeting in Scrum?"
      ][i],
      options: [
        ["Connecting customer needs, business goals, and engineering execution to deliver value", "Writing all backend code", "Managing server infrastructure", "Selling software licenses door to door"],
        ["Earliest version of a product with just enough core features to validate learning with early adopters", "A product with zero features", "The final version released after 5 years", "An internal marketing deck"],
        ["A time-boxed iteration (usually 1-4 weeks) where a development team produces a potentially releasable increment", "A marathon running competition", "An emergency server reboot", "A sales presentation"],
        ["Comprehensive document outlining product purpose, user persona, feature specs, and success metrics", "An invoice bill", "A source code repository", "An HR contract"],
        ["The single key metric that best captures the core value your product delivers to customers", "Total office square footage", "The company stock price today", "Number of employees hired"],
        ["Scrum uses fixed-length sprints and predefined roles; Kanban is continuous flow based on work-in-progress (WIP) limits", "Scrum is for sales; Kanban is for coding", "Kanban requires daily sprints", "They are identical frameworks"],
        ["Reach, Impact, Confidence, and Effort", "Revenue, Income, Cash, Expense", "Readiness, Identity, Culture, Ethics", "Reviews, Installs, Clicks, Engagement"],
        ["When a product satisfies strong market demand and customers actively buy, use, and recommend it", "When marketing budget is spent", "When code compiles without errors", "When a logo is designed"],
        ["Short, simple description of a feature told from the perspective of the end user (As a [user], I want [goal] so that [benefit])", "A fictional bedtime story", "A legal terms document", "A database query"],
        ["The percentage of customers who stop subscribing or using your product over a specific period", "Website page loading time", "Number of passwords reset", "Total server memory used"],
        ["Measurable, time-bound outcomes that track progress towards the objective", "Vague wishes without numbers", "Opinions from competitors", "Static rules that never change"],
        ["An action plan that specifies how a company will reach target customers and achieve competitive advantage when launching", "A code deployment script", "An office relocation plan", "A tax filing procedure"],
        ["Healthy business unit economics (LTV should be significantly higher than CAC, e.g. 3:1)", "Company is losing money on every customer", "CAC must always equal zero", "LTV has no impact on growth"],
        ["Categorizing features into Must-have, Should-have, Could-have, and Won't-have", "A city in Russia", "A programming compiler", "A hardware standard"],
        ["A meeting held at the end of a sprint for the team to inspect what went well, what didn't, and commit to improvements", "A salary negotiation meeting", "An interview test", "A customer sales pitch"]
      ][i],
      correctAnswer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i]
    }))
  },
  {
    id: 'mkt-2201',
    title: "Digital Marketing & Growth Hacking",
    description: "Marketing Certification: Search Engine Optimization (SEO), Performance Marketing (Google/Meta Ads), Conversion Funnels, and Viral Loops.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    duration: "5 Hours",
    difficulty: "Beginner",
    domain: "Marketing",
    category: "Non-Technical",
    points: 1100,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: [
        "What is the core difference between Organic SEO and Pay-Per-Click (PPC) advertising?",
        "In Google Search Optimization, what is a Backlink and why is it important?",
        "What does the AARRR (Pirate Metrics) framework stand for in Growth Hacking?",
        "What does CTR (Click-Through Rate) calculate?",
        "What is a Conversion Funnel in digital commerce?",
        "What is On-Page SEO?",
        "In email marketing, what is A/B Testing subject lines used for?",
        "What does ROAS (Return on Ad Spend) evaluate?",
        "What is a Viral Loop in product-led growth?",
        "What is Content Marketing?",
        "What does Remarketing / Retargeting achieve in ad campaigns?",
        "What is the function of Google Analytics 4 (GA4)?",
        "What is a Landing Page optimized for?",
        "What is Influencer Marketing?",
        "What is Customer Lifetime Value (CLV) in growth marketing?"
      ][i],
      options: [
        ["SEO drives unpaid traffic through content and search rankings; PPC pays for targeted ad placements", "SEO is paid; PPC is free", "They are identical channels", "SEO is only for mobile apps"],
        ["A link from an external website pointing to your site, serving as a vote of authority for search engine algorithms", "A broken link on a page", "An internal navigation menu", "A social media hashtag"],
        ["Acquisition, Activation, Retention, Referral, Revenue", "Audience, Ads, Results, Reports, Revenue", "Awareness, Action, Reach, Rate, Return", "Accounts, Assets, Rules, Roles, Reviews"],
        ["The percentage of people who click on a link/ad out of total people who viewed it (Clicks / Impressions * 100)", "Total money spent on ads", "Number of refunds processed", "Website bounce rate"],
        ["The step-by-step path a prospect navigates from discovering a brand to completing a desired purchase", "A physical pipeline", "A server cooling filter", "An email inbox folder"],
        ["Optimizing elements directly on the website (title tags, headers, content quality, page speed) for search engines", "Buying banner ads", "Running offline TV commercials", "Cold calling customers"],
        ["Measuring which subject line generates a higher email Open Rate with a test audience", "Checking spelling only", "Sending emails twice", "Deleting unsubscribed users"],
        ["Revenue generated directly per dollar invested in advertising campaigns", "Total clicks received", "Website hosting bill", "Brand logo recognition"],
        ["A mechanism where each new user naturally introduces or invites one or more additional users during normal usage", "A computer virus", "An infinite server loop", "A broken database trigger"],
        ["Creating and distributing valuable, relevant content to attract and engage a clearly defined target audience", "Spamming forums with links", "Writing code comments", "Cold email mass outreach"],
        ["Serving tailored ads specifically to users who previously visited your website but did not convert", "Showing ads to random people", "Blocking spam bots", "Deleting cookies"],
        ["Tracking user behavior, event conversions, engagement sessions, and audience demographics across platforms", "Sending bulk emails", "Editing video files", "Designing website logos"],
        ["Driving visitors toward a single, focused Call-to-Action (CTA) without distracting navigation", "Showing all 50 company products", "Displaying legal terms", "Writing long blog articles"],
        ["Partnering with niche content creators who possess credibility and audience trust to promote your brand", "Hiring actors for TV only", "Buying fake followers", "Running billboard ads"],
        ["The total revenue a business can reasonably expect from a single customer throughout their relationship", "Cost of a single purchase", "Annual marketing budget", "Average monthly website visitors"]
      ][i],
      correctAnswer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i]
    }))
  },
  {
    id: 'biz-2301',
    title: "Business Analytics & Power BI",
    description: "Analytics Certification: Data Modeling, DAX Expressions, Interactive Executive Dashboards, KPI Tracking, and Exploratory Data Analysis.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Business Analytics",
    category: "Non-Technical",
    points: 1250,
    theoryPages: [],
    passingScore: 12,
    quiz: Array.from({ length: 15 }, (_, i) => ({
      question: [
        "In Microsoft Power BI, what is DAX (Data Analysis Expressions)?",
        "What is the difference between a Calculated Column and a Measure in Power BI?",
        "In data modeling, what is a Star Schema?",
        "What is the primary function of Power Query in the Power BI workflow?",
        "What does an Executive Dashboard aim to provide to decision-makers?",
        "What is a Fact Table in a data warehouse?",
        "What is a Dimension Table?",
        "What does a Slicer do in a Power BI report?",
        "What is the difference between Descriptive and Predictive Analytics?",
        "In Excel / Power BI, what is VLOOKUP / XLOOKUP used for?",
        "What is an Outlier in a business dataset?",
        "What does KPI stand for in business operations?",
        "In data cleaning, how should missing values (NULLs) be handled based on business context?",
        "What is Data Storytelling?",
        "What is a Drill-Down action in interactive business intelligence reports?"
      ][i],
      options: [
        ["Formula language used to create custom calculations, aggregations, and measures", "A programming language like C++", "A hardware connection cable", "A database server operating system"],
        ["Measures calculate dynamically on aggregated data in context; calculated columns evaluate row-by-row and consume memory", "Measures can only be numbers; columns can only be text", "They are identical", "Measures cannot be used in charts"],
        ["Multi-dimensional model where a central fact table connects directly to surrounding dimension tables", "A database with star symbols", "A single flat text file", "An unindexed messy spreadsheet"],
        ["Extract, transform, clean, and reshape raw data before loading it into the data model (ETL)", "Drawing pie charts", "Sending email alerts", "Managing user passwords"],
        ["High-level, real-time visual summaries of critical business metrics and trends at a glance", "Detailed raw database logs with millions of rows", "Source code repositories", "An HR attendance sheet"],
        ["Table containing quantitative measurements, transactional metrics, and foreign keys (e.g. sales amounts, units sold)", "Table with user biographies", "Table of company logos", "A backup snapshot file"],
        ["Table containing contextual descriptive attributes used to filter and group fact data (e.g. customer name, product category, date)", "A table of numbers only", "A system log", "A temporary trigger"],
        ["An on-canvas interactive visual filter that allows report users to filter data across all visualizations on the page", "A tool to delete rows", "A chart animation speed dial", "A database repair script"],
        ["Descriptive analytics analyzes what happened in the past; predictive analytics forecasts what is likely to happen in the future", "They both only predict the future", "Descriptive is for coding; predictive is for marketing", "There is no difference"],
        ["Searching for a value in a table and retrieving a corresponding value from another column", "Drawing line charts", "Encrypting passwords", "Splitting text by comma"],
        ["A data point that differs significantly from other observations in the same sample", "The average value", "A missing value", "A normal daily transaction"],
        ["Key Performance Indicator", "Knowledge Program Interface", "Kernel Process Identifier", "Key Production Index"],
        ["Imputing (mean/median/mode), flagging, or removing rows thoughtfully based on domain impact", "Deleting all columns immediately", "Replacing all with zero blindly", "Ignoring without analysis"],
        ["Translating complex data insights into actionable business narratives with compelling visualizations", "Writing fictional novels about data", "Reading spreadsheets aloud", "Printing charts on paper"],
        ["Navigating from a high-level summary view into deeper granular levels of data (e.g. Year -> Quarter -> Month)", "Deleting old data", "Refreshing the database", "Exporting report to PDF"]
      ][i],
      correctAnswer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i]
    }))
  }
];

