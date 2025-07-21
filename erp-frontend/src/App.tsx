import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Projects from './pages/Projects';
import Reports from './pages/Reports';

type Page = 'dashboard' | 'inventory' | 'invoices' | 'projects' | 'reports';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [locale, setLocale] = useState<string>('en');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard locale={locale} />;
      case 'inventory':
        return <Inventory locale={locale} />;
      case 'invoices':
        return <Invoices locale={locale} />;
      case 'projects':
        return <Projects locale={locale} />;
      case 'reports':
        return <Reports locale={locale} />;
      default:
        return <Dashboard locale={locale} />;
    }
  };

  return (
    <div className={`app ${locale === 'ar' ? 'rtl' : 'ltr'}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header 
        locale={locale}
        onLocaleChange={setLocale}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="app-container">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          locale={locale}
          isOpen={sidebarOpen}
        />
        
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="content-wrapper">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
