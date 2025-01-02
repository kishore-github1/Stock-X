import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SignUp = () => {
  const [name,setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  return (
    <div >
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
      <Button
        variant="contained"
        onClick={async () => {
          const res = await axios.post(
            "http://localhost:8000/api/user/signUp",
            {
              name : name,
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
      </Button>
    </div>
  );
};

export default SignUp;
