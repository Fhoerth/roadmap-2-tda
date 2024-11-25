import React from 'react';

type Course = {
  id: number;
  name: string;
  url: string;
};

type CourseListProps = {
  courses: Course[];
};

const courseStyles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Arial Black', 'Arial', sans-serif",
    color: '#333',
    margin: '20px auto',
    padding: '20px',
    lineHeight: '1.8',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  },
  header: {
    textAlign: 'left',
    marginBottom: '15px',
    padding: '10px',
    borderBottom: '2px solid #007acc',
  },
  title: {
    fontSize: '2.5rem',
    color: '#007acc',
    margin: 0,
    textAlign: 'left',
  },
  courseList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'left', // Alineación a la izquierda
  },
  courseItem: {
    marginBottom: '15px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  courseLink: {
    color: '#007acc',
    textDecoration: 'none',
  },
};

const CourseList = ({ courses }: CourseListProps) => {
  return (
    <div style={courseStyles.container}>
      <div style={courseStyles.header}>
        <h2 style={courseStyles.title}>Lista de Cursos (Coursera)</h2>
      </div>
      <ul style={courseStyles.courseList}>
        {courses.map((course) => (
          <li key={course.id} style={courseStyles.courseItem}>
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              style={courseStyles.courseLink}
            >
              {course.id}. {course.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
