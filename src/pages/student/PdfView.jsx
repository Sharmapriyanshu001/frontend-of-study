import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

function PdfView() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await api.get(`/materials/single/${unitId}`);
        setUnit(response.data);
      } catch (error) {
        console.error('Failed to fetch unit details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId]);

  if (loading) return <div className="p-8 italic text-gray-500">Loading document...</div>;
  if (!unit) return <div className="p-8 text-red-600 font-bold">Document not found.</div>;

  const cleanPdfPath = unit.pdfUrl.startsWith('/') ? unit.pdfUrl.substring(1) : unit.pdfUrl;
  const pdfUrl = `http://localhost:5000/${cleanPdfPath}`;

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      toast.info('Starting download...', { autoClose: 2000 });
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${unit.unitName}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Download successfully started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-20px)] bg-white">
      {/* Header */}
      <div className="bg-white border-b border-purple-50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-600 uppercase tracking-tight">{unit.unitName}</h1>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">PDF Viewer</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 border-2 border-purple-400 text-purple-600 font-bold py-2 px-6 rounded hover:bg-purple-50 transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            DOWNLOAD
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-400 text-white font-bold py-2 px-6 rounded hover:bg-purple-500 transition-all text-sm border-2 border-transparent"
          >
            CLOSE
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-hidden p-4 md:p-8 bg-gray-50">
        <div className="w-full h-full bg-white rounded shadow-sm overflow-hidden border border-gray-200">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={unit.unitName}
          />
        </div>
      </div>
    </div>
  );
}

export default PdfView;
