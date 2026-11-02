"use client";
export default function FeeTypeSummaryTable({ data = [] }) {
  if (!data.length) return <div className="h-[300px] flex items-center justify-center text-gray-500">No summary data</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm h-[390px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-navy text-lg flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center text-sm">💰</span>
          Fee Collection Summary
        </h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none"><option>This Month</option></select>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
          <tr>
            <th className="px-4 py-3 font-medium rounded-l-lg">Fee Type</th>
            <th className="px-4 py-3 font-medium text-right">Amount (Rs.)</th>
            <th className="px-4 py-3 font-medium text-center">Collection</th>
            <th className="px-4 py-3 font-medium text-right rounded-r-lg">Pending</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3 font-medium text-navy">{row.type}</td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-600">{row.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium w-8 text-right">{row.collected}%</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-brand" style={{ width: `${row.collected}%` }} /></div>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-medium text-orange-500">{100 - row.collected}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}