import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/notes');
        setNotices(response.data);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto text-left">
        <div className="flex justify-between items-center mb-10 border-b border-purple-50 pb-6">
          <h1 className="text-3xl font-bold text-purple-600 uppercase tracking-tight">Announcements</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-400 font-bold uppercase tracking-widest text-sm border-b-2 border-purple-400 hover:text-purple-600 hover:border-purple-600 transition-all font-semibold"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Fetching latest updates...</p>
        ) : notices.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 p-10 rounded text-center">
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No new notices at this time.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white border-l-4 border-purple-400 p-8 rounded shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex gap-4 items-center mb-4">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter">New</span>
                  <h2 className="text-xl font-bold text-black uppercase tracking-tight">{notice.title}</h2>
                </div>
                <p className="text-gray-700 mb-6 whitespace-pre-wrap leading-relaxed">
                  {notice.description}
                </p>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                  Published {new Date(notice.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notices;
