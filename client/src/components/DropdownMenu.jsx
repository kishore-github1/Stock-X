import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox";
import { useRecoilState } from "recoil";
import { userEmailAtom, userNameAtom } from "../store/userAtoms";
import { userState } from "../store/userState";
import config from "../config";

const DropdownMenu = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isdropdownOpen, setIsDropdownOpen] = useState(true);
  const [email, setEmail] = useRecoilState(userEmailAtom);
  const [name, setName] = useRecoilState(userNameAtom);
  const [user, setUser] = useRecoilState(userState);
  const dropdownRef = useRef(null);
  const dialogRef = useRef(null);

  const handleProfileClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDialogOpen(false);
    }
  };

  const handleClickOutsideDialog = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setEmail(null);
    setName(null);
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideDialog);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideDialog);
    };
  }, []);

  return (
    <div>
      {isdropdownOpen && (
        <div
          ref={dropdownRef}
          className="flex absolute right-24 top-2 mt-16 mr-5 p-4 w-32 justify-center bg-white border-2 border-indigo-500 rounded-lg shadow-lg"
        >
          <div className="">
            <ul className="flex flex-col space-y-2 ">
              <li>
                <button onClick={() => navigate("/wallet")}>Wallet</button>
              </li>
              <li>
                <button onClick={handleProfileClick}>Profile</button>
              </li>
              <li>
                <button onClick={handleLogout}>Log Out</button>
              </li>
            </ul>
          </div>
          <DialogBox
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            dialogRef={dialogRef}
          >
            <h2 className="text-xl font-bold">Profile Information</h2>
            <p>Email: {email}</p>
            <p>Name: {name}</p>
          </DialogBox>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
