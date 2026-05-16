export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  domain: string;
  points: number;
  theoryPages: string[];
  quiz: QuizQuestion[];
  passingScore: number;
}
