import React from "react";
import { MenuIcon } from "lucide-react";
export default function NavbarCollapseButton({ navbarOpen, setNavbarOpen }) {
  return (
    <div
      className={`${
        navbarOpen ? "invisible" : ""
      } h-[50px] w-full lg:hidden flex items-center pl-6`}
    >
      <MenuIcon onClick={() => setNavbarOpen(true)} />
    </div>
  );
}
