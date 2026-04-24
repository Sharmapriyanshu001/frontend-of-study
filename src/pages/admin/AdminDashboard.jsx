import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    subjects: 0,
    materials: 0,
    notices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [subRes, matRes, noteRes] = await Promise.all([
          api.get('/subjects'),
          api.get('/materials'),
          api.get('/notes')
        ]);
        setStats({
          subjects: subRes.data.length,
          materials: matRes.data.length,
          notices: noteRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Subjects', value: stats.subjects },
    { name: 'Study Materials', value: stats.materials },
    { name: 'Announcements', value: stats.notices },
  ];

  const graphData = [
    { name: 'Subjects', count: stats.subjects, color: '#8b5cf6' },
    { name: 'Materials', count: stats.materials, color: '#ec4899' },
    { name: 'Notices', count: stats.notices, color: '#10b981' }
  ];

  const quickActions = [
    { name: 'Add Student', icon: '👤', path: '/admin/add-student', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    { name: 'Add Subject', icon: '📚', path: '/admin/add-subject', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    { name: 'Upload PDF', icon: '📄', path: '/admin/upload-pdf', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100' },
    { name: 'Broadcast Notice', icon: '📢', path: '/admin/manage-notices', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  ];

  return (
    <div className="w-full text-left">
      <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
            Admin Workspace
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>

        </div>
      </div>

      {loading ? (
        <div className="flex items-center space-x-4 text-purple-600 py-10">
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-bold tracking-widest uppercase text-xs">Syncing system analytics...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Top Numeric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="relative group overflow-hidden bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:border-purple-200 transition-all duration-300"
              >
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-50/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="relative z-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                  {stat.name}
                </p>
                <h3 className="relative z-10 text-5xl font-black text-gray-800 tracking-tighter">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Middle Content: Graph + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Visual Analytics Graph */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="mb-8">
                <h3 className="text-xs font-black text-purple-900 uppercase tracking-[0.2em]">Platform Metrics</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live data distribution</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#f5f3ff' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                      {graphData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Access Menu */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8">
                <h3 className="text-xs font-black text-purple-900 uppercase tracking-[0.2em]">Quick Actions</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">One-click management</p>
              </div>

              <div className="flex-1 grid grid-cols-1 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => navigate(action.path)}
                    className={`flex items-center gap-4 ${action.bg} border-2 border-transparent hover:${action.border} p-4 rounded-2xl transition-all duration-300 group hover:-translate-y-1 w-full text-left`}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm ${action.text} text-xl group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`text-sm font-black ${action.text}`}>{action.name}</span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Execute action →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer System Status */}
      <div className="mt-10 mb-10">
        <div className="bg-gray-50/50 p-6 border border-gray-100 rounded-2xl flex items-center justify-between">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest content-center flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            System monitoring live content
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
