import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useRecoilState } from "recoil";
// import { userState } from "../store/atom/user";

const Login = () => {
  // const [user,setUser] = useRecoilState(userState);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
 
  return (
    <div >
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
          try{
            const res = await axios.post(
              "http://localhost:8000/api/user/login",
              {
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

            localStorage.setItem("token",data.token);
            
            // setUser(true);
            
            // navigate("/create-post");

        }
      catch(err){
        alert(err);
      }
    }}
      >
        Login
      </Button>

      <br/>
      <Button onClick={()=>navigate("/signUp")}>
        Signup
      </Button>
    </div>
  );
};

export default Login;
