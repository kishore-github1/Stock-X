import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox";
import { useRecoilState } from "recoil";
import { userEmailAtom, userNameAtom } from "../store/userAtoms";

const DropdownMenu = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useRecoilState(userEmailAtom);
  const [name, setName] = useRecoilState(userNameAtom);

  const handleProfileClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex absolute right-24 top-2 mt-16 mr-5 p-4 w-32 justify-center bg-white border-2 border-indigo-500 rounded-lg shadow-lg">
      <div className="">
        <ul className="flex flex-col space-y-2 ">
          <li>
            <button onClick={() => navigate("/wallet")}>Wallet</button>
          </li>
          <li>
            <button onClick={handleProfileClick}>Profile</button>
          </li>
          <li>Log Out</li>
        </ul>
      </div>
      <DialogBox isOpen={isDialogOpen} onClose={handleCloseDialog}>
        <h2 className="text-xl font-bold">Profile Information</h2>
        <p>Email: {email}</p>
        <p>Name: {name}</p>
        
      </DialogBox>
    </div>
  );
};

export default DropdownMenu;
