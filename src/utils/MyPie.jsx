import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF69B4"];

const MyPie = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="profit"
          nameKey="name"
          cx="50%" // Position the chart to the left
          cy="50%"
          innerRadius={60} 
          outerRadius={120}
          fill="#8884d8"
          labelLine={false} // Remove the lines pointing to the chart
          label={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle"/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default MyPie