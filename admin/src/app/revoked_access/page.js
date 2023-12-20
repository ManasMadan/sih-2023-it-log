"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
} from "@nextui-org/react";

export default function page() {
  const [blocked_ips, setBlocked_ips] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const response = fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/revoked_access`,
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      response.then(async (r) => {
        const j = await r.json();
        console.log(j);
        setBlocked_ips(j.revoked_access);
      });
    };
    fn();
  }, []);
  const unblockIP = async (ip) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/allow_access`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ ip }),
    });
    alert("Access Allowed");
    location.reload();
  };

  return (
    <Table aria-label="Example table with client async pagination">
      <TableHeader>
        <TableColumn key="blocked_ips">Revoked Access</TableColumn>
        <TableColumn key="actions">Actions</TableColumn>
      </TableHeader>
      <TableBody items={blocked_ips} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow key={Math.random()}>
            <TableCell>{item.log_description}</TableCell>
            <TableCell>
              <Button onPress={() => unblockIP(item.log_description)}>
                Allow Access
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
