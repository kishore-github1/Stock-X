import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="m-40 flex justify-center">
      <div className="flex flex-col">
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          onChange={(p) => setPassword(p.target.value)}
        />
        <br />
        <button
          className="bg-indigo-500 text-white p-2 rounded-lg"
          onClick={async () => {
            const res = await axios.post(
              `${config.baseURL}/api/user/signUp`,
              {
                name: name,
                email: email,
                password: password,
              },
              {
                headers: {
                  "Content-type": "application/json",
                },
              }
            );
            const data = res.data;
            console.log(data);

            navigate("/login");
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignUp;
