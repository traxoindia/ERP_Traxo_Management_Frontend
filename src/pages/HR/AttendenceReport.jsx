import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar,
  Search,
  Download,
  RefreshCw,
  FileText,
  User,
  Filter,
  ChevronRight,
  Printer,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TraxoLogo from "../../images/logo.png";
import SearchableSelect from "./SearchableSelect";

// --- STYLED HEADER FOR PDF ---
const DocumentHeader = ({ logoSrc = TraxoLogo }) => (
  <div className="w-full bg-white font-serif">
    <div className="grid grid-cols-12 border-[1px] border-black text-black">
      <div className="col-span-2 border-r-[1px] border-black p-3 flex items-center justify-center">
        <img src={logoSrc} alt="Logo" className="h-12 w-auto object-contain" />
      </div>
      <div className="col-span-7 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b-[1px] border-black px-4">
          <h1 className="text-lg font-medium uppercase ">HR ATTENDENCE</h1>
        </div>
        <div className="h-12 flex items-center justify-center">
          <p className="text-lg font-medium uppercase">Doc.No.HR/TIAPL/01</p>
        </div>
      </div>
      <div className="col-span-2 border-l-[1px] border-black p-5 flex flex-col justify-center text-[13px] font-semibold leading-relaxed">
        <div className="grid grid-cols-1">
          <div className="grid grid-cols-2">
            <span>Issue:</span>
            <span>1</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Rev:</span>
            <span className="-translate-x-[9px]">0</span>
          </div>

          <div className="grid grid-cols-2">
            <span>Date:</span>
            <span>04.02.2026</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AttendenceReport = ({}) => {
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

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";

    // Force UTC by adding 'Z' if missing
    const utcString = isoString.endsWith("Z") ? isoString : isoString + "Z";

    const date = new Date(utcString);

    return date
      .toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          "https://api.wemis.in/api/hr/employees/names",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const result = await response.json();
        if (response.ok) setEmployeeList(result);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchEmployees();
  }, []);

  const fetchReportData = useCallback(async () => {
    if (!filters.employeeId) {
      showNotification("Please select an employee", "error");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const url = `https://api.wemis.in/api/hr/reports/attendance/${filters.employeeId}?year=${filters.year}&month=${filters.month}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setData(Array.isArray(result) ? result : result.data || []);
        showNotification("Data synchronized successfully");
      }
    } catch (error) {
      showNotification("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleDownloadPDF = async () => {
    if (data.length === 0)
      return showNotification("Nothing to download", "error");
    setLoading(true);
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      (canvas.height * pdfWidth) / canvas.width,
    );
    pdf.save(`ATTENDANCE_${filters.employeeId}_${filters.month}.pdf`);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 animate-bounce ${notification.type === "success" ? "bg-indigo-600" : "bg-rose-600"}`}
        >
          {notification.type === "success" ? (
            <FileText size={18} />
          ) : (
            <RefreshCw size={18} />
          )}
          {notification.message}
        </div>
      )}

      {/* Modern Sidebar Filters */}
      <aside className="w-96 bg-white border-r border-slate-200 p-8 flex flex-col gap-8 shadow-sm no-print">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-indigo-600 mb-1">
            Reports
          </h2>
          <p className="text-slate-400 text-sm">
            Generate and export HR records
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <User size={12} /> Employee Name
            </label>
            <SearchableSelect
              placeholder="Select Resource"
              value={filters.employeeId}
              onChange={(val) => setFilters({ ...filters, employeeId: val })}
              options={employeeList.map((emp) => ({
                value: emp.employeeId,
                label: `${emp.fullName} (${emp.employeeId})`,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Month
              </label>
              <select
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-semibold focus:border-indigo-500 outline-none"
                value={filters.month}
                onChange={(e) =>
                  setFilters({ ...filters, month: e.target.value })
                }
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option
                    key={i + 1}
                    value={(i + 1).toString().padStart(2, "0")}
                  >
                    {new Date(0, i).toLocaleString("en", { month: "short" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Year
              </label>
              <select
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-semibold focus:border-indigo-500 outline-none"
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchReportData}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-100"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Processing..." : "Sync Records"}
          </button>
        </div>

        <div className="mt-auto border-t pt-6">
          <button
            onClick={handleDownloadPDF}
            className="w-full group bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <Download
              size={18}
              className="group-hover:-translate-y-1 transition-transform"
            />
            Export to PDF
          </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50 scroll-smooth">
        {/* Document Container */}
        <div
          ref={pdfRef}
          className="bg-white mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-[210mm] min-h-[297mm] p-12 relative overflow-hidden"
        >
          {/* Subtle Watermark for web view */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-45">
            <h1 className="text-[150px] font-black">TRAXO</h1>
          </div>

          <DocumentHeader />

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-8 border-b-4 border-slate-900 pb-4">
              <div>
                <p className="text-[10px] font-black text-black mt-5 uppercase tracking-widest mb-1">
                  Employee Details
                </p>
                <h3 className="text-xl font-medium text-slate-900 uppercase ">
                  {employeeList.find((e) => e.employeeId === filters.employeeId)
                    ?.fullName || "Select Employee"}
                  {employeeList.find(
                    (e) => e.employeeId === filters.employeeId,
                  ) &&
                    ` (${employeeList.find((e) => e.employeeId === filters.employeeId)?.employeeId})`}
                </h3>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-center text-xs font-black uppercase w-12 border border-slate-900">
                    #
                  </th>
                  <th className="p-3 text-left text-xs font-black uppercase border border-slate-900">
                    Date
                  </th>
                  <th className="p-3 text-center text-xs font-black uppercase border border-slate-900">
                    Shift In
                  </th>
                  <th className="p-3 text-center text-xs font-black uppercase border border-slate-900">
                    Shift Out
                  </th>
                  <th className="p-3 text-center text-xs font-black uppercase border border-slate-900">
                    Net Hours
                  </th>
                  <th className="p-3 text-center text-xs font-black uppercase border border-slate-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {data.length > 0 ? (
                  data.map((row, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="border border-slate-200 p-3 text-center font-mono text-xs text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-200 p-3 font-bold text-sm">
                        {row.date}
                      </td>
                      <td className="border border-slate-200 p-3 text-center font-mono text-sm">
                        {formatTime(row.checkIn)}
                      </td>
                      <td className="border border-slate-200 p-3 text-center font-mono text-sm">
                        {formatTime(row.checkOut)}
                      </td>
                      <td className="border border-slate-200 p-3 text-center font-black text-sm">
                        <span
                          className={
                            row.workingHours >= 8
                              ? "text-indigo-600"
                              : "text-slate-600"
                          }
                        >
                          {row.workingHours || "0"} Hrs
                        </span>
                      </td>
                      <td className="border border-slate-200 p-3 text-center">
                        <span
                          className={`text-[10px] font-black px-3 py-1 rounded-full border-2 ${
                            row.status === "PRESENT"
                              ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                              : "border-rose-500 text-rose-600 bg-rose-50"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <Calendar size={64} strokeWidth={1} />
                        <p className="font-bold uppercase tracking-widest italic">
                          Waiting for synchronization...
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Verification Footer */}
            <div className="mt-72 grid grid-cols-2 gap-20">
              <div className="text-center">
                <div className="h-16 border-b-2 border-slate-900 flex items-end justify-center pb-2 italic text-slate-400 text-sm font-serif"></div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                  Human Resources Department
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 border-b-2 border-slate-900"></div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                  Authorized Director Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendenceReport;
