import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userEmailAtom } from "../store/userAtoms";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [email, setEmail] = useRecoilState(userEmailAtom);
  const [portfolioData, setPortfolioData] = useState(null);
  const [color, setColor] = useState("white");
  const [walletAmount, setWalletAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/portfolio/getPortfolioValue",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            params: {
              email: email,
            },
          }
        );
        setPortfolioData(res.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/portfolio/getWalletMoney",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            params: {
              email: email,
            },
          }
        );
        setWalletAmount(res.data.wallet);
      } catch (error) {
        console.error("Error fetching wallet amount:", error);
      }
    };

    fetchWalletAmount();
  }, [email]);

  useEffect(() => {
    if (portfolioData != null) {
      if (portfolioData.totalValue - portfolioData.totalInvestment > 0) {
        setColor("bg-green-400");
      } else if (portfolioData.totalValue - portfolioData.totalInvestment < 0) {
        setColor("bg-red-400");
      } else {
        setColor("bg-white");
      }
    }
  }, [portfolioData]);

  const handleSell = (symbol) => {
    navigate(`/trade/${symbol}`);
  };

  const handleAddMoney = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/portfolio/addWalletMoney",
        {
          email: email,
          amount: walletAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = res.data;
      alert(`Money added to wallet: $${data.wallet}`);
      setWalletAmount(data.wallet);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div
        className={`flex ${color} justify-center items-center w-full py-5  h-[200px] `}
      >
        <div className="flex justify-center font-bold text-xl ">
          {portfolioData ? (
            <div>
              <div>Total Portfolio Value: ${portfolioData.totalValue}</div>

              <div>Total Investment: ${portfolioData.totalInvestment}</div>
              <div>
                Total Profit/Loss: $
                {portfolioData.totalValue - portfolioData.totalInvestment}
              </div>
            </div>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <h2 className="flex justify-center font-medium m">Stocks</h2>
          {portfolioData &&
            portfolioData.portfolios[0].holdings.map((holding, index) => (
              <div
                key={index}
                className="flex space-x-4 border-2 border-gray-300 p-2 my-2"
              >
                <p>Stock Symbol: {holding.stockId}</p>
                <p>Quantity: {holding.quantity}</p>
                <p>Average Buy Price: {holding.averageBuyPrice}</p>
                <p>Current Price: {holding.currentPrice}</p>
                <p>Holding Value: {holding.holdingValue}</p>
                <button
                  className="bg-rose-600 text-white p-2 rounded-md w-auto"
                  onClick={() => handleSell(holding.stockId)}
                >
                  Sell
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col items-center">
          <h2 className="font-medium">Wallet Amount: ${walletAmount}</h2>
         
           
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
