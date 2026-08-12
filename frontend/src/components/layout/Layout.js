import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      <div className={`flex-1 flex flex-col h-full w-full transition-all duration-300 ${
        !isMobile && sidebarOpen ? 'ml-72' : 'ml-0'
      }`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto pt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

