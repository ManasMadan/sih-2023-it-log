import React from "react";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { addNumberofLogstoDatabase } from "../utils";
import * as data from "../data";

export default function CreateNlogs() {
  const [number, setNumber] = useState(0);
  const [campLocation, setCampLocation] = useState("");
  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8">
      <div className="text-2xl uppercase underline text-center w-full">
        Add Random N Number of Logs
      </div>
      <div className="flex flex-col gap-8 max-w-[800px] mx-auto w-full">
        <div className="flex gap-8 items-center justify-between">
          <span className="min-w-fit">TimeStamp : </span>
          <div className="max-w-[400px] w-full">
            <Input
              className=""
              type="number"
              label="Enter Integer for Number of Logs"
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-8 items-center justify-between">
          <span className="min-w-fit">Camp Location : </span>
          <div className="max-w-[400px] w-full">
            <Select
              label="Select Camp Location"
              className="w-full"
              onChange={(e) => setCampLocation(e.target.value)}
            >
              {data.campLocation.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <Button
          color="danger"
          onClick={() => addNumberofLogstoDatabase(number, campLocation)}
        >
          <span className="px-4 py-2">Click to Add {number} Logs</span>
        </Button>
      </div>
    </div>
  );
}
