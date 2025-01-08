import React from "react";
import { useNavigate } from "react-router-dom";   
                                    

const DropdownMenu = () => {
  const navigate = useNavigate(); 
  return (
    <div className="flex absolute right-24 top-2 mt-16 mr-5 p-4 w-32 justify-center bg-white border-2 border-indigo-500 rounded-lg shadow-lg">
      <div className="">
        <ul className="flex flex-col space-y-2 ">
          <li>
            <button onClick={()=>navigate("/wallet")}>Wallet</button>
          </li>
          <li>Profile</li>
          <li>Settings</li>
          <li>Log Out</li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
