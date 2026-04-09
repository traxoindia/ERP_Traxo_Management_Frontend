import React, { useState, useEffect, useCallback, useRef } from "react";
import { Wallet, Download, RefreshCw, FileText, User } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TraxoLogo from "../../images/logo.png";
import SearchableSelect from "./SearchableSelect";

const DocumentHeader = ({ logoSrc = TraxoLogo, title = "PAYROLL REPORT", docNo = "HR/TIAPL/PAY/01" }) => (
  <div className="w-full bg-white font-serif">
    <div className="grid grid-cols-12 border-[1px] border-black text-black">
      <div className="col-span-2 border-r-[1px] border-black p-3 flex items-center justify-center">
        <img src={logoSrc} alt="Logo" className="h-12 w-auto object-contain" />
      </div>
      <div className="col-span-7 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b-[1px] border-black px-4">
          <h1 className="text-lg font-medium uppercase ">{title}</h1>
        </div>
        <div className="h-12 flex items-center justify-center">
          <p className="text-lg font-medium uppercase">Doc.No.{docNo}</p>
        </div>
      </div>
      <div className="col-span-3 border-l-[1px] border-black p-5 flex flex-col justify-center text-[13px] font-semibold leading-relaxed">
        <div className="grid grid-cols-2"><span>Issue:</span><span>1</span></div>
        <div className="grid grid-cols-2"><span>Rev:</span><span>0</span></div>
        <div className="grid grid-cols-2"><span>Date:</span><span>04.02.2026</span></div>
      </div>
    </div>
  </div>
);

const PayrollReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [notification, setNotification] = useState(null);
  const pdfRef = useRef();

  const [filters, setFilters] = useState({
    employeeId: "",
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("https://api.wemis.in/api/hr/employees/names", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok) setEmployeeList(result);
      } catch (error) { console.error("Error fetching employees", error); }
    };
    fetchEmployees();
  }, []);

  const fetchReportData = useCallback(async () => {
    if (!filters.employeeId) return showNotification("Please select an employee", "error");
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const url = `https://api.wemis.in/api/hr/reports/payroll/${filters.employeeId}?year=${filters.year}&month=${filters.month}`;

    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (response.ok) {
        setData(Array.isArray(result) ? result : result.data || []);
        showNotification("Payroll data synchronized");
      }
    } catch (error) { showNotification("Network error", "error"); } finally { setLoading(false); }
  }, [filters]);

  const handleDownloadPDF = async () => {
    if (data.length === 0) return showNotification("Nothing to download", "error");
    setLoading(true);
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
    pdf.save(`PAYROLL_${filters.employeeId}_${filters.month}.pdf`);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 animate-bounce ${notification.type === "success" ? "bg-indigo-600" : "bg-rose-600"}`}>
          <FileText size={18} /> {notification.message}
        </div>
      )}

      <aside className="w-96 bg-white border-r border-slate-200 p-8 flex flex-col gap-8 shadow-sm no-print">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-indigo-600 mb-1">Payroll</h2>
          <p className="text-slate-400 text-sm italic">Compensation analysis</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><User size={12} /> Employee</label>
            <SearchableSelect
              placeholder="Select Resource"
              value={filters.employeeId}
              onChange={(val) => setFilters({ ...filters, employeeId: val })}
              options={employeeList.map((emp) => ({ value: emp.employeeId, label: `${emp.fullName} (${emp.employeeId})` }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Month</label>
              <select className="w-full bg-slate-50 border-2 rounded-xl p-3 text-sm font-semibold" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
                {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>{new Date(0, i).toLocaleString("en", { month: "short" })}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Year</label>
              <select className="w-full bg-slate-50 border-2 rounded-xl p-3 text-sm font-semibold" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                <option value="2025">2025</option><option value="2026">2026</option>
              </select>
            </div>
          </div>

          <button onClick={fetchReportData} disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> {loading ? "Processing..." : "Sync Payroll"}
          </button>
        </div>

        <div className="mt-auto border-t pt-6">
          <button onClick={handleDownloadPDF} className="w-full group bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white transition-all">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-slate-50">
        <div ref={pdfRef} className="bg-white mx-auto shadow-2xl w-[210mm] min-h-[297mm] p-12 relative">
          <DocumentHeader title="PAYROLL REPORT" docNo="HR/TIAPL/PAY/01" />
          <div className="mt-8 relative z-10">
            <div className="mb-8 border-b-4 border-slate-900 pb-4">
              <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Employee Details</p>
              <h3 className="text-xl font-medium text-slate-900 uppercase">
                {employeeList.find((e) => e.employeeId === filters.employeeId)?.fullName || "N/A"} ({filters.employeeId})
              </h3>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-left text-xs font-black border border-black">DESCRIPTION</th>
                  <th className="p-3 text-right text-xs font-black border border-black">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {data.length > 0 ? data.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <tr><td className="border p-3">Base Salary</td><td className="border p-3 text-right font-mono">₹{row.baseSalary}</td></tr>
                    <tr><td className="border p-3 text-green-600">Total Allowances</td><td className="border p-3 text-right font-mono text-green-600">+ ₹{row.allowances}</td></tr>
                    <tr><td className="border p-3 text-rose-600">Total Deductions</td><td className="border p-3 text-right font-mono text-rose-600">- ₹{row.deductions}</td></tr>
                    <tr className="bg-slate-100 font-black"><td className="border p-3">NET PAYABLE ({row.month})</td><td className="border p-3 text-right text-lg">₹{row.netPay}</td></tr>
                  </React.Fragment>
                )) : (
                  <tr><td colSpan="2" className="py-20 text-center opacity-30 italic">No records found</td></tr>
                )}
              </tbody>
            </table>

            <div className="mt-40 grid grid-cols-2 gap-20">
              <div className="text-center"><div className="border-b-2 border-black h-12"></div><p className="mt-2 text-[10px] font-black uppercase">Prepared By (Finance)</p></div>
              <div className="text-center"><div className="border-b-2 border-black h-12"></div><p className="mt-2 text-[10px] font-black uppercase">Authorized Signatory</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PayrollReport;