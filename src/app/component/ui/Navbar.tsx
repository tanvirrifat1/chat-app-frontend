"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import IsUser from "./IsUser";
import { logout } from "@/app/service/authService";

const HIDDEN_ROUTES = ["/signup", "/verify", "/login"];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isUser, setIsUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await IsUser();
      setIsUser(user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Chat-App
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="#">Blog</Link>
          </li>
          {isUser ? (
            <>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
