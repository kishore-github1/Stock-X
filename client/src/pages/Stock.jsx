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
  const [news, setNews] = useState([]);
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
        setCompanyInfo(null);
      }
    };

    fetchCompanyInfo();
  }, [symbol]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8000/api/portfolio/getNews", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            symbol: symbol,
          },
        });

        const newsData = response.data.feed.map(article => ({
          headline: article.title,
          url: article.url,
        }));

        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]);
      }
    };

    fetchNews();
  }, [symbol]);

  const handleBuy = () => {
    if(!user){
      alert('Please Login');
      return;
    }
    navigate("/trade/" + symbol);
  };

  return (
    <div className="flex flex-col md:flex-row m-5">
      <div className="m-5 flex-1 border-2 border-indigo-400 rounded-lg p-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-5">{symbol}</h2>

        <div className="bg-gray-100 rounded-lg border border-indigo-500 p-4 mb-5 transition-all duration-300 ease-in-out shadow-md">
          <h3 className="text-lg font-semibold mb-3">Chart</h3>
          {chartData.labels ? (
            <Line data={chartData} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        <div className="flex justify-center mb-5">
          <button
            className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition duration-300 shadow-md"
            onClick={handleBuy}
          >
            Buy
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold  mb-5">Company Information</h2>
          <div className="bg-white p-5 rounded-lg shadow-lg">
            {companyInfo ? (
              <div>
                <p className="mb-2"><strong>Name:</strong> {companyInfo.name}</p>
                <p className="mb-2"><strong>Industry:</strong> {companyInfo.finnhubIndustry}</p>
                <p className="mb-2"><strong>Market Capitalization:</strong> {companyInfo.marketCapitalization}</p>
                <p className="mb-2"><strong>Shares Outstanding:</strong> {companyInfo.shareOutstanding}</p>
                <p className="mb-2"><strong>Website:</strong> <a href={companyInfo.weburl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{companyInfo.weburl}</a></p>
              </div>
            ) : (
              <p>Company information not available</p>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/4 border-2 border-indigo-400 rounded-lg p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Related News</h3>
        <ul className="list-disc pl-5">
          {news.length > 0 ? (
            news.map((article, index) => (
              <li key={index} className="mb-2">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {article.headline}
                </a>
              </li>
            ))
          ) : (
            <p>News not available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Stock;
