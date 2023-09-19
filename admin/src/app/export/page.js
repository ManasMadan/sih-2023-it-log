"use client";
import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="flex gap-8">
      <Button
        onPress={async () => {
          const downloadExcelResponse = await fetch(
            "http://localhost:5000/admin/exportLogsAsCSV"
          );
          const downloadExcelBlob = await downloadExcelResponse.blob();
          saveAs(downloadExcelBlob, "AllLogs.csv");
        }}
      >
        Download as CSV
      </Button>
      <Button
        onPress={async () => {
          const downloadExcelResponse = await fetch(
            "http://localhost:5000/admin/exportLogsAsHTML"
          );
          const downloadExcelBlob = await downloadExcelResponse.blob();
          saveAs(downloadExcelBlob, "AllLogs.html");
        }}
      >
        Download as HTML
      </Button>
    </div>
  );
}
