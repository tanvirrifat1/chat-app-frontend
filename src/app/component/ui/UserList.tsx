"use client";

import {
  useGetMyInboxQuery,
  useSendMsgMutation,
} from "@/app/redux/feature/msgAPI";
import { useGetAllUsersQuery } from "@/app/redux/feature/userAPI";
import { useRouter } from "next/navigation";
import React from "react";
import { TiMessageTyping } from "react-icons/ti";

const UserList = () => {
  const { data: users, isLoading } = useGetAllUsersQuery("");

  const [data] = useSendMsgMutation();

  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;

  const handleSendMessage = (receiverId: string) => {
    data({ receiverId });
    router.push(`/chating`);
  };

  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {users?.data?.result?.map((user: any) => (
          <li key={user._id} className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src={process.env.NEXT_PUBLIC_IMAGE_URL + user.image || ""}
                alt={user.name}
              />
            </div>
            <div>
              <div>{user.name}</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {user.email} {/* Displaying dynamic reason */}
              </div>
            </div>
            <button
              onClick={() => handleSendMessage(user._id)}
              className="btn btn-square btn-ghost"
            >
              <TiMessageTyping size={30} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
