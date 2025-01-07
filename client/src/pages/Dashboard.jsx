import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userEmailAtom } from "../store/userAtoms";

const Dashboard = () => {
  const [email, setEmail] = useRecoilState(userEmailAtom);
  const [portfolioData, setPortfolioData] = useState(null);

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

  return (
    <div>
      <div className="flex justify-center border-2 border-indigo-500 py-5 w-full h-[200px] box-content">
        <div className="border-5 border-black">
          Total Portfolio Value:{" "}
          {portfolioData ? portfolioData.totalValue : "Loading..."}
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <h2>Individual stocks</h2>
          {portfolioData &&
            portfolioData.portfolios[0].holdings.map((holding, index) => (
              <div key={index} className="border-2 border-gray-300 p-2 my-2">
                <p>Stock ID: {holding.stockId}</p>
                <p>Quantity: {holding.quantity}</p>
                <p>Average Buy Price: {holding.averageBuyPrice}</p>
                <p>Current Price: {holding.currentPrice}</p>
                <p>Holding Value: {holding.holdingValue}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
