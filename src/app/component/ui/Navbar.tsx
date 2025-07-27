"use client";

import Link from "next/link";
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
          <Link href="/">
            <p className="btn btn-ghost text-xl">Chat-App</p>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Blog</a>
            </li>
            <li>
              <Link href="/profile">
                <p>Profile</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
