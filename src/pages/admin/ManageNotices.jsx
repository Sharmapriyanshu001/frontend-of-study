import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotices = async () => {
    try {
      const response = await api.get('/notes');
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      toast.error('Failed to synchronize broadcasts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsSubmitting(true);

    if (!formData.title || !formData.description) {
      toast.warning('Incomplete dataset. All fields required.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, formData);
        toast.success('Announcement record successfully updated');
      } else {
        await api.post('/notes', formData);
        toast.success('New broadcast successfully published');
      }
      setFormData({ title: '', description: '' });
      setEditingId(null);
      fetchNotices();
    } catch (error) {
      console.error('Failed to save notice:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notice) => {
    setFormData({ title: notice.title, description: notice.description });
    setEditingId(notice._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Strategically remove this broadcast from history?')) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.info('Announcement successfully purged');
      fetchNotices();
    } catch (error) {
      console.error('Failed to delete notice:', error);
      toast.error('Purge operation failed');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <div className="mb-12 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
          Notice Management
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          System-Wide Broadcast Infrastructure
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-10 md:p-14 rounded-[2rem] border border-purple-50 shadow-xl shadow-purple-500/5 relative overflow-hidden group mb-20">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <h2 className="relative z-10 text-xs font-black text-purple-900 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-purple-50 flex items-center justify-center gap-2 text-center w-full">
          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
          {editingId ? 'Modify Active Broadcast' : 'Draft New Announcement'}
        </h2>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Broadcast Heading</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50/50 border-b-2 border-transparent focus:border-purple-500 focus:bg-white p-5 rounded-2xl text-gray-800 font-bold transition-all focus:outline-none placeholder:text-gray-300"
              placeholder="e.g. Strategic Curriculum Update"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Detailed Transmission</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50/50 border-b-2 border-transparent focus:border-purple-500 focus:bg-white p-6 rounded-3xl text-gray-800 font-medium transition-all focus:outline-none min-h-[160px] placeholder:text-gray-300"
              placeholder="Write the full announcement logic here..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 uppercase tracking-widest flex items-center gap-3 ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Processing...' : (editingId ? 'Update Broadcast' : 'Publish Notice')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', description: '' });
                }}
                className="px-10 py-5 rounded-2xl text-xs font-black text-purple-400 border-2 border-purple-50 hover:bg-purple-50 transition-all uppercase tracking-widest"
              >
                Discard Edits
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gray-100"></div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Broadcast Archive</h2>
          <div className="h-px flex-1 bg-gray-100"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-[10px] font-black text-purple-300 uppercase tracking-[0.2em]">Synchronizing Archive...</div>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Archive is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-white border border-purple-50 p-10 rounded-[2rem] hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                    <div className="max-w-2xl">
                       <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-tight group-hover:text-purple-700 transition-colors uppercase">{notice.title}</h3>
                       <div className="flex items-center gap-2 mt-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                           Broadcast Stabilized: {new Date(notice.createdAt).toLocaleDateString()}
                         </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300"
                        title="Edit Record"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Purge Record"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-2xl">
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {notice.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageNotices;
