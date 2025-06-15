import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">SocialApp</h1>
      <div className="space-x-4">
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/friend-requests">Friends</Link>
      </div>
    </nav>
  );
};

export default Navbar;
