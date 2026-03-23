import React, { useEffect, useState } from "react";
import axios from "axios";

function OnboardingDashboard() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // --- API Call 1: Fetch All Applications ---
  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://api.wemis.in/api/careers/applications", getAuthConfig());
      setApplications(res.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError((prev) => prev + "• Permission denied for Applications. ");
      }
    }
  };

  // --- API Call 2: Fetch Selected Candidates (Updated Endpoint) ---
  const fetchSelected = async () => {
    try {
      // Using the specific stage endpoint you provided
      // Note: If 'APP001' is a placeholder, you might need to fetch this per-id
      const res = await axios.get(
        "https://api.wemis.in/api/careers/applications/selected", 
        getAuthConfig()
      );
      
      // Normalize data: ensure it's an array for the dashboard stats
      const data = res.data;
      console.log(data)
      setSelected(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError((prev) => prev + "• Permission denied for Selected Candidates. ");
      }
    }
  };

  // --- API Call 3: Fetch Feedback ---
  const fetchFeedback = async () => {
    try {
      const res = await axios.get("https://api.wemis.in/api/careers/feedback", getAuthConfig());
      setFeedback(res.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError((prev) => prev + "• Permission denied for Feedback. ");
      }
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    setSelectedFeedback(null);

    await Promise.all([
      fetchApplications(),
      fetchSelected(),
      fetchFeedback(),
    ]);

    setLoading(false);
  };

  // --- Helpers ---
  const isSelected = (appId) => {
    // Matches against ID or application reference in the selected list
    return selected.some((s) => s.id === appId || s.applicationId === appId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
      });
    } catch { return dateStr; }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  };

  const EvaluationBox = ({ label, data }) => {
    if (!data) return null;
    return (
      <div className="border border-gray-200 rounded p-2 bg-white">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{data.rating}/5</span>
        </div>
        {data.comments && <p className="text-gray-500 text-xs line-clamp-1">{data.comments}</p>}
      </div>
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen w-full py-6 px-4 flex flex-col font-sans">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Onboarding</h1>
          <p className="text-sm text-gray-500">Real-time application tracking</p>
        </div>
        <button onClick={loadDashboardData} className="bg-white border px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-sm">
          Refresh Dashboard
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-gray-400 uppercase font-bold">Total Apps</p>
          <p className="text-3xl font-bold">{applications.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-green-500 uppercase font-bold">Selected</p>
          <p className="text-3xl font-bold">{selected.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-blue-500 uppercase font-bold">Feedback</p>
          <p className="text-3xl font-bold">{feedback.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Table */}
        <div className="xl:col-span-8 bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-bold">Recent Applications</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{app.fullName || app.name}</td>
                    <td className="p-4 text-gray-500">{app.currentJobTitle || app.positionApplied}</td>
                    <td className="p-4">
                      {isSelected(app.id) ? 
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Selected</span> : 
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">Pending</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback List/Detail Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white border rounded-lg shadow-sm h-full min-h-[500px] flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <span className="font-bold">{selectedFeedback ? "Feedback Details" : "Interviews"}</span>
              {selectedFeedback && <button onClick={() => setSelectedFeedback(null)} className="text-blue-600 text-xs">← Back</button>}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {!selectedFeedback ? (
                feedback.map((f, i) => (
                  <div key={i} onClick={() => setSelectedFeedback(f)} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                    <p className="font-bold text-gray-800">{f.candidateName || "Candidate"}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{f.positionApplied}</span>
                      <span className="text-yellow-500">{renderStars(f.overallRating)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4">
                  <h3 className="text-lg font-bold">{selectedFeedback.candidateName}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <EvaluationBox label="Technical" data={selectedFeedback.evaluation?.technicalKnowledge} />
                    <EvaluationBox label="Culture" data={selectedFeedback.evaluation?.culturalFit} />
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm italic">
                      "{selectedFeedback.additionalComments || "No additional comments"}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingDashboard;