export type Problem = {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  id: number;
};

export type Category = {
  category: string;
  problems: Problem[];
};

export type ProblemTracker = {
  levels: Category[][];
};
