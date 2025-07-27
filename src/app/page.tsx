import React from "react";
import UserList from "./component/ui/UserList";

const Home = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4">
        <UserList />
      </div>
    </div>
  );
};

export default Home;
