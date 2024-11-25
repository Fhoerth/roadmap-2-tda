import React from 'react';
import problemsData from './data/problems.json';

import './css/App.css';

import { ProblemTracker } from './types/ProblemTracker';
import ProblemLevels from './components/ProblemsLevels';
import CourseList from './components/CourseList';

function sortProblemsByDifficulty(data: ProblemTracker): ProblemTracker {
  // Orden de dificultad
  const difficultyOrder: { [key: string]: number } = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  // Crear una copia del JSON ordenada
  const sortedData: ProblemTracker = {
    levels: data.levels.map((level) =>
      level.map((category) => ({
        ...category,
        problems: category.problems.sort(
          (a, b) =>
            difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
        ),
      })),
    ),
  };

  return sortedData;
}

// Aseguramos que el JSON cumpla con el tipo
const data = sortProblemsByDifficulty(problemsData as ProblemTracker);
const courses = [
  { id: 1, name: 'Algorithmic Toolbox (UC San Diego)', url: 'https://www.coursera.org/learn/algorithmic-toolbox#modules' },
  { id: 2, name: 'Algorithms, Part II (Princeton University)', url: 'https://www.coursera.org/learn/algorithms-part2#modules' },
  { id: 3, name: 'Algorithms Specialization (Stanford University)', url: 'https://www.coursera.org/specializations/algorithms#courses' },
];

const App: React.FC = () => {
  return (<><CourseList courses={courses} /><ProblemLevels data={data} /></>);

};

export default App;
