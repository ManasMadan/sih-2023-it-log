"use client";
import { Divider } from "@nextui-org/react";
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

export default function Home() {
  const [logVTime, setLogVTime] = useState([]);
  const [eventsTypeVTime, setEventsTypeVTime] = useState([]);
  const [criticalAlertsVTime, setCriticalAlertsVTime] = useState([]);
  const [criticalAlertGroupByEventType, setCriticalAlertGroupByEventType] =
    useState([]);
  const [logCount, setLogCount] = useState(0);
  const [uniquieSourceCount, setUniquieSourceCount] = useState(0);
  const [uniquieDestinationCount, setUniquieDestinationCount] = useState(0);
  const [eventSeverityVTime, setEventSeverityVTime] = useState([]);
  const [eventSeverityDaily, setEventSeverityDaily] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const response = fetch(
        "http://localhost:5000/admin/dashboard?threshold=0.7"
      );
      response.then(async (r) => {
        const j = await r.json();
        setEventsTypeVTime(j.eventTypeVTime);
        setLogVTime(j.logVTime);
        setCriticalAlertsVTime(j.criticalAlertsVTime);
        setCriticalAlertGroupByEventType(j.criticalAlertGroupByEventType);
        setLogCount(j.logcount);
        setUniquieSourceCount(j.sourceIP);
        setUniquieDestinationCount(j.destIP);
        setEventSeverityVTime(j.eventSeverityVTime);
        setEventSeverityDaily(j.eventSeverityDaily);
      });
    };
    fn();
  }, []);

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-8 flex-nowrap">
        <h3 className="text-2xl underline underline-offset-4 uppercase tracking-widest">
          Overview
        </h3>
        <div className="flex gap-8 h-1/2 flex-nowrap w-full">
          <div className="w-full h-full flex flex-col items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={logVTime}
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
            <span className="text-lg">Number Of Logs In Past Week</span>
          </div>
          <div className="w-full h-full flex flex-col items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={800} height={400}>
                <Tooltip />

                <Pie
                  data={eventsTypeVTime}
                  cx={285}
                  cy={140}
                  innerRadius={120}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {eventsTypeVTime.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="text-lg">
              Number of Logs In Past Week Grouped By Event Type
            </span>
          </div>
        </div>
        <div className="w-full h-1/2 flex flex-col items-center gap-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={criticalAlertsVTime}
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FFD700"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <span className="text-lg">Number of Alerts in Past Week</span>
        </div>
      </section>
      <Divider className="my-4" />
      <section className="w-full h-[60vh] flex flex-col flex-nowrap">
        <h3 className="text-2xl underline underline-offset-4 uppercase tracking-widest">
          Alerts
        </h3>
        <div className="flex gap-8 h-full flex-nowrap w-full justify-center items-center">
          <div className="w-1/2 h-full flex flex-col items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={10}
                data={criticalAlertGroupByEventType}
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
              Number of Alerts Grouped By Event Severity
            </span>
          </div>
          <div className="w-1/2 h-full text-black rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-start text-2xl">
            <div className="w-3/4 object-contain">
              <img src="/alert.png" className="" />
            </div>
            <div className="text-3xl font-bold">
              Number of Alerts Today :{" "}
              {criticalAlertsVTime.length && criticalAlertsVTime.at(-1).count}
            </div>
          </div>
        </div>
      </section>
      <Divider className="my-4" />
      <section className="w-full h-[50vh] flex flex-col flex-nowrap gap-8">
        <h3 className="text-2xl underline underline-offset-4 uppercase tracking-widest">
          Stats
        </h3>
        <div className="text-black flex gap-8 h-full flex-nowrap w-full">
          <div className="w-1/3 h-full rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-around">
            <div className="w-3/4 object-contain">
              <img src="/router.png" className="" />
            </div>
            <div className="text-xl font-bold">
              Log Count in Past 24 hours :{logCount}
            </div>
          </div>
          <div className="w-1/3 h-full rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-around">
            <div className="w-3/4 object-contain">
              <img src="/router.png" className="" />
            </div>
            <div className="text-xl font-bold">
              Unique Source IP (Weekly) : {uniquieSourceCount}
            </div>
          </div>
          <div className="w-1/3 h-full rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-around">
            <div className="w-3/4 object-contain ">
              <img src="/router.png" className="" />
            </div>
            <div className="text-xl font-bold">
              Unique Destination IP (Weekly) : {uniquieDestinationCount}
            </div>
          </div>
        </div>
      </section>
      <Divider className="my-4" />
      <section className="w-full h-[50vh] flex flex-col items-center gap-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={eventSeverityVTime}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#FFD700"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <span className="text-lg">
          Number of Logs Grouped By Event Severity in Past Week
        </span>
      </section>
      <Divider className="my-4" />
      <section className="w-full h-[50vh] flex flex-col items-center gap-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={eventSeverityDaily}
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
            <Line
              type="monotone"
              dataKey="informational_count"
              stroke={COLORS[0]}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="warning_count"
              stroke={COLORS[1]}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="error_count"
              stroke={COLORS[2]}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="critical_count"
              stroke={COLORS[3]}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <span className="text-lg">Logs Grouped by Event Severity Daily</span>
      </section>
    </>
  );
}
