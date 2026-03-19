"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, ComposedChart, Line
} from "recharts";

const data = [
  { month: "Oct", income: 45000, expenses: 32000 },
  { month: "Nov", income: 52000, expenses: 38000 },
  { month: "Dec", income: 48000, expenses: 41000 },
  { month: "Jan", income: 61000, expenses: 35000 },
  { month: "Feb", income: 55000, expenses: 42000 },
  { month: "Mar", income: 67000, expenses: 39000 },
];

export function RevenueChart() {
  return (
    <div className="h-[350px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white">Cash Flow Analysis</h3>
        <p className="text-sm text-slate-500">6-month revenue vs. operational costs</p>
      </div>
      
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="expenses" fill="url(#colorExpense)" stroke="#f43f5e" strokeWidth={2} />
          <Bar dataKey="income" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}