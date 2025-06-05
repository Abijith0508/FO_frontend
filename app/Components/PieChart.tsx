'use client';

import { glass, grayText } from "../styling";
import {
  PieChart as RePieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";


type DataItem = {
  name: string;
  value: number;
};

type Props = {
  data: DataItem[];
};

const COLORS = [
  "#E0B073", // base
  "#D29E5D", // slightly darker
  "#C48D48", // more contrast
  "#B57B32", // deeper shade
  "#A76A1D", // near-brown
  "#996908", // darkest usable
  "#F1C88F", // lighter
  "#F5D5A7", // very light
  "#FAE2BF", // pastel gold
  "#FFF0D7", // pale highlight
];


type TooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
  data: DataItem[];
};


const CustomTooltip = ({ active, payload, data }: TooltipProps) => {
  if (active && payload && payload.length > 0) {
    const { name, value } = payload[0];
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const percent = ((value / total) * 100).toFixed(1); // 1 decimal place

    return (
      <div className="bg-[#E0B073] text-white text-sm p-2 rounded shadow-lg">
        <div className="font-extralight">{name}</div>
        <div>{value} ({percent}%)</div>
      </div>
    );
  }

  return null;
};


const PChart = ({ data }: Props) => {
  return (
    <div className={`w-full h-full p-4 rounded-lg`}>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart  className = 'flex '>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            // innerRadius={60}
            outerRadius={100}
            // label
          >
            {data.map((entry, index) => (
              <Cell stroke="none" fill={COLORS[index % COLORS.length]} className=''/>
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip data={data}/>} />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PChart;