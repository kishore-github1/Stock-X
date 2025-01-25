import { useRecoilState } from "recoil";
import React from "react";
import { userNameAtom } from "../store/userAtoms";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userName, setUserName] = useRecoilState(userNameAtom);
  const navigate = useNavigate();

  const trailVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const text = `Welcome, ${userName}!!`;

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      {userName ? (
        <div className="flex flex-col items-center w-2/3">
          <div className="flex justify-center items-center -mt-20">
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={trailVariants}
                className="font-serif text-7xl text-white"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-8">
            <h1 className="text-5xl font-bold text-white">Welcome to</h1>
            <motion.img
              src={logo}
              alt="Logo"
              className="ml-4 rounded-xl object-cover h-20 w-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          <p className="text-xl text-white mb-8">Please log in to continue</p>
          <button
            className="bg-white text-blue-500 font-bold py-2 px-4 rounded"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
