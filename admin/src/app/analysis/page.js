"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function page() {
  const [riskVDay, setRiskVDay] = useState([]);
  const [riskEventType, setRiskEventType] = useState([]);
  const [riskVUser, setRiskVUser] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const response = fetch("http://localhost:5000/admin/ml");
      response.then(async (r) => {
        const j = await r.json();
        setRiskVDay(j.riskVDay);
        setRiskEventType(j.riskEventType);
        setRiskVUser(j.riskVUser);
      });
    };
    fn();
  }, []);

  return (
    <section className="w-full h-screen gap-8 flex flex-col items-center gap-2 mb-12">
      <div class="flex flex-col w-full h-1/2 items-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={riskVDay}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#FFD700" />
          </LineChart>
        </ResponsiveContainer>
        <span className="text-lg">
          Number of Logs With Predicted Risk &gt;= 70
        </span>
      </div>
      <div class="flex w-full h-1/2 items-center">
        <div class="w-1/2 h-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={400}>
              <Tooltip />

              <Pie
                data={riskEventType}
                cx={285}
                cy={140}
                innerRadius={120}
                outerRadius={140}
                fill="#8884d8"
                dataKey="count"
              >
                {riskEventType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <span className="text-lg">
            Predicted Risk &gt;= 70 Grouped By Event Type
          </span>
        </div>
        <div className="w-1/2 h-full flex flex-col items-center gap-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
              data={riskVUser}
            >
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#fff" }}
                dataKey="count"
              />
              <Tooltip />
              <Legend iconSize={10} layout="horizontal" align="center" />
            </RadialBarChart>
          </ResponsiveContainer>

          <span className="text-lg">
            Predicted Risk &gt; 70 Grouped By Users
          </span>
        </div>
      </div>
    </section>
  );
}
