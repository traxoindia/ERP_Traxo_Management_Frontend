import React, { useState, useCallback, useRef } from "react";
import { UserPlus, Download, RefreshCw, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TraxoLogo from "../../images/logo.png";

const DocumentHeader = ({ logoSrc = TraxoLogo, title = "NEW HIRE REPORT", docNo = "HR/TIAPL/HIR/01" }) => (
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

const HiringReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(null);
  const pdfRef = useRef();

  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const url = `https://api.wemis.in/api/hr/reports/new-hire?year=${filters.year}&month=${filters.month}`;

    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (response.ok) {
        setData(Array.isArray(result) ? result : result.data || []);
        showNotification("Recruitment records updated");
      }
    } catch (error) { showNotification("Error", "error"); } finally { setLoading(false); }
  }, [filters]);

  const handleDownloadPDF = async () => {
    if (data.length === 0) return showNotification("No data", "error");
    setLoading(true);
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`NEW_HIRE_${filters.month}_${filters.year}.pdf`);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-96 bg-white border-r p-8 flex flex-col gap-8 no-print">
        <h2 className="text-2xl font-black text-indigo-600">Hiring Report</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Select Joining Window</label>
            <select className="bg-slate-50 border-2 rounded-xl p-3 font-semibold" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
                {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>))}
            </select>
            <select className="bg-slate-50 border-2 rounded-xl p-3 font-semibold" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                <option value="2025">2025</option><option value="2026">2026</option>
            </select>
          </div>
          <button onClick={fetchReportData} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center gap-3">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Fetch New Hires
          </button>
        </div>
        <button onClick={handleDownloadPDF} className="mt-auto w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-bold flex justify-center gap-3">
          <Download size={18} /> Download List
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-12">
        <div ref={pdfRef} className="bg-white mx-auto shadow-2xl w-[210mm] p-12">
          <DocumentHeader title="NEW HIRE REPORT" docNo="HR/TIAPL/HIR/01" />
          <div className="mt-8">
            <div className="border-b-4 border-black mb-6 flex justify-between items-end">
                <h3 className="text-lg font-bold pb-2">Joining Log - {new Date(0, parseInt(filters.month)-1).toLocaleString('en', {month: 'long'})} {filters.year}</h3>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-900 text-white uppercase">
                <tr>
                  <th className="p-2 border border-black">Emp ID</th>
                  <th className="p-2 border border-black text-left">Name</th>
                  <th className="p-2 border border-black text-left">Dept</th>
                  <th className="p-2 border border-black text-left">Designation</th>
                  <th className="p-2 border border-black">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border text-center font-mono">{row.employeeId}</td>
                    <td className="p-2 border font-bold uppercase">{row.fullName}</td>
                    <td className="p-2 border uppercase">{row.department}</td>
                    <td className="p-2 border uppercase">{row.designation}</td>
                    <td className="p-2 border text-center">{row.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HiringReport;