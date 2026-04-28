import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  Users,
  CreditCard,
  Zap,
  RefreshCcw,
  ChevronRight,
  AlertCircle,
  Loader2,
  History,
  Eye,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  CreditCard as CardIcon,
  Shield,
  Users as UsersIcon
} from 'lucide-react';

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [token, setToken] = useState("");

  const [pendingList, setPendingList] = useState([]);
  const [readyList, setReadyList] = useState([]);
  const [finalizedList, setFinalizedList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null); // For viewing details modal

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    emergencyContactName: "",
    emergencyContactNumber: ""
  });

  const BASE_URL = "https://api.wemis.in";

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken || "");
    fetchDashboardData(storedToken);
  }, []);

  const getHeaders = (t) => ({
    headers: {
      Authorization: `Bearer ${t || token}`,
      'Content-Type': 'application/json'
    }
  });

  const fetchDashboardData = async (t) => {
    setLoading(true);
    try {
      const [resPending, resReady] = await Promise.all([
        axios.get(`${BASE_URL}/api/hr/bgv/pending-approval`, getHeaders(t)),
        axios.get(`${BASE_URL}/api/hr/bgv/ready-to-finalize`, getHeaders(t))
      ]);

      setPendingList(resPending.data || []);
      setReadyList(resReady.data || []);

      console.log("%c [DATA FETCHED] Pending Approval:", "color: #16a34a; font-weight: bold", resPending.data);
      console.log("%c [DATA FETCHED] Ready to Finalize:", "color: #2563eb; font-weight: bold", resReady.data);

    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndProceed = async (candidate) => {
    const idToApprove = candidate.id || candidate.applicationId;
    setActionLoading(idToApprove);
    try {
      await axios.post(`${BASE_URL}/api/hr/bgv/bulk-approve`, [idToApprove], getHeaders());
      setSelectedCandidate(candidate);
      setActiveTab('onboarding');
    } catch (err) {
      console.error("Approve Error:", err);
      alert("Failed to approve candidate. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert("No candidate selected");
      return;
    }

    setLoading(true);
    try {
      const id = selectedCandidate.id || selectedCandidate.applicationId;

      const payload = {
        ...bankDetails,
        candidateId: id,
        applicationId: selectedCandidate.applicationId
      };

      await axios.post(`${BASE_URL}/api/public/bgv/submit-onboarding/${id}`, payload, getHeaders());

      setBankDetails({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        emergencyContactName: "",
        emergencyContactNumber: ""
        
      });
      setSelectedCandidate(null);
      setShowSuccessModal(true);

      await fetchDashboardData();

      setTimeout(() => {
        setShowSuccessModal(false);
        setActiveTab('finalize');
      }, 2000);

    } catch (err) {
      console.error("Onboarding Error:", err);
      alert("Failed to submit onboarding details. " + (err.response?.data?.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const DocumentRow = ({ label, file }) => {
    if (!file) return null;

    return (
      <div className="flex items-center justify-between border p-3 rounded-lg">
        <span className="text-sm font-medium">{label}</span>

        <a
          href={`${BASE_URL}/${file}`} // VERY IMPORTANT
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline"
        >
          View
        </a>
      </div>
    );
  };
  const handleBulkFinalize = async () => {
    const validRecords = readyList.filter(emp => !emp.employeeId?.includes("ERROR"));
    const ids = validRecords.map(emp => emp.employeeId || emp.employeeId);
    console.log("Finalizing IDs:", ids);

    if (ids.length === 0) {
      alert("No valid records found to finalize.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/hr/bgv/bulk-finalize`, ids, getHeaders());

      console.log("%c [SUCCESS] Finalized Data:", "color: #10b981; font-weight: bold", response.data);

      setFinalizedList(prev => [...prev, ...validRecords]);

      await fetchDashboardData();

      alert(`Successfully finalized ${ids.length} employees.`);
      setActiveTab('history');
    } catch (err) {
      console.error("Finalize Error:", err);
      alert("Failed to finalize. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Component to show detailed candidate information
  const CandidateDetailsModal = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Candidate Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={User} label="Full Name" value={candidate.fullName} />
                <InfoRow icon={Mail} label="Email Address" value={candidate.emailAddress} />
                <InfoRow icon={Phone} label="Contact Number" value={candidate.contactNumber} />
                <InfoRow icon={Calendar} label="Date of Birth" value={candidate.dob ? new Date(candidate.dob).toLocaleDateString() : 'N/A'} />
                <InfoRow icon={Shield} label="Aadhar Number" value={candidate.aadharNumber || 'N/A'} />
                <InfoRow icon={FileText} label="PAN Number" value={candidate.panNumber || 'N/A'} />
                <InfoRow icon={CardIcon} label="Passport Number" value={candidate.passportNumber || 'N/A'} />
              </div>
            </div>
            {/* Documents */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentRow label="10th Marksheet" file={candidate.documentPaths?.["10TH_MARKSHEET"]} />
                <DocumentRow label="12th Marksheet" file={candidate.documentPaths?.["12TH_MARKSHEET"]} />
                <DocumentRow label="Aadhar Card" file={candidate.documentPaths?.["AADHAR_CARD"]} />
                <DocumentRow label="PAN Card" file={candidate.documentPaths?.["PAN_CARD"]} />
                <DocumentRow label="Passport Photo" file={candidate.documentPaths?.["PASSPORT_PHOTO"]} />
                <DocumentRow label="Photograph" file={candidate.documentPaths?.["PHOTOGRAPH"]} />
                <DocumentRow label="Degree Certificate" file={candidate.documentPaths?.["DEGREE_CERTIFICATE"]} />
                <DocumentRow label="Highest Degree" file={candidate.documentPaths?.["HIGHEST_DEGREE"]} />
                <DocumentRow label="Bank Passbook / Cheque" file={candidate.documentPaths?.["BANK_PASSBOOK_OR_CHEQUE"]} />
              </div>
            </div>


            {/* Bank Details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CardIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-800">Bank Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Bank Name" value={candidate.bankName || 'N/A'} />
                <InfoRow label="Account Number" value={candidate.accountNumber || 'N/A'} />
                <InfoRow label="IFSC Code" value={candidate.ifscCode || 'N/A'} />
              </div>
            </div>

            {/* Education Details */}
            {candidate.educationDetails && candidate.educationDetails.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Education Details</h3>
                </div>
                <div className="space-y-3">
                  {candidate.educationDetails.map((edu, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoRow label="Level" value={edu.level} />
                        <InfoRow label="Institute" value={edu.institute} />
                        <InfoRow label="Passing Year" value={edu.passingYear} />
                        <InfoRow label="Percentage" value={`${edu.percentage}%`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employment History */}
            {candidate.employmentHistory && candidate.employmentHistory.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Employment History</h3>
                </div>
                <div className="space-y-3">
                  {candidate.employmentHistory.map((emp, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InfoRow label="Company" value={emp.company} />
                        <InfoRow label="Designation" value={emp.designation} />
                        <InfoRow label="Duration" value={emp.duration} />
                        <InfoRow label="HR Contact" value={emp.hrContact} />
                      </div>
                    </div>
                  ))}
                </div>
                <InfoRow label="Last Drawn Salary" value={candidate.lastDrawnSalary || 'N/A'} />
              </div>
            )}

            {/* References */}
            {candidate.references && candidate.references.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <UsersIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-slate-800">References</h3>
                </div>
                <div className="space-y-3">
                  {candidate.references.map((ref, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoRow label="Name" value={ref.name} />
                        <InfoRow label="Company" value={ref.company} />
                        <InfoRow label="Contact" value={ref.contact} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-slate-800">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Contact Name" value={candidate.emergencyContactName || 'N/A'} />
                <InfoRow label="Contact Number" value={candidate.emergencyContactNumber || 'N/A'} />
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Declarations</h3>
              <InfoRow label="Criminal Record Declaration" value={candidate.criminalRecordDeclaration || 'N/A'} />
            </div>

            {/* Status */}
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-indigo-800">Application Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {candidate.status || "PENDING"}
                </span>
              </div>
              <div className="mt-2 text-sm text-indigo-600">
                <span className="font-mono">Application ID: {candidate.applicationId}</span>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end">
            <button
              onClick={() => {
                onClose();
                handleApproveAndProceed(candidate);
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Approve & Proceed <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper component for info rows
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400 mt-0.5" />}
      <div className="flex-1">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm text-slate-900 font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center transform animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Onboarding Submitted!</h3>
        <p className="text-slate-600">
          Bank details for {selectedCandidate?.fullName} have been successfully submitted.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {showSuccessModal && <SuccessModal />}
      {selectedDetails && <CandidateDetailsModal candidate={selectedDetails} onClose={() => setSelectedDetails(null)} />}

      <nav className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg"><Zap className="text-white w-5 h-5" /></div>
            <span className="text-xl font-bold tracking-tight">OnboardFlow</span>
          </div>
          <button
            onClick={() => fetchDashboardData()}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-4xl">
            {[
              { id: 'pending', label: 'Approval', icon: Users, count: pendingList.length },
              { id: 'onboarding', label: 'Details', icon: CreditCard },
              { id: 'finalize', label: 'Finalize', icon: CheckCircle, count: readyList.length },
              { id: 'history', label: 'History', icon: History, count: finalizedList.length },
            ].map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className="flex flex-col items-center group relative cursor-pointer"
                  onClick={() => step.id !== 'onboarding' && setActiveTab(step.id)}
                >
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 
                    ${activeTab === step.id ? 'bg-indigo-600 border-indigo-600 shadow-lg' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                    <step.icon className={`w-5 h-5 ${activeTab === step.id ? 'text-white' : 'text-slate-400'}`} />
                    {step.count > 0 && step.id !== 'onboarding' && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {step.count}
                      </span>
                    )}
                  </div>
                  <span className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                    ${activeTab === step.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {idx !== 3 && <div className="flex-1 h-[2px] bg-slate-200 mx-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {activeTab === 'pending' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {pendingList.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left">Candidate Details</th>
                    <th className="px-6 py-4 text-left">Contact Info</th>
                    <th className="px-6 py-4 text-left">Education</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingList.map(c => (
                    <tr key={c.id || c.applicationId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{c.fullName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">ID: {c.id?.slice(-8)}</div>
                        <div className="text-xs text-slate-400">DOB: {c.dob ? new Date(c.dob).toLocaleDateString() : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{c.emailAddress}</div>
                        <div className="text-xs text-slate-400">{c.contactNumber}</div>
                        <div className="text-xs text-slate-400 mt-1">PAN: {c.panNumber || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {c.educationDetails && c.educationDetails[0] && (
                          <div>
                            <div className="text-sm font-medium">{c.educationDetails[0].level}</div>
                            <div className="text-xs text-slate-400">{c.educationDetails[0].percentage}%</div>
                            <div className="text-xs text-slate-400">{c.educationDetails[0].passingYear}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {c.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDetails(c)}
                            className="text-blue-600 font-medium flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye size={16} /> View Details
                          </button>
                          <button
                            onClick={() => handleApproveAndProceed(c)}
                            disabled={actionLoading === (c.id || c.applicationId)}
                            className="text-indigo-600 font-bold flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === (c.id || c.applicationId) ?
                              <Loader2 className="animate-spin w-4 h-4" /> :
                              <>Approve <ChevronRight size={16} /></>
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'onboarding' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Bank Account Details</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Entering details for: <span className="font-semibold text-indigo-600">{selectedCandidate?.fullName}</span>
                </p>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., State Bank of India"
                    required
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Account Number"
                    required
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">IFSC Code</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all uppercase"
                    placeholder="IFSC Code"
                    required
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidate(null);
                      setActiveTab('pending');
                    }}
                    className="flex-1 border border-slate-300 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin w-5 h-5" />}
                    Complete Submission
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'finalize' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">Pending Activation</h2>
                <p className="text-slate-500 text-sm">{readyList.length} candidate(s) ready for finalization</p>
              </div>
              <button
                onClick={handleBulkFinalize}
                disabled={readyList.length === 0 || loading}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                {loading && <Loader2 className="animate-spin w-4 h-4" />}
                Execute Bulk Finalize
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {readyList.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No candidates ready for finalization</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Candidate</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Application ID</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {readyList.map(e => (
                      <tr key={e.id || e.applicationId} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{e.fullName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{e.emailAddress}</div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">{e.applicationId}</code>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {e.employeeId?.includes("ERROR") ?
                            <span className="text-red-500 text-[10px] font-bold bg-red-50 px-2 py-1 rounded">MISSING RECORD</span> :
                            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">READY FOR ACTIVATION</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <History size={20} />
              <h2 className="text-2xl font-bold">Recently Finalized Records</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalizedList.length > 0 ? finalizedList.map((emp, idx) => (
                <div key={emp.id || emp.applicationId || idx} className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-lg">FINALIZED</div>
                  <p className="text-xs font-mono text-slate-400 mb-1 break-all">
                    App ID: {emp.applicationId?.slice(-12)}
                  </p>
                  <h3 className="font-bold text-slate-800 text-lg">{emp.fullName}</h3>
                  <div className="mt-3 text-sm text-slate-600">
                    <p>📧 {emp.emailAddress}</p>
                    <p>📞 {emp.contactNumber}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-emerald-600 text-xs font-bold">
                    <CheckCircle size={14} /> Account Activated Successfully
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  No records finalized in this session
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;