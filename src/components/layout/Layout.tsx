import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Header from './Header';
import Footer from './Footer';


interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContent}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
