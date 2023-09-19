import React from "react";
import AddSingleLogEntry from "./components/AddSingleLogEntry";
import CreateNlogs from "./components/CreateNlogs";
import { Button, Divider } from "@nextui-org/react";
import { addLogsToIPFSandBlockchain } from "./utils";
export default function App() {
  return (
    <div className="py-12 min-h-screen dark bg-[#020817] text-white overflow-hidden">
      <AddSingleLogEntry />
      <Divider className="my-12" />
      <CreateNlogs />
      <Divider className="my-12" />
      <div className="flex justify-center pt-8">
        <Button color="danger" onClick={addLogsToIPFSandBlockchain}>
          <span className="px-4 py-2">
            Manually Trigger Adding Logs to IPFS (NOTE : This happens
            automatically after every hour)
          </span>
        </Button>
      </div>
    </div>
  );
}
