import React from 'react';

type Course = {
  id: number;
  content: React.ReactElement;
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
    textAlign: 'left',
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
  paragraph: {
    color: '#007acc',
    fontWeight: 700,
    fontSize: '18px',
  },
};

const CourseList = ({ courses }: CourseListProps) => {
  return (
    <div style={courseStyles.container}>
      <div style={courseStyles.header}>
        <h2 style={courseStyles.title}>Introducción</h2>
        <p style={courseStyles.paragraph}>
          Los problemas están pensados para hacerse por niveles. <br />
          Son problemas que no mezclan conceptos, con enunciados sencillos de
          entender y directos. <br />
          La idea es que puedan dominar cada técnica y entiendan los algoritmos,
          y dentro de lo posible, intentar resolverlos tanto de forma iterativa
          como recursiva. <br />
          Si hay alguna duda con respecto a algún ejercicio en particula,
          siempre se puede preguntar en el grupo :). <br />
          Como verán, mis habilidades para el diseño gráfico son más que
          limitadas así que pido perdón por eso.
        </p>
      </div>

      <div style={courseStyles.header}>
        <h2 style={courseStyles.title}>Lista de Videos (AEDIII 2021)</h2>
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
              {course.content}
            </a>
          </li>
        ))}
        <li>
          Con estos videos y el contenido de IP + AED podemos llegar llegar al
          nivel 6 (Programación Dinámica)
        </li>
      </ul>
      <br />
    </div>
  );
};

export default CourseList;
