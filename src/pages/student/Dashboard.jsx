import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to convert string to PascalCase (Title Case)
  const toPascalCase = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="w-full text-left">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
            Student Workspace
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* Left Side: Search & Subjects */}
        <div className="lg:col-span-3 flex flex-col gap-8">

          {/* Search Bar Section */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-300 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for subjects or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 p-6 pl-16 rounded-[2rem] text-gray-700 font-bold focus:outline-none focus:border-purple-400 focus:shadow-xl focus:shadow-purple-500/5 transition-all placeholder:text-gray-300"
            />
          </div>

          {loading ? (
            <div className="flex items-center space-x-4 text-purple-600 py-10">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-bold tracking-widest uppercase text-xs">Syncing academic curriculum...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredSubjects.length === 0 && (
                <div className="sm:col-span-2 py-20 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    {searchQuery ? `No matches found for "${searchQuery}"` : "No courses registered."}
                  </p>
                </div>
              )}
              {filteredSubjects.map((subject) => (
                <div
                  key={subject._id}
                  onClick={() => navigate(`/units/${subject._id}?name=${encodeURIComponent(subject.name)}`)}
                  className="bg-white border border-gray-100 p-8 rounded-3xl cursor-pointer hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-50/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-800 tracking-tight group-hover:text-purple-700 transition-colors line-clamp-2 leading-tight">
                        {toPascalCase(subject.name)}
                      </h2>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-1 group-hover:text-purple-500 transition-colors">
                        Explore Modules <span className="opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-300">→</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Shortcut Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col sticky top-24">
            <div className="mb-8">
              <h3 className="text-xs font-black text-purple-900 uppercase tracking-[0.2em]">Priority Hub</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Shortcuts & Comms</p>
            </div>

            <button
              onClick={() => navigate('/notices')}
              className="flex items-center gap-4 bg-orange-50 border-2 border-transparent hover:border-orange-100 p-4 rounded-2xl transition-all duration-300 group hover:-translate-y-1 w-full text-left"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-orange-600 text-xl group-hover:scale-110 transition-transform">
                📢
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-black text-orange-600">Notice Board</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 group-hover:text-orange-400">View Announcements →</span>
              </div>
            </button>

            <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">System Live</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
