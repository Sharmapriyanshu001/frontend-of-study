import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

function Units() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectName = searchParams.get('name');

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await api.get(`/materials/${subjectId}`);
        setUnits(response.data);
      } catch (error) {
        console.error('Failed to fetch units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [subjectId]);

  const handleGenerateSummary = async (unitId, pdfUrl) => {
    setLoadingSummaries({ ...loadingSummaries, [unitId]: true });
    try {
      const response = await api.post('/hf-summary', { pdfUrl });
      setSummaries({ ...summaries, [unitId]: response.data.summary });
    } catch (error) {
      console.error('AI Summary Error:', error);
      alert(error.response?.data?.message || 'Failed to generate summary');
    } finally {
      setLoadingSummaries({ ...loadingSummaries, [unitId]: false });
    }
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto text-left">
        <div className="flex justify-between items-center mb-10 border-b border-purple-50 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-600 uppercase tracking-tight">{subjectName}</h1>
            <p className="text-gray-500 text-sm mt-1">Study materials and units</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-400 font-bold uppercase tracking-widest text-sm border-b-2 border-purple-400 hover:text-purple-600 hover:border-purple-600 transition-all"
          >
            ← All Subjects
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Syncing materials...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {units.length === 0 && <p className="text-gray-500">No units uploaded for this subject yet.</p>}
            {units.map((unit) => (
              <div key={unit._id} className="flex flex-col gap-2">
                <div
                  className="bg-white border border-gray-100 p-6 rounded-lg flex items-center justify-between hover:border-purple-200 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-black">{unit.unitName}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">PDF Resource</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleGenerateSummary(unit._id, unit.pdfUrl)}
                      disabled={loadingSummaries[unit._id]}
                      className={`flex items-center gap-2 border-2 ${loadingSummaries[unit._id] ? 'border-gray-100 text-gray-400' : 'border-purple-100 text-purple-600 hover:bg-purple-50'} font-bold py-2 px-4 rounded transition-all text-sm`}
                      title="AI Summary"
                    >
                      {loadingSummaries[unit._id] ? '🤖 Generating summary...' : '🤖 AI Summary'}
                    </button>
                    <button
                      onClick={() => navigate(`/pdf/${unit._id}`)}
                      className="bg-purple-400 text-white font-bold py-2 px-6 rounded hover:bg-purple-50 transition-all border-2 border-purple-400"
                    >
                      Open PDF
                    </button>
                  </div>
                </div>
                
                {/* AI Summary Box */}
                {summaries[unit._id] && (
                  <div className="bg-purple-50/30 border-l-4 border-purple-400 p-6 rounded-r-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🤖</span>
                      <h4 className="text-sm font-bold text-purple-600 uppercase tracking-widest">AI Quick Summary</h4>
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {summaries[unit._id].split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSummaries({...summaries, [unit._id]: null})}
                      className="text-xs font-bold text-purple-400 uppercase hover:text-purple-600 transition-all mt-4"
                    >
                      Close Summary
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Units;
