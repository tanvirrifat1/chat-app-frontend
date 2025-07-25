"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();

  if (
    pathname === "/signup" ||
    pathname === "/verify" ||
    pathname === "/login"
  ) {
    return null;
  }
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Chat-App</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Blog</a>
            </li>
            <li>
              <a>Faq</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
