import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${backendUrl}/api/report/display_report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading reports...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Report List</h1>
      
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{report.body}</p>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-500 mb-2">
                  <strong>Conclusion:</strong> {report.conclusion}
                </p>
                <p className="text-xs text-gray-400">
                  Created by: {report.createdBy?.username || 'Unknown'}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;
