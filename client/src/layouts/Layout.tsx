import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <div className="grid gap-4 xl:grid-cols-[18rem_1fr]">
          <Sidebar />
          <main className="space-y-4">
            <Navbar />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
