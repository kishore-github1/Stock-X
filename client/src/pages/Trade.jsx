import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import axios from "axios";
import { userEmailAtom } from "../store/userAtoms.js";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Trade = () => {
  const { symbol } = useParams();
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [email, setEmail] = useRecoilState(userEmailAtom);
  const navigate = useNavigate();

  const handleBuy = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/portfolio/buy",
        {
          email: email,
          stockId: symbol,
          quantity: quantity,
          avgBuyPrice: price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = res.data;
      console.log(data);
      navigate("/dashboard");
    } catch (err) {
      alert(err);
    }
  };

  const handleSell = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/portfolio/sell",
        {
          email: email,
          stockId: symbol,
          quantity: quantity,
          avgBuyPrice: price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = res.data;
      console.log(data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center m-40 w-1/3 bg-green-50 py-10 border-2">
        <div className="font-bold mb-2"> StockId : {symbol} </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="font-bold mr-4 mt-4">Buy/Sell</div>
            <TextField
              id="outlined-basic"
              label="Buy/Sell Price"
              variant="outlined"
              type="text"
              onChange={(p) => setPrice(p.target.value)}
            />
          </div>
          <br />
          <div className="flex justify-center">
            <div className="font-bold mr-4 mt-4">Quantity</div>
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              type="text"
              onChange={(p) => setQuantity(p.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="flex justify-center ml-12 space-x-4">
          <button
            className="bg-red-600 text-white mr-2 p-2 rounded-md w-20"
            onClick={handleSell}
          >
            Sell
          </button>
          <button
            className="bg-green-700 text-white p-2 rounded-md w-20"
            onClick={handleBuy}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

Trade.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default Trade;
