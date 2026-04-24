import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

function ManageContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchContent = async () => {
    try {
      const response = await api.get('/materials');
      setContent(response.data);
    } catch (error) {
      console.error('Failed to fetch materials', error);
      setMessage({ text: 'Internal registry synchronization failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Strategically remove this material from the registry?')) return;
    
    try {
      await api.delete(`/materials/${id}`);
      setMessage({ text: 'Resource successfully purged from database', type: 'success' });
      fetchContent();
    } catch (error) {
      setMessage({ text: 'Purge operation failed', type: 'error' });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
          Content Inventory
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          Review and remove uploaded study materials
        </p>
      </div>

      {message.text && (
        <div className={`p-5 max-w-2xl mx-auto rounded-2xl mb-10 border transition-all animate-in fade-in slide-in-from-top-4 duration-500 ${
          message.type === 'success' 
          ? 'bg-purple-50/50 border-purple-100 text-purple-800' 
          : 'bg-red-50/50 border-red-50 text-red-600'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold ${
              message.type === 'success' ? 'bg-purple-600 text-white' : 'bg-red-500 text-white'
            }`}>
              {message.type === 'success' ? '✓' : '!'}
            </span>
            <p className="text-sm font-bold uppercase tracking-wide">
              {message.text}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-purple-50 shadow-xl shadow-purple-500/5 overflow-hidden group relative">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-indigo-50/30 border-b border-purple-50">
                <th className="p-8 font-black text-[10px] text-purple-900 uppercase tracking-[0.3em]">Course Subject</th>
                <th className="p-8 font-black text-[10px] text-purple-900 uppercase tracking-[0.3em]">Unit Title</th>
                <th className="p-8 font-black text-[10px] text-purple-900 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing with Mainframe...</p>
                    </div>
                  </td>
                </tr>
              ) : content.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Registry is empty.</p>
                  </td>
                </tr>
              ) : (
                content.map((item) => (
                  <tr key={item._id} className="hover:bg-purple-50/20 transition-colors group/row">
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        <span className="text-sm font-black text-gray-800 uppercase tracking-tight">
                          {item.subjectId?.name || '---'}
                        </span>
                      </div>
                    </td>
                    <td className="p-8 text-sm text-gray-500 font-bold tracking-wide">{item.unitName}</td>
                    <td className="p-8 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5"
                      >
                        Delete Asset
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-10 text-center opacity-40">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Real-time Inventory Management</p>
      </div>
    </div>
  );
}

export default ManageContent;
