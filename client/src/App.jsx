import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Stock from "./pages/Stock.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Trade from "./pages/Trade.jsx";
import Header from "./components/Header.jsx";
import Wallet from "./pages/Wallet.jsx";
import SpinningWheel from "./pages/SpinningWheel.jsx";

function App() {

  return (
    <BrowserRouter basename="/">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trade/:symbol" element={<Trade />} />
        <Route path="wallet" element={<Wallet/>}></Route>
        <Route path="signUp" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="wheel" element={<SpinningWheel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
