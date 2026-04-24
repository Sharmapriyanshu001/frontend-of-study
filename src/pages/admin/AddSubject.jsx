import React, { useState } from 'react';
import api from '../../api/axios';

function AddSubject() {
  const [subjectName, setSubjectName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsSubmitting(true);
    
    try {
      await api.post('/subjects', { name: subjectName });
      setMessage({ text: `Course "${subjectName}" has been successfully initialized!`, type: 'success' });
      setSubjectName('');
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to initialize course', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
          Add Course
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          Strategic Subject Registration System
        </p>
      </div>
      
      {/* Form Card */}
      <div className="bg-white p-10 md:p-14 rounded-[2rem] border border-purple-50 shadow-xl shadow-purple-500/5 relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

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
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Official Subject Identifier
              </label>
            </div>
            
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full bg-gray-50/50 border-2 border-transparent border-b-purple-100 p-6 rounded-2xl text-lg text-gray-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-bold placeholder:text-gray-300 placeholder:font-medium"
              placeholder="e.g. Advanced Machine Learning"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">
              Verify name before submission
            </p>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                relative px-12 py-5 rounded-2xl text-sm font-black text-white 
                bg-gradient-to-r from-purple-600 to-indigo-700 
                hover:shadow-2xl hover:shadow-purple-500/30 
                hover:-translate-y-1 active:translate-y-0
                transition-all duration-300 uppercase tracking-widest
                flex items-center gap-3
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Create Subject</>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default AddSubject;
