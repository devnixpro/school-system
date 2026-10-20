"use client";

export default function SuperAdminDashboard() {
  const stats = [
    { label: "Total Schools", value: "248", change: "+12%" },
    { label: "Active Subscriptions", value: "186", change: "+8%" },
    { label: "Total Revenue", value: "Rs. 4.2M", change: "+23%" },
    { label: "Pending Requests", value: "14", change: "-5%" },
  ];

  const recentSchools = [
    { name: "Lahore Model School", plan: "Premium", status: "Active", date: "2 mins ago" },
    { name: "Karachi Academy", plan: "Standard", status: "Active", date: "1 hour ago" },
    { name: "Islamabad Grammar", plan: "Premium", status: "Pending", date: "3 hours ago" },
    { name: "Punjab Public School", plan: "Basic", status: "Active", date: "5 hours ago" },
    { name: "Sindh Model High", plan: "Standard", status: "Expired", date: "1 day ago" },
  ];

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Expired") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome back, Super Admin! 👋</h1>
        <p className="text-blue-100 mt-2">
          Here's what's happening with your platform today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith("+")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Recently Registered Schools
          </h2>
          <button className="text-sm text-blue-600 hover:underline font-medium">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  School Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Plan
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSchools.map((school, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {school.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {school.plan}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                        school.status
                      )}`}
                    >
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {school.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition">
          <div className="text-3xl mb-3">🏫</div>
          <h3 className="font-semibold text-gray-800">Add New School</h3>
          <p className="text-sm text-gray-500 mt-1">
            Register a new school to the platform
          </p>
        </button>

        <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition">
          <div className="text-3xl mb-3">💳</div>
          <h3 className="font-semibold text-gray-800">Manage Subscriptions</h3>
          <p className="text-sm text-gray-500 mt-1">
            View and update subscription plans
          </p>
        </button>

        <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="font-semibold text-gray-800">View Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">
            Check platform performance reports
          </p>
        </button>
      </div>
    </div>
  );
}