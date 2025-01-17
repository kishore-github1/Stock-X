import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import TextField from "@mui/material/TextField";
import { useRecoilState } from "recoil";
import { userEmailAtom } from "../store/userAtoms";
import { useNavigate } from "react-router-dom";
import { userState } from "../store/userState.js";

const Stock = () => {
  const { symbol } = useParams();
  const [chartData, setChartData] = useState({});
  const [companyInfo, setCompanyInfo] = useState({});
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8000/api/portfolio/getStockCandleData", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params:{
            symbol : symbol,
          }
        });
        console.log(response.data);

        const data = response.data;

        const labels = data.map(item => new Date(item.t).toLocaleDateString());
        const prices = data.map(item => item.c);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${symbol} Closing Prices`,
              data: prices,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8000/api/portfolio/getCompanyInfo", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            symbol: symbol,
          },
        });

        setCompanyInfo(response.data);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    fetchCompanyInfo();
  }, [symbol]);

  const handleBuy = () => {
    if(!user){
      alert('Please Login');
      return;
    }
    navigate("/trade/" + symbol);
  };

  return (
    <div className="flex">
      <div className="m-[60px] min-w-[67%] border-2 border-indigo-400">
        <h2 className="m-5 font-bold">{symbol}</h2>

        <div className=" mx-5 max-w-sm hover:max-w-xl  bg-gray-100 rounded-lg border border-indigo-500 p-4 transition-all duration-300 ease-in-out">
          Chart
          {chartData.labels ? (
            <Line data={chartData} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-x-0.5">
          <div></div>

          <div className="flex justify-center space-x-4">
            
            <button
              className="bg-green-700 text-white p-4 w-full rounded-md"
              onClick={handleBuy}
            >
              Buy
            </button>
          </div>
        </div>

        <div className="m-5">
          <h2 className="flex justify-center font-bold">Company Information</h2>
          <div className="flex justify-center">
          {companyInfo && (
            <div className="p-4">
              <p><strong>Name:</strong> {companyInfo.name}</p>
              <p><strong>Industry:</strong> {companyInfo.finnhubIndustry}</p>
              <p><strong>Market Capitalization:</strong> {companyInfo.marketCapitalization}</p>
              <p><strong>Shares Outstanding:</strong> {companyInfo.shareOutstanding}</p>
              <p><strong>Website:</strong> <a href={companyInfo.weburl} target="_blank" rel="noopener noreferrer">{companyInfo.weburl}</a></p>
            </div>
          )}
          </div>
        </div>
      </div>
      <div className="hidden md:block border-2 border-indigo-400">Side box</div>
    </div>
  );
};

export default Stock;
