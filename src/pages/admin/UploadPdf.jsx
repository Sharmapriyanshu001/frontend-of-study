import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

function UploadPdf() {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    unitName: '',
    pdf: null
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    const data = new FormData();
    data.append('subjectId', formData.subjectId);
    data.append('unitName', formData.unitName);
    data.append('pdf', formData.pdf);

    try {
      await api.post('/materials/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ text: 'Academic Resource has been successfully published!', type: 'success' });
      setFormData({ subjectId: '', unitName: '', pdf: null });
      if (document.getElementById('pdf-input')) {
        document.getElementById('pdf-input').value = '';
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Publication failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
          Publish Resource
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          Centralized Media Distribution Portal
        </p>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[2rem] border border-purple-50 shadow-xl shadow-purple-500/5 relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {message.text && (
          <div className={`p-5 rounded-2xl mb-10 border transition-all animate-in fade-in slide-in-from-top-4 duration-500 ${
            message.type === 'success' 
            ? 'bg-purple-50/50 border-purple-200 text-purple-800' 
            : 'bg-red-50/50 border-red-100 text-red-600'
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

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-10">
          {/* Subject Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Target Academic Course
              </label>
            </div>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full bg-gray-50/50 border-2 border-transparent border-b-purple-100 p-5 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
              required
            >
              <option value="">-- Select Subject Architecture --</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Unit Name */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Module / Chapter Identifier
              </label>
            </div>
            <input
              type="text"
              value={formData.unitName}
              onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
              className="w-full bg-gray-50/50 border-2 border-transparent border-b-purple-100 p-5 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-bold placeholder:text-gray-300"
              placeholder="e.g. Module 1: System Architecture"
              required
            />
          </div>

          {/* PDF Upload Area */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Digital Asset Payload (PDF)
              </label>
            </div>
            <div className="relative group/upload">
              <input
                id="pdf-input"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFormData({ ...formData, pdf: e.target.files[0] })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                required
              />
              <div className="border-2 border-dashed border-purple-100 bg-purple-50/20 p-10 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 group-hover/upload:border-purple-400 group-hover/upload:bg-purple-50/50 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {formData.pdf ? formData.pdf.name : 'Click to select or drag PDF file'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">MAX PAYLOAD: 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">
              Verify assets before deployment
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className={`
                px-12 py-5 rounded-2xl text-sm font-black text-white 
                bg-gradient-to-r from-purple-600 to-indigo-700 
                hover:shadow-2xl hover:shadow-purple-500/30 
                hover:-translate-y-1 active:translate-y-0
                transition-all duration-300 uppercase tracking-widest
                flex items-center gap-3
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>Start Upload</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadPdf;
