import React, { useState, useEffect, useCallback, useRef } from "react";
import { BarChart3, Download, RefreshCw, FileText, User } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TraxoLogo from "../../images/logo.png";
import SearchableSelect from "./SearchableSelect";

const DocumentHeader = ({ logoSrc = TraxoLogo, title = "LEAVE REPORT", docNo = "HR/TIAPL/LEV/01" }) => (
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

const LeaveReport = () => {
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
      } catch (error) { console.error(error); }
    };
    fetchEmployees();
  }, []);

  const fetchReportData = useCallback(async () => {
    if (!filters.employeeId) return showNotification("Please select an employee", "error");
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const url = `https://api.wemis.in/api/hr/reports/leave/${filters.employeeId}?year=${filters.year}&month=${filters.month}`;

    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (response.ok) {
        setData(Array.isArray(result) ? result : result.data || []);
        showNotification("Leave history fetched");
      }
    } catch (error) { showNotification("Network error", "error"); } finally { setLoading(false); }
  }, [filters]);

  const handleDownloadPDF = async () => {
    if (data.length === 0) return showNotification("Nothing to download", "error");
    setLoading(true);
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`LEAVE_${filters.employeeId}.pdf`);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold bg-indigo-600 animate-bounce`}>
          <FileText size={18} /> {notification.message}
        </div>
      )}

      <aside className="w-96 bg-white border-r p-8 flex flex-col gap-8 no-print">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-indigo-600">Leave Report</h2>
          <p className="text-slate-400 text-sm">Absence & Entitlement</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500"><User size={12} /> Employee</label>
            <SearchableSelect
              placeholder="Select Resource"
              value={filters.employeeId}
              onChange={(val) => setFilters({ ...filters, employeeId: val })}
              options={employeeList.map((emp) => ({ value: emp.employeeId, label: emp.fullName }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="bg-slate-50 border-2 rounded-xl p-3 text-sm font-semibold" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
                {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>{new Date(0, i).toLocaleString("en", { month: "short" })}</option>))}
            </select>
            <select className="bg-slate-50 border-2 rounded-xl p-3 text-sm font-semibold" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                <option value="2025">2025</option><option value="2026">2026</option>
            </select>
          </div>

          <button onClick={fetchReportData} disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Data
          </button>
        </div>

        <div className="mt-auto pt-6 border-t">
          <button onClick={handleDownloadPDF} className="w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-bold flex justify-center gap-3">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-slate-50">
        <div ref={pdfRef} className="bg-white mx-auto shadow-2xl w-[210mm] min-h-[297mm] p-12">
          <DocumentHeader title="LEAVE REPORT" docNo="HR/TIAPL/LEV/01" />
          <div className="mt-8">
            <div className="mb-8 border-b-2 border-black pb-2 flex justify-between">
              <h3 className="text-lg font-bold uppercase">{employeeList.find(e => e.employeeId === filters.employeeId)?.fullName || "Employee Summary"}</h3>
              <p className="text-xs font-black">Period: {filters.month}/{filters.year}</p>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-black text-[10px] font-black uppercase">
                  <th className="p-2 border border-black">Type</th>
                  <th className="p-2 border border-black">From</th>
                  <th className="p-2 border border-black">To</th>
                  <th className="p-2 border border-black">Days</th>
                  <th className="p-2 border border-black">Status</th>
                  <th className="p-2 border border-black">Reason</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {data.length > 0 ? data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border font-bold">{row.leaveType}</td>
                    <td className="p-2 border">{row.startDate}</td>
                    <td className="p-2 border">{row.endDate}</td>
                    <td className="p-2 border text-center">{row.days}</td>
                    <td className="p-2 border text-center">
                        <span className={`px-2 py-0.5 rounded border ${row.status === 'APPROVED' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-amber-50 border-amber-500 text-amber-700'}`}>
                            {row.status}
                        </span>
                    </td>
                    <td className="p-2 border italic">{row.reason}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="py-20 text-center opacity-30 italic">No leave data recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveReport;