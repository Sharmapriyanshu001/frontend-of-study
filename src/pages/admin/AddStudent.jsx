import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

function AddStudent() {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleGenerate = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    setCredentials(null);

    try {
      const response = await api.post('/users/generate-student');
      setCredentials(response.data.data);
      toast.success('Student credentials successfully generated!');
    } catch (error) {
      console.error('Failed to generate student:', error);
      toast.error('Failed to generate credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <div className="mb-12 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight mb-3">
          Onboard New Student
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          Generate Secure Login Credentials
        </p>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[2rem] border border-purple-50 shadow-xl shadow-purple-500/5 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-gray-500 mb-8 max-w-lg">
            Click the button below to randomly generate a unique student ID and a secure 6-character password. Share these credentials with the student so they can log in.
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-12 py-5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 uppercase tracking-widest flex items-center gap-3 mb-10 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Generating...' : 'Generate New Credentials'}
          </button>

          {credentials && (
            <div className="w-full max-w-xl bg-gray-50/50 border-2 border-purple-100 rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-500 text-left">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-200 pb-4">
                Generated Details
              </h2>
              
              <div className="flex flex-col gap-6">
                {/* ID Container */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-black text-purple-900 uppercase tracking-[0.3em]">Student ID (Email)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      readOnly 
                      value={credentials.email} 
                      className="flex-1 bg-white border border-gray-200 p-4 rounded-xl text-gray-800 font-bold focus:outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(credentials.email, 'ID')}
                      className="px-6 py-4 bg-purple-50 text-purple-600 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      Copy ID
                    </button>
                  </div>
                </div>

                {/* Password Container */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-black text-purple-900 uppercase tracking-[0.3em]">Temporary Password</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      readOnly 
                      value={credentials.password} 
                      className="flex-1 bg-white border border-gray-200 p-4 rounded-xl text-gray-800 font-bold focus:outline-none tracking-widest"
                    />
                    <button 
                      onClick={() => copyToClipboard(credentials.password, 'Password')}
                      className="px-6 py-4 bg-purple-50 text-purple-600 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      Copy Pass
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="mt-6 text-[10px] text-red-400 font-bold italic text-center">
                * Please copy and save these details immediately. You will not be able to view this password again once you leave this page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
