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
    description: "6-Hour Intensive: Master the DOM, Semantic layers, CSS Grid, and high-performance rendering.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Frontend",
    points: 1000,
    theoryPages: GENERATE_THEORY_PAGES("Web Development", "Web Architecture"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `Web Dev Assessment ${i + 1}: Which mechanism is primary for ensuring ${i % 2 === 0 ? 'Accessibility' : 'Performance'}?`,
      options: ["Inline styles", "Semantic HTML Tags", "Div wrappers", "Heavy JavaScript processing"],
      correctAnswer: 1
    }))
  },
  {
    id: 'dsa-201',
    title: "Data Structures & Algorithms (DSA)",
    description: "6-Hour Technical Depth: Graphs, Tries, Dynamic Programming, and Space-Time complexity.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Advanced",
    domain: "Computer Science",
    points: 1200,
    theoryPages: GENERATE_THEORY_PAGES("DSA Mastery", "Computational Complexity"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `DSA Assessment ${i + 1}: What is the optimal time complexity for ${i % 3 === 0 ? 'Binary Search' : i % 3 === 1 ? 'Quicksort average' : 'Hashmap lookup'}?`,
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: i % 3 === 0 ? 2 : i % 3 === 1 ? 3 : 0
    }))
  },
  {
    id: 'java-301',
    title: "Java Mastery (Core & Advanced)",
    description: "8-Hour Deep Dive: JVM Architecture, Multithreading, Streams API, and Design Patterns.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    duration: "8 Hours",
    difficulty: "Advanced",
    domain: "Backend",
    points: 1500,
    theoryPages: GENERATE_THEORY_PAGES("Java Fundamentals", "Enterprise Architecture"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `Java Assessment ${i + 1}: Which concept is primary for ${i % 2 === 0 ? 'Memory Management' : 'Thread Safety'}?`,
      options: ["Garbage Collection", "Keyword 'synchronized'", "Static methods", "Pointers"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'python-401',
    title: "Python for Professionals",
    description: "6-Hour Journey: Decorators, Generators, AsyncIO, and Enterprise-grade Pythonic patterns.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Automation",
    points: 1100,
    theoryPages: GENERATE_THEORY_PAGES("Pythonic Logic", "Scripting Systems"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `Python Assessment ${i + 1}: What is the primary use of ${i % 2 === 0 ? 'Decorators' : 'Generators'}?`,
      options: ["Modifying function behavior", "Lazy evaluation of sequences", "Speeding up loops", "File I/O"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'aiml-501',
    title: "AI/ML (Intelligence Systems)",
    description: "10-Hour Intensive: Neural Networks, Transformers, Reinforcement Learning, and Smart Agents.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    duration: "10 Hours",
    difficulty: "Expert",
    domain: "AI/ML",
    points: 2000,
    theoryPages: GENERATE_THEORY_PAGES("Neural Architectures", "Machine Intelligence"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `AI Assessment ${i + 1}: Which architecture is key for ${i % 2 === 0 ? 'NLP' : 'Computer Vision'}?`,
      options: ["Transformers", "CNNs", "RNNs", "Linear Regression"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'ds-601',
    title: "Data Science Mastery",
    description: "8-Hour Logic: Statistical Modelling, ETL Pipelines, Pandas, and advanced Visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&auto=format&fit=crop&q=60",
    duration: "8 Hours",
    difficulty: "Advanced",
    domain: "Data Science",
    points: 1400,
    theoryPages: GENERATE_THEORY_PAGES("Statistical Inference", "Data Engineering"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `DS Assessment ${i + 1}: Which library is standard for ${i % 2 === 0 ? 'Data Manipulation' : 'Visualization'}?`,
      options: ["Pandas", "Matplotlib", "Requests", "Flask"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'react-701',
    title: "React (Architecture & Hooks)",
    description: "6-Hour Build: Component Lifecycles, Context API, Performance Tuning with memo/callback.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Intermediate",
    domain: "Frontend",
    points: 1200,
    theoryPages: GENERATE_THEORY_PAGES("React Reconciliation", "State Management"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `React Assessment ${i + 1}: Which hook handles ${i % 2 === 0 ? 'Side Effects' : 'Component State'}?`,
      options: ["useEffect", "useState", "useMemo", "useCallback"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  },
  {
    id: 'node-801',
    title: "Node.js (Backend Ecosystem)",
    description: "6-Hour Engineering: Event Loop, Streams, Cluster Module, and Express Architecture.",
    image: "https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?w=800&auto=format&fit=crop&q=60",
    duration: "6 Hours",
    difficulty: "Advanced",
    domain: "Backend",
    points: 1300,
    theoryPages: GENERATE_THEORY_PAGES("Asynchronous I/O", "Microservices"),
    passingScore: 16,
    quiz: Array.from({ length: 20 }, (_, i) => ({
      question: `Node Assessment ${i + 1}: What manages ${i % 2 === 0 ? 'Asynchronous operations' : 'Process scaling'}?`,
      options: ["Event Loop", "Cluster Module", "FS Module", "NPM"],
      correctAnswer: i % 2 === 0 ? 0 : 1
    }))
  }
];
