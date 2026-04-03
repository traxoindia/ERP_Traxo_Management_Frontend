import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download, Calendar, Wallet, CheckCircle, AlertCircle, FileText, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyPayslips = () => {
  const navigate = useNavigate();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const token = localStorage.getItem("accessToken");
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      const res = await axios.get("https://api.wemis.in/api/payroll/my-payslips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayslips(res.data);
    } catch (err) {
      console.error("Error fetching slips:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(
        `https://api.wemis.in/api/payroll/download/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
  };

  // Filter payslips based on active tab
  const filteredPayslips = payslips.filter(p => {
    if (activeTab === "all") return true;
    if (activeTab === "paid") return p.paymentStatus === "PAID";
    if (activeTab === "pending") return p.paymentStatus !== "PAID";
    return true;
  });

  // Calculate summary statistics
  const totalEarnings = payslips.reduce((sum, p) => sum + p.netSalary, 0);
  const averageSalary = payslips.length > 0 ? totalEarnings / payslips.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/employee-dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payslips</h1>
                <p className="text-xs text-gray-500">Employee ID: {employeeId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Cards */}
        {!loading && payslips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Payslips</p>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{payslips.length}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <Wallet className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Average Monthly</p>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(averageSalary).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "all", label: "All Payslips", count: payslips.length },
                { id: "paid", label: "Paid", count: payslips.filter(p => p.paymentStatus === "PAID").length },
                { id: "pending", label: "Pending", count: payslips.filter(p => p.paymentStatus !== "PAID").length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-3 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Payslips List */}
            {filteredPayslips.length > 0 ? (
              <div className="space-y-4">
                {filteredPayslips.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getMonthName(p.month)} {p.year}
                          </h3>
                          <p className="text-xs text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        p.paymentStatus === "PAID" 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-orange-50 text-orange-700 border border-orange-200"
                      }`}>
                        {p.paymentStatus === "PAID" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {p.paymentStatus}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Gross Earned</p>
                          <p className="text-lg font-semibold text-gray-900">₹{p.grossEarned.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Total Deductions</p>
                          <p className="text-lg font-semibold text-red-600">₹{(p.pfDeduction + p.taxDeduction).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Attendance</p>
                          <p className="text-lg font-semibold text-gray-900">{p.presentDays}/{p.totalDaysInMonth} days</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                          <p className="text-xs text-blue-600 uppercase mb-1 font-medium">Net Payable</p>
                          <p className="text-2xl font-bold text-blue-700">₹{p.netSalary.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                        <span>Basic: <strong className="text-gray-900">₹{p.basicPay.toLocaleString()}</strong></span>
                        <span>HRA: <strong className="text-gray-900">₹{p.hra.toLocaleString()}</strong></span>
                        {p.pfDeduction > 0 && <span>PF: <strong className="text-gray-900">₹{p.pfDeduction.toLocaleString()}</strong></span>}
                        {p.taxDeduction > 0 && <span>Tax: <strong className="text-gray-900">₹{p.taxDeduction.toLocaleString()}</strong></span>}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => downloadPayslip(p.id)}
                          className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-blue-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === "all" ? "No Payslips Found" : `No ${activeTab} Payslips`}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "all" 
                    ? "Your monthly salary statements will appear here once generated."
                    : `You don't have any ${activeTab} payslips at the moment.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPayslips;