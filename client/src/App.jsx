import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { userState } from "./store/userState.js";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Stock from "./pages/Stock.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SpinningWheel from "./pages/SpinningWheel.jsx";
import UserIcon from "./assets/user.png";
import Logo from "./assets/logo.webp";
import { Audio } from "react-loader-spinner";

function App() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const searchContainerRef = useRef(null);

  const handleSearch = async () => {
    if (search == "") {
      alert("Please enter a valid search query");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`https://finnhub.io/api/v1/search`, {
        params: {
          q: `${search}`,
          exchange: "US",
          token: "ctjumk9r01quipmv6dg0ctjumk9r01quipmv6dgg",
        },
      });
      setSymbol(res.data.result[0].symbol);

      const response = await axios.get(
        `http://localhost:8000/${res.data.result[0].symbol}`
      );
      const data = response.data;
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      console.log(err.message);
      setSearchResults(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <BrowserRouter basename="/">
      <div className="flex flex-row items-center space-x-40">
        <div className="ml-3 p-4 rounded-xl">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>

        {user && (
          <div className=" bg-indigo-500 text-white py-2 px-4 rounded-xl">
            <Link to="dashboard"> Dashboard </Link>
          </div>
        )}

        <div ref={searchContainerRef} className="relative w-full max-w-md">
          <div className="flex my-5 justify-center space-x-4 w-full">
            <input
              className="rounded-lg mr-5 px-4 py-2 border-2 border-indigo-500 w-full"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value === "") setSearchResults(null);
              }}
            />
            <button
              className="rounded-lg bg-indigo-500 hover:bg-white text-white hover:text-indigo-500 border-2 border-indigo-500 font-bold py-2 px-4 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {loading && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-indigo-500 rounded-lg shadow-lg">
              <div className="flex space-x-4 p-4">
                <Audio type="Audio" color="#00BFFF" height={50} width={50} />
              </div>
            </div>
          )}
          {searchResults && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-indigo-500 rounded-lg shadow-lg">
              <div className="flex flex-col">
                {/* <div className="flex justify-end mr-2"> x </div> */}
                <div className="flex space-x-4 p-4">
                  <div>
                    <p>Current Price: ${searchResults.c}</p>
                    <p>Previous Close: ${searchResults.pc}</p>
                    <p>Open: ${searchResults.o}</p>
                    <p>High: ${searchResults.h}</p>
                    <p>Low: ${searchResults.l}</p>
                  </div>
                  <Link
                    to={`/stock/${symbol}`}
                    className="text-white bg-indigo-500 px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                  >
                    Detailed view
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        {!user && (
          <div className="flex mr-5 space-x-5 ">
            <div className=" bg-indigo-500 text-white py-2 px-4 rounded-xl">
              <Link to="/signUp">SignUp</Link>
            </div>
            <div className=" bg-indigo-500 text-white py-2 px-4 rounded-xl">
              <Link to="/login">Login</Link>
            </div>
          </div>
        )}

        {user && (
          <div className="text-white rounded-xl ">
            <img src={UserIcon} alt="User Icon" className="size-10 ml-32" />
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="wheel" element={<SpinningWheel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
