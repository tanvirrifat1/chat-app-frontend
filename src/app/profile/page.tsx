"use client";

import React from "react";
import { useGetProfileQuery } from "../redux/feature/profileAPI";

import { FaEdit } from "react-icons/fa";
import Link from "next/link";

const profilePage = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery("");

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800">
        <img
          src={process.env.NEXT_PUBLIC_IMAGE_URL + profile?.data?.image}
          alt=""
          width={128}
          height={128}
          className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
        />
        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
          <div className="my-2 space-y-1">
            <h2 className="text-xl font-semibold sm:text-2xl">
              {profile?.data?.name}
            </h2>
            <p className="px-5 text-xs sm:text-base dark:text-gray-600">
              {profile?.data?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end mt-4">
          <Link href={`/profile/edit/${profile?.data?._id}`}>
            <FaEdit size={30} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default profilePage;
