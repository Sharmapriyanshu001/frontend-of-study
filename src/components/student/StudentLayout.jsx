import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'My Subjects', path: '/dashboard' },
    { name: 'Notice Board', path: '/notices' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.info('You have logged out successfully.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-primary">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 relative">
            {/* Left: Branding */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent tracking-tight">
                STUDENT
              </Link>
            </div>

            {/* Center: Desktop Menu */}
            <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 h-full">
              <div className="flex space-x-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname.startsWith('/units'));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 shadow-sm'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Logout - Desktop */}
            <div className="hidden md:flex items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-purple-500 hover:bg-purple-600 transition-all shadow-md hover:shadow-purple-200"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-purple-50`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname.startsWith('/units'));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-semibold ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-bold text-purple-600 hover:bg-purple-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 bg-white">
        <div className="max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
