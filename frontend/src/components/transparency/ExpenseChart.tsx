import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PieChart as PieIcon } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ExpenseChartProps {
  categoryData?: Record<string, number>;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ categoryData = {} }) => {
  const categories = Object.keys(categoryData).filter((cat) => (categoryData[cat] || 0) > 0);
  const values = categories.map((cat) => categoryData[cat]);

  const hasData = categories.length > 0;

  const pieChartData = {
    labels: categories.map((l) => l.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Expense Amount (₹)',
        data: values,
        backgroundColor: [
          '#ff6b00',
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4',
          '#84cc16',
          '#e11d48',
          '#6366f1',
          '#14b8a6',
          '#64748b',
        ],
        borderWidth: 2,
        borderColor: '#0f172a',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          font: { family: 'Plus Jakarta Sans', size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ₹${context.parsed.toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <h4 className="text-lg font-bold text-white mb-4">Expense Distribution Breakdown</h4>
      {hasData ? (
        <div className="w-full max-w-md mx-auto aspect-square flex items-center justify-center">
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400">
            <PieIcon className="w-8 h-8 text-orange-400/60" />
          </div>
          <p className="text-sm font-extrabold text-slate-300">No expenses recorded yet.</p>
          <p className="text-xs text-slate-500 max-w-xs">
            Expense breakdown chart will dynamically populate here as verified vendor bills are logged by committee members.
          </p>
        </div>
      )}
    </div>
  );
};
