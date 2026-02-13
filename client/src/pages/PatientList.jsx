import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${backendUrl}/api/patients/displayPatients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${backendUrl}${imagePath}`;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading patients...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Patient List</h1>
      
      {patients.length === 0 ? (
        <p className="text-gray-500">No patients found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Disease</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created By</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {getImageUrl(patient.Image) ? (
                      <img
                        src={getImageUrl(patient.Image)}
                        alt={`${patient.firstName} ${patient.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{patient.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.disease}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        patient.Status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : patient.Status === 'hospitalized'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {patient.Status || 'Active'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {patient.createdBy?.username || 'Unknown'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(patient.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;
