"use client";
export default function PaymentHistoryCard({ payments = [] }) {
  if (!payments.length) return <div className="text-gray-500">No recent payments.</div>;
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50"><h3 className="font-semibold text-navy">Recent Payments</h3></div>
      <div className="divide-y divide-gray-100">
        {payments.map((p, i) => (
          <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition">
            <div>
              <p className="font-medium text-navy">{p.studentName}</p>
              <p className="text-xs text-gray-500">{p.month} • {p.method}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">Rs. {p.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{p.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}