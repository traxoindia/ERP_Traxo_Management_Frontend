import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, CheckCircle, RefreshCcw, Search, Briefcase, ChevronRight } from "lucide-react";

function OnboardingDashboard() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [appRes] = await Promise.all([
        axios.get("https://api.wemis.in/api/careers/applications/selected", getAuthConfig()),
      ]);
      console.log(appRes.data);
      setApplications(appRes.data || []);
      setSelected(Array.isArray(appRes.data) ? appRes.data : appRes.data ? [appRes.data] : []);
    } catch (err) {
      console.error("Data sync error", err);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (appId) => selected.some((s) => s.id === appId || s.applicationId === appId);

  const filteredApps = applications.filter(app => 
    (app.fullName || app.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <RefreshCcw className="w-5 h-5 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans antialiased">
      
      {/* Simple Top Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rotate-45" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Traxo Verification</span>
          </div>
          <button 
            onClick={loadDashboardData}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-10">
        
        {/* Minimal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Applicants</p>
            <p className="text-3xl font-light">{applications.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Selected Candidates</p>
            <p className="text-3xl font-light text-blue-600">{selected.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
            <p className="text-3xl font-light">
              {applications.length > 0 ? ((selected.length / applications.length) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Applications Table - Clean List Style */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Applications</h2>
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter by name..."
                  className="bg-transparent border-b border-gray-200 pl-6 py-1 text-sm focus:border-black outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              {filteredApps.map((app) => (
                <div 
                  key={app.id} 
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                      {(app.fullName || app.name || "?").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{app.fullName || app.name}</h4>
                      <p className="text-xs text-gray-400">{app.currentJobTitle || app.positionApplied}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isSelected(app.id) ? (
                      <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Selected</span>
                    ) : (
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">Under Review</span>
                    )}
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Sidebar - Minimalist Card */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Selected Queue</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
              {selected.length > 0 ? (
                selected.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{person.fullName || "Candidate"}</p>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {person.id || person.applicationId}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  No candidates selected yet.
                </div>
              )}
            </div>
            
            <div className="mt-8 p-6 bg-blue-600 rounded-2xl text-white">
              <h4 className="text-sm font-semibold mb-2">Internal Update</h4>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Quarterly onboarding goals are 80% complete. Keep it up!
              </p>
              <div className="h-1 bg-blue-400 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[80%]" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default OnboardingDashboard;