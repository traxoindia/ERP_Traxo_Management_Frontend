import React, { useState, useCallback, useRef } from "react";
import { Users, Download, RefreshCw, Search } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TraxoLogo from "../../images/logo.png";

const DocumentHeader = ({ logoSrc = TraxoLogo, title = "STAFF DIRECTORY", docNo = "HR/TIAPL/SUM/01" }) => (
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

const EmployeeSummary = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(null);
  const pdfRef = useRef();

  const [filters, setFilters] = useState({ employeeName: "" });

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const url = `https://api.wemis.in/api/hr/reports/employee-summary?employeeName=${filters.employeeName}`;

    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (response.ok) setData(Array.isArray(result) ? result : result.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [filters]);

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`STAFF_DIRECTORY.pdf`);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-96 bg-white border-r p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-black text-indigo-600 flex items-center gap-2"><Users size={24} /> Staff Info</h2>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl"
              value={filters.employeeName}
              onChange={(e) => setFilters({ employeeName: e.target.value })}
            />
          </div>
          <button onClick={fetchReportData} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center gap-2">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Search Directory
          </button>
        </div>
        <button onClick={handleDownloadPDF} className="mt-auto w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-bold flex justify-center gap-2">
          <Download size={18} /> Export Directory
        </button>
      </aside>

      <main className="flex-1 p-12 overflow-auto">
        <div ref={pdfRef} className="bg-white mx-auto shadow-2xl w-[210mm] p-12">
          <DocumentHeader title="EMPLOYEE SUMMARY DIRECTORY" docNo="HR/TIAPL/SUM/01" />
          <div className="mt-8">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase">
                  <th className="p-2 border border-black">ID</th>
                  <th className="p-2 border border-black text-left">Name</th>
                  <th className="p-2 border border-black text-left">Department</th>
                  <th className="p-2 border border-black text-left">Designation</th>
                  <th className="p-2 border border-black text-left">Email</th>
                  <th className="p-2 border border-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 border text-center font-mono">{row.employeeId}</td>
                    <td className="p-2 border font-bold uppercase">{row.fullName}</td>
                    <td className="p-2 border uppercase">{row.department}</td>
                    <td className="p-2 border uppercase">{row.designation}</td>
                    <td className="p-2 border lowercase">{row.email}</td>
                    <td className="p-2 border text-center font-black">{row.status}</td>
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

export default EmployeeSummary;