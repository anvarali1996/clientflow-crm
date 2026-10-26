"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = {
  day: string;
  customers: number;
};

type Props = {
  data: ChartPoint[];
};

export default function CustomersChart({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Customer Growth
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          New customers in the last 7 days
        </p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="customers"
              name="New Customers"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}