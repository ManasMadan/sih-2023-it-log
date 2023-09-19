"use client";

import React, { useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
  Input,
  Button,
  Select,
  SelectSection,
  SelectItem,
} from "@nextui-org/react";
import useSWR from "swr";
import { Slider } from "@/components/ui/slider";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page() {
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [predictedRisk, setPredictedRisk] = React.useState(0);
  const [unique, setUnique] = React.useState("");
  const [uniqueCount, setUniqueCount] = React.useState(0);

  useEffect(() => {
    if (!unique.length) return;
    const fn = async () => {
      const res = await fetch("http://localhost:5000/admin/unique/" + unique);
      setUniqueCount(await res.text());
    };
    fn();
  }, [unique]);

  const { data, isLoading } = useSWR(
    `http://localhost:5000/admin/getLogs?page=${page}&len=10&sortBy=${sortBy}&${search}&sortOrder=${
      sortDirection ? "asc" : "desc"
    }`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const rowsPerPage = 10;
  const pages = useMemo(() => {
    return data?.count ? Math.floor(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);
  useEffect(() => {
    setPage(1);
  }, [sortBy, sortDirection, search]);

  const loadingState =
    isLoading || data?.logs.length === 0 ? "loading" : "idle";

  const searchButtonClick = () => {
    const camp_name = document.getElementById("camp_name").value;
    const source_ip = document.getElementById("source_ip").value;
    const destination_ip = document.getElementById("destination_ip").value;
    const user = document.getElementById("user").value;
    const device = document.getElementById("device").value;
    const event_type = document.getElementById("event_type").value;
    const event_severity = document.getElementById("event_severity").value;
    setSearch(
      `camp=${camp_name}&source=${source_ip}&destination=${destination_ip}&user=${user}&device=${device}&eventType=${event_type}&eventSeverity=${event_severity}&mlRiskScore=${predictedRisk}`
    );
    setSortBy("timestamp");
    setSortDirection(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 mb-8">
        <span className="text-2xl">Search By</span>
        <div className="flex justify-between">
          <Input
            id="camp_name"
            className="max-w-[350px]"
            type="text"
            label="Camp Name"
            placeholder="Enter Camp Name"
          />
          <Input
            id="source_ip"
            className="max-w-[350px]"
            type="text"
            label="Source IP"
            placeholder="Enter Source IP"
          />
          <Input
            id="destination_ip"
            className="max-w-[350px]"
            type="text"
            label="Destination IP"
            placeholder="Enter Destination IP"
          />
        </div>
        <div className="flex justify-between">
          <Input
            id="user"
            className="max-w-[350px]"
            type="text"
            label="User"
            placeholder="Enter User"
          />
          <Input
            id="device"
            className="max-w-[350px]"
            type="text"
            label="Device"
            placeholder="Enter Device"
          />
          <Input
            id="event_type"
            className="max-w-[350px]"
            type="text"
            label="Event Type"
            placeholder="Enter Event Type"
          />
        </div>
        <div className="flex justify-between items-center">
          <Input
            id="event_severity"
            className="max-w-[350px]"
            type="text"
            label="Event Severity"
            placeholder="Enter Event Severity"
          />
          <div className="flex items-center max-w-[350px] w-full gap-4">
            <span className="min-w-fit">Minimum Risk</span>
            <Slider
              defaultValue={[13]}
              max={100}
              step={1}
              onValueChange={(e) => setPredictedRisk(e[0])}
            />
            <span className="font-bold text-[#020817] bg-white px-4 py-2 rounded-full aspect-square flex items-center">
              {predictedRisk}
            </span>
          </div>

          <Button
            className="min-w-[350px]"
            color="primary"
            onClick={searchButtonClick}
          >
            Search
          </Button>
        </div>
      </div>
      <Table
        aria-label="Example table with client async pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        onSortChange={(e) => null}
      >
        <TableHeader>
          <TableColumn
            key="campLocation"
            allowsSorting
            onClick={() => {
              if (sortBy == "campLocation") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("campLocation");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Camp
          </TableColumn>
          <TableColumn
            key="timestamp"
            allowsSorting
            onClick={() => {
              if (sortBy == "timestamp") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("timestamp");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            TimeStamp
          </TableColumn>
          <TableColumn
            key="source"
            allowsSorting
            onClick={() => {
              if (sortBy == "source") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("source");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Source IP
          </TableColumn>
          <TableColumn
            key="destination"
            allowsSorting
            onClick={() => {
              if (sortBy == "destination") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("destination");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Destination IP
          </TableColumn>
          <TableColumn
            key="user"
            allowsSorting
            onClick={() => {
              if (sortBy == "user") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("user");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            User
          </TableColumn>
          <TableColumn
            key="device"
            allowsSorting
            onClick={() => {
              if (sortBy == "device") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("device");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Device
          </TableColumn>
          <TableColumn
            key="eventType"
            allowsSorting
            onClick={() => {
              if (sortBy == "eventType") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("eventType");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Event Type
          </TableColumn>
          <TableColumn
            key="eventDescription"
            allowsSorting
            onClick={() => {
              if (sortBy == "eventDescription") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("eventDescription");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Event Description
          </TableColumn>
          <TableColumn
            key="eventSeverity"
            allowsSorting
            onClick={() => {
              if (sortBy == "eventSeverity") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("eventSeverity");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Event Severity
          </TableColumn>
          <TableColumn
            key="mlRiskScore"
            allowsSorting
            onClick={() => {
              if (sortBy == "mlRiskScore") {
                setSortDirection((prev) => !prev);
              } else {
                setSortBy("mlRiskScore");
                setSortDirection((prev) => !prev);
              }
            }}
          >
            Predicted Risk (%)
          </TableColumn>
        </TableHeader>
        <TableBody
          items={data?.logs ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={Math.random()}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <input
          id="go_to_page"
          type="number"
          min={1}
          max={data?.count}
          className="max-w-[100px] rounded-l-xl rounded-t-none p-2"
        />
        <button
          className="bg-white text-[#020817] rounded-r-xl rounded-t-none p-2"
          onClick={() => {
            setPage(document.getElementById("go_to_page").value);
          }}
        >
          Go to Page
        </button>
      </div>
      <div className="flex flex-col gap-4 my-8">
        <span className="text-2xl">Search Unique</span>
        <div className="flex gap-4">
          <Select
            label="Select a Column"
            className="max-w-md"
            onChange={(e) => setUnique(e.target.value)}
            labelPlacement="outside-left"
          >
            {[
              { value: "campLocation", label: "Camp Location" },
              { value: "timestamp", label: "Time Stamp" },
              { value: "source", label: "Source" },
              { value: "destination", label: "Destination" },
              { value: "user", label: "User" },
              { value: "device", label: "Device" },
              { value: "eventType", label: "Event Type" },
              { value: "eventDescription", label: "Event Description" },
              { value: "eventSeverity", label: "Event Severity" },
            ].map((label) => (
              <SelectItem key={label.value} value={label.value}>
                {label.label}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="number"
            className="max-w-[100px]"
            readOnly
            value={uniqueCount}
          />
        </div>
      </div>
    </div>
  );
}
