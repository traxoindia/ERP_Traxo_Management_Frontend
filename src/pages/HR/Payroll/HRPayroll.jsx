import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  Clock,
  TrendingUp,
  Wallet,
  Receipt,
  Briefcase,
  ChevronRight,
  Home,
  Printer,
  Mail,
  Settings
} from "lucide-react";

const HRPayroll = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // State for active tab
  const [activeTab, setActiveTab] = useState("single");

  // Single Payroll State
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState(null);

  // Bulk Payroll State
  const [bulkMonth, setBulkMonth] = useState("");
  const [bulkYear, setBulkYear] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  // Settlement State
  const [settlement, setSettlement] = useState({
    employeeId: "",
    lwd: "",
    unusedLeaves: "",
    noticeServed: false,
  });
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [settlementResult, setSettlementResult] = useState(null);

  // My Payslips State
  const [payslips, setPayslips] = useState([]);
  const [payslipsLoading, setPayslipsLoading] = useState(false);

  // Employee History State
  const [historyEmployeeId, setHistoryEmployeeId] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Error States
  const [error, setError] = useState("");

  // Months data
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate Single Payroll
  const generatePayroll = async () => {
    setSingleLoading(true);
    setError("");
    setSingleResult(null);

    try {
      const res = await axios.post(
        `https://api.wemis.in/api/payroll/generate/${employeeId}/${month}/${year}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSingleResult(res.data);
      console.log(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Error generating payroll");
      console.error(err);
    } finally {
      setSingleLoading(false);
    }
  };

  // Generate Bulk Payroll
  const generateBulk = async () => {
    setBulkLoading(true);
    setError("");
    setBulkResult(null);

    try {
      const res = await axios.post(
        `https://api.wemis.in/api/payroll/generate-bulk/${bulkMonth}/${bulkYear}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBulkResult(res.data);
      console.log(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Error in bulk payroll");
      console.error(err);
    } finally {
      setBulkLoading(false);
    }
  };

  // Process Settlement
  const handleSettlement = async () => {
    setSettlementLoading(true);
    setError("");
    setSettlementResult(null);

    try {
      const res = await axios.post(
        `https://api.wemis.in/api/payroll/settlement`,
        {
          ...settlement,
          unusedLeaves: parseInt(settlement.unusedLeaves) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSettlementResult(res.data);
      console.log(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Settlement failed");
      console.error(err);
    } finally {
      setSettlementLoading(false);
    }
  };

  // Fetch My Payslips
  const fetchMyPayslips = async () => {
    setPayslipsLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://api.wemis.in/api/payroll/my-payslips`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayslips(res.data);
      console.log(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch payslips");
      console.error(err);
    } finally {
      setPayslipsLoading(false);
    }
  };

  // Fetch Employee History
  const fetchEmployeeHistory = async () => {
    if (!historyEmployeeId) {
      setError("Please enter Employee ID");
      return;
    }

    setHistoryLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://api.wemis.in/api/payroll/history/${historyEmployeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
      console.log(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch history");
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Download Payslip
  const downloadPayslip = async (id) => {
    try {
      const response = await axios.get(
        `https://api.wemis.in/api/payroll/download/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading payslip:", err);
      alert("Failed to download payslip");
    }
  };

  // Mark as Paid
  const markAsPaid = async (id) => {
    try {
      await axios.put(
        `https://api.wemis.in/api/payroll/pay/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Salary marked as paid successfully!");
      fetchEmployeeHistory(); // Refresh history
    } catch (err) {
      console.error(err);
      alert("Failed to mark salary as paid");
    }
  };

  const tabs = [
    { id: "single", label: "Single Payroll", icon: User },
    { id: "bulk", label: "Bulk Payroll", icon: Users },
    { id: "settlement", label: "Settlement", icon: FileText },
    { id: "mypayslips", label: "My Payslips", icon: Receipt },
    { id: "history", label: "Employee History", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/hr-dashboard")}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-black rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Payroll Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Home className="w-4 h-4" />
              <span>HR Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black font-medium">Payroll</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "mypayslips") fetchMyPayslips();
                    setError("");
                  }}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    transition-all duration-200 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {/* Single Payroll Tab */}
          {activeTab === "single" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Generate Single Payroll
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      placeholder="EMP001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="">Select Month</option>
                        {months.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        placeholder="2026"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={generatePayroll}
                    disabled={singleLoading}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {singleLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5" />
                        <span>Generate Payroll</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {singleResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payroll Generated
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-medium">{singleResult.employeeId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Period:</span>
                      <span className="font-medium">
                        {months.find(m => m.value === month)?.label} {year}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Basic Salary:</span>
                      <span className="font-medium">₹{singleResult.basicSalary?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Net Salary:</span>
                      <span className="font-bold text-lg text-green-600">₹{singleResult.netSalary?.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => downloadPayslip(singleResult.id)}
                      className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Payslip</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bulk Payroll Tab */}
          {activeTab === "bulk" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Generate Bulk Payroll
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={bulkMonth}
                        onChange={(e) => setBulkMonth(e.target.value)}
                      >
                        <option value="">Select Month</option>
                        {months.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        placeholder="2026"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={bulkYear}
                        onChange={(e) => setBulkYear(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-xs text-yellow-700">
                        This will generate payroll for ALL active employees. Please review before proceeding.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={generateBulk}
                    disabled={bulkLoading}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {bulkLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5" />
                        <span>Generate Bulk Payroll</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {bulkResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Success!</h2>
                  </div>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✓</div>
                    <p className="text-gray-700 font-medium">{bulkResult}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      All payroll records have been generated
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settlement Tab */}
          {activeTab === "settlement" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Full & Final Settlement
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      placeholder="EMP001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={settlement.employeeId}
                      onChange={(e) =>
                        setSettlement({ ...settlement, employeeId: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Working Day
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={settlement.lwd}
                      onChange={(e) =>
                        setSettlement({ ...settlement, lwd: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unused Leaves
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={settlement.unusedLeaves}
                      onChange={(e) =>
                        setSettlement({ ...settlement, unusedLeaves: e.target.value })
                      }
                    />
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settlement.noticeServed}
                      onChange={(e) =>
                        setSettlement({ ...settlement, noticeServed: e.target.checked })
                      }
                      className="w-4 h-4 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">Notice Period Served</span>
                  </label>

                  <button
                    onClick={handleSettlement}
                    disabled={settlementLoading}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {settlementLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-5 h-5" />
                        <span>Process Settlement</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {settlementResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Settlement Details
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-medium">{settlementResult.employeeId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Last Working Day:</span>
                      <span className="font-medium">{settlementResult.lwd}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Unused Leaves:</span>
                      <span className="font-medium">{settlementResult.unusedLeaves}</span>
                    </div>
                    {settlementResult.settlementAmount && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Settlement Amount:</span>
                        <span className="font-bold text-lg text-green-600">
                          ₹{settlementResult.settlementAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My Payslips Tab */}
          {activeTab === "mypayslips" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Receipt className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">My Payslips</h2>
                </div>
                <button
                  onClick={fetchMyPayslips}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Refresh
                </button>
              </div>

              {payslipsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : payslips.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payslips found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payslips.map((payslip, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {months.find(m => m.value === payslip.month)?.label} {payslip.year}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              payslip.paymentStatus === "PAID" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {payslip.paymentStatus || "PENDING"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Basic Salary</p>
                              <p className="font-medium">₹{payslip.basicSalary?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Net Salary</p>
                              <p className="font-bold text-green-600">₹{payslip.netSalary?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadPayslip(payslip.id)}
                          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Employee History Tab */}
          {activeTab === "history" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Employee Payroll History</h2>
              </div>

              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  value={historyEmployeeId}
                  onChange={(e) => setHistoryEmployeeId(e.target.value)}
                />
                <button
                  onClick={fetchEmployeeHistory}
                  disabled={historyLoading}
                  className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {historyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                </button>
              </div>

              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((record, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-semibold">
                              {months.find(m => m.value === record.month)?.label} {record.year}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              record.paymentStatus === "PAID" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {record.paymentStatus || "PENDING"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Basic Salary</p>
                              <p className="text-sm font-medium">₹{record.basicSalary?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Allowances</p>
                              <p className="text-sm text-green-600">+₹{record.totalAllowances?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Deductions</p>
                              <p className="text-sm text-red-600">-₹{record.totalDeductions?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Net Salary</p>
                              <p className="text-sm font-bold">₹{record.netSalary?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => downloadPayslip(record.id)}
                            className="text-sm text-gray-600 hover:text-black flex items-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span>PDF</span>
                          </button>
                          {record.paymentStatus !== "PAID" && (
                            <button
                              onClick={() => markAsPaid(record.id)}
                              className="text-sm text-green-600 hover:text-green-700"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyEmployeeId && !historyLoading && (
                <div className="text-center py-8 text-gray-500">
                  No payroll records found for this employee
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HRPayroll;