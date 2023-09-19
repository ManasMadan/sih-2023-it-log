import React from "react";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CustomLinkComponent = ({ link, setNavbarOpen }) => {
  const pathname = usePathname();
  const activeClasses = "bg-[#37373f]";
  const nonActiveClasses = "text-[#72767f]";

  return (
    <Link href={link.path} onClick={() => setNavbarOpen(false)}>
      <div
        className={`flex gap-4 px-4 py-2 rounded-lg text-sm ${
          pathname.split("/")[1] == link.path.split("/")[1]
            ? activeClasses
            : nonActiveClasses
        }`}
      >
        {link.title}
      </div>
    </Link>
  );
};

export default function Navbar({ navbarOpen, setNavbarOpen }) {
  const links = [
    { title: "Dashboard", path: "/" },
    { title: "All Logs", path: "/viewer" },
    { title: "Log Analysis", path: "/analysis" },
    { title: "Export Logs", path: "/export" },
  ];
  return (
    <nav
      className={`${
        navbarOpen ? "translate-x-0 block absolute" : "-translate-x-full hidden"
      } lg:block lg:translate-x-0 rounded-r-xl h-screen min-w-[250px] w-[250px] px-6 lg:py-8 shadow-blue-200 shadow-sm bg-[#020817]`}
    >
      <div className="lg:hidden h-[50px] w-full flex items-center">
        <XIcon onClick={() => setNavbarOpen(false)} />
      </div>
      <div className="flex flex-col w-full h-full text-2xl">
        <div className="h-fit flex w-full items-center justify-evenly">
          <img src="/logo.svg" /> <span>Log Lens</span>
        </div>
        <div className="flex flex-col gap-4 h-full justify-center">
          {links.map((link) => (
            <CustomLinkComponent
              key={link.path}
              link={link}
              setNavbarOpen={setNavbarOpen}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
