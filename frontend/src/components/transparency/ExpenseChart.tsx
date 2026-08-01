import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ExpenseChartProps {
  categoryData: Record<string, number>;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ categoryData }) => {
  const labels = Object.keys(categoryData).length > 0
    ? Object.keys(categoryData)
    : ['DECORATION', 'PRASADAM', 'LIGHTING', 'SOUND', 'STAGE', 'PERMITS'];

  const values = Object.keys(categoryData).length > 0
    ? Object.values(categoryData)
    : [450000, 680000, 220000, 180000, 310000, 50000];

  const pieChartData = {
    labels: labels.map((l) => l.replace('_', ' ')),
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
      <div className="w-full max-w-md mx-auto aspect-square flex items-center justify-center">
        <Pie data={pieChartData} options={chartOptions} />
      </div>
    </div>
  );
};
