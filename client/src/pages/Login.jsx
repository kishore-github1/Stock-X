import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState} from "../store/userState";
import { userNameAtom, userEmailAtom } from "../store/userAtoms";
import config from "../config";

const Login = () => {
  const [user, setUser] = useRecoilState(userState);
  const [name, setName] = useRecoilState(userNameAtom);
  const [email, setEmail] = useRecoilState(userEmailAtom);
  // const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="m-40 flex justify-center">
      <div className="flex flex-col">
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
            try {
              const res = await axios.post(
                `${config.baseURL}/api/user/login`,
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

              localStorage.setItem("token", data.token);

              setUser(true);
              
              setName(data.name);

              navigate("/");
            } catch (err) {
              alert(err);
            }
          }}
        >
          Login
        </button>

        <br />
      </div>
    </div>
  );
};

export default Login;
