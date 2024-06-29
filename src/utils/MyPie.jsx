import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "@mui/material";

const COLORS = [
  "#00caff",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF69B4",
];

const MyPie = ({ data }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="profit"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={"40%"}
          outerRadius={"90%"}
          fill="#8884d8"
          labelLine={false} // Remove the lines pointing to the chart
          label={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout={isMobile ? "horizontal" : "vertical"}
          align={isMobile ? "center" : "right"}
          verticalAlign={isMobile ? "bottom" : "middle"}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MyPie;
