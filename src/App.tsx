import React from 'react';
import problemsData from './data/problems.json';
import { env } from './env/getEnv';

import './css/App.css';

import { ProblemTracker } from './types/ProblemTracker';
import ProblemLevels from './components/ProblemsLevels';
import CourseList from './components/CourseList';

console.log(env);

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
  {
    id: 1,
    content: (
      <p>
        Teórica 1: <br /> Complejidad, Fuerza Bruta, Backtracking.
      </p>
    ),
    url: 'https://www.youtube.com/watch?v=HzmyFzz7mtk',
  },
  {
    id: 2,
    content: (
      <p>
        Teórica 2: <br /> Algoritmos Golosos, Programación Dinámica.
      </p>
    ),
    url: 'https://www.youtube.com/watch?v=ro_IYTlUBAo&t=3016s',
  },
  {
    id: 3,
    content: (
      <p>
        Práctica 1: <br /> Backtracking, Programación Dinámica (Parte I).
      </p>
    ),
    url: 'https://www.youtube.com/watch?v=7CVdiDU2SU0',
  },
  {
    id: 4,
    content: (
      <p>
        Práctica 2: <br /> Algoritmos Golosos, Programación Dinámica (Parte II).
      </p>
    ),
    url: 'https://www.youtube.com/watch?v=NLj9z4SpBhc',
  },
];

const App: React.FC = () => {
  return (
    <>
      <CourseList courses={courses} />
      <ProblemLevels data={data} />
    </>
  );
};

export default App;
