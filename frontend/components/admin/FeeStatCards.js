"use client";

import { formatCurrency } from "@/utils/formatCurrency";

const TONE = {
  green: "bg-green-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
};

export default function FeeStatCards({ data }) {
  // If backend gives real data, use it. Otherwise use mock.
  const cards = Array.isArray(data) ? data : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <article
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4"
        >
          <div className={`${TONE[card.tone] || "bg-blue-500"} w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shrink-0`}>
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500">
              {card.label}
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {card.isCount ? card.value : formatCurrency(card.value)}
            </div>
            {card.trend && (
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className={card.trend.direction === "up" ? "text-green-600" : "text-red-600"}>
                  {card.trend.direction === "up" ? "↑" : "↓"} {card.trend.value}%
                </span>
                <span className="text-gray-400">{card.trend.label}</span>
              </div>
            )}
            {card.sublabel && (
              <div className="text-xs text-gray-400 mt-1">{card.sublabel}</div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}