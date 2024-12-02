import React, { useState } from 'react';

import { Category, Problem, ProblemTracker } from '../types/ProblemTracker';

type ProblemLevelsProps = {
  data: ProblemTracker;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Arial', sans-serif",
    color: '#333',
    margin: '0 auto',
    padding: '20px',
    lineHeight: '1.6',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  level: {
    marginBottom: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  levelTitle: {
    fontSize: '1.8rem',
    color: '#007acc',
    marginBottom: '15px',
    textAlign: 'center',
  },
  category: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    marginBottom: '15px',
  },
  categoryTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  problemList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'left',
  },
  problemItem: {
    marginBottom: '8px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  },
  problemLink: {
    color: '#007acc',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '8px',
  },
  problemLinkCompleted: {
    color: '#007acc',
    textDecoration: 'line-through',
    fontWeight: 'bold',
    marginLeft: '8px',
  },
  checkbox: {
    marginRight: '8px',
  },
};

const ProblemLevels = ({ data }: ProblemLevelsProps) => {
  const { levels } = data;
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(
    new Set(),
  );

  const toggleCompleted = (problemId: number) => {
    setCompletedProblems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  return (
    <div style={styles.container}>
      {levels.map((level, levelIndex) => (
        <div style={styles.level} key={levelIndex}>
          <h2 style={styles.levelTitle}>Nivel {levelIndex + 1}</h2>
          {level.map((category: Category, categoryIndex: number) => (
            <div style={styles.category} key={categoryIndex}>
              <h3 style={styles.categoryTitle}>{category.category}</h3>
              <ul style={styles.problemList}>
                {category.problems.map((problem: Problem) => (
                  <li key={problem.id} style={styles.problemItem}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={completedProblems.has(problem.id)}
                      onChange={() => toggleCompleted(problem.id)}
                      id={`problem-${problem.id}`}
                    />
                    <label htmlFor={`problem-${problem.id}`}>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={
                          completedProblems.has(problem.id)
                            ? styles.problemLinkCompleted
                            : styles.problemLink
                        }
                      >
                        {problem.id}: {problem.name} ({problem.difficulty})
                      </a>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProblemLevels;
