import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;