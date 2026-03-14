import React from "react";
import { Users, UserCheck, Clock, MoreHorizontal, Plus } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white border rounded-lg p-5 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
    </div>
    <Icon size={24} className="text-gray-600" />
  </div>
);

const HrDashboard = () => {
  const employees = [
    { name: "Ankit Duhai", dept: "Product Design", status: "Active", img: "https://i.pravatar.cc/150?u=1" },
    { name: "Rahul Sharma", dept: "Engineering", status: "Pending", img: "https://i.pravatar.cc/150?u=2" },
    { name: "Priya Singh", dept: "Marketing", status: "Active", img: "https://i.pravatar.cc/150?u=3" },
    { name: "Sanya Verma", dept: "Operations", status: "Active", img: "https://i.pravatar.cc/150?u=4" },
  ];

  const events = [
    { title: "Holi Festival", date: "Mar 14", desc: "Public Holiday" },
    { title: "Quarterly Review", date: "Mar 18", desc: "All Hands Meeting" },
    { title: "Ramadan Start", date: "Mar 20", desc: "Optional Half-day" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">HR Dashboard</h1>
              <p className="text-gray-500 text-sm">Overview for March 2026</p>
            </div>

            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm">
              <Plus size={16} />
              Add Employee
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Staff" value="0" icon={Users} />
            <StatCard title="On Duty" value="0" icon={UserCheck} />
            <StatCard title="Leave Requests" value="0" icon={Clock} />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Employee Table */}
            <div className="lg:col-span-2 bg-white border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-medium">Recent Employees</h3>
              </div>

              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="p-4 text-left">Employee</th>
                    <th className="p-4 text-left">Department</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={i} className="border-b last:border-none">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={emp.img}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        {emp.name}
                      </td>

                      <td className="p-4 text-gray-600">{emp.dept}</td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            emp.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <MoreHorizontal size={18} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Events */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium mb-4">Upcoming Events</h3>

              <div className="space-y-4">
                {events.map((event, i) => (
                  <div key={i}>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                    <p className="text-xs text-gray-400">{event.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default HrDashboard;