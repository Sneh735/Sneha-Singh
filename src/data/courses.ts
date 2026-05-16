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
  }
];
