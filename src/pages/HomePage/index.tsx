import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaSearch, FaQuestionCircle } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import styles from './index.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <h1>Bienvenido a DocSearch</h1>
        <p className={styles.subtitle}>
          Una herramienta poderosa para buscar y analizar documentos con facilidad
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/upload">
            <Button variant="primary" size="lg">
              Comenzar a cargar documentos
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" size="lg">
              Buscar en documentos
            </Button>
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Características principales</h2>
        <div className={styles.featureGrid}>
          <Card className={styles.featureCard} hoverable>
            <div className={styles.featureIcon}>
              <FaUpload size={40} color="#2563eb" />
            </div>
            <h3>Carga de Documentos</h3>
            <p>
              Sube fácilmente documentos PDF y TXT para indexarlos y hacerlos buscables.
            </p>
            <Link to="/upload" className={styles.learnMore}>
              Aprende más →
            </Link>
          </Card>

          <Card className={styles.featureCard} hoverable>
            <div className={styles.featureIcon}>
              <FaSearch size={40} color="#2563eb" />
            </div>
            <h3>Búsqueda Avanzada</h3>
            <p>
              Encuentra información relevante en tus documentos con nuestra potente búsqueda.
            </p>
            <Link to="/search" className={styles.learnMore}>
              Probar búsqueda →
            </Link>
          </Card>

          <Card className={styles.featureCard} hoverable>
            <div className={styles.featureIcon}>
              <FaQuestionCircle size={40} color="#2563eb" />
            </div>
            <h3>Preguntas y Respuestas</h3>
            <p>
              Haz preguntas en lenguaje natural y obtén respuestas basadas en tus documentos.
            </p>
            <Link to="/ask" className={styles.learnMore}>
              Hacer una pregunta →
            </Link>
          </Card>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>Cómo funciona</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Carga tus documentos</h3>
            <p>Sube archivos PDF o TXT para que podamos procesarlos.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Busca información</h3>
            <p>Encuentra contenido relevante en tus documentos.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Haz preguntas</h3>
            <p>Obtén respuestas precisas basadas en tus documentos.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
