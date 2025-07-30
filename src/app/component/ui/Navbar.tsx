"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import IsUser from "./IsUser";
import { logout } from "@/app/service/authService";

const Navbar = () => {
  const pathname = usePathname();
  const [isUser, setIsUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const user: any = await IsUser();
      setIsUser(user);
    };
    checkUser();
  }, []);

  if (
    pathname === "/signup" ||
    pathname === "/verify" ||
    pathname === "/login"
  ) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("accessToken");
  };

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
            {isUser ? (
              <li onClick={handleLogout}>
                <Link href="/profile">Logout</Link>
              </li>
            ) : (
              <li>
                <Link href="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
