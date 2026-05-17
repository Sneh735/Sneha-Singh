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
  }
];
