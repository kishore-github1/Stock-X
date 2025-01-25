import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userEmailAtom } from "../store/userAtoms";
import SpinningWheel from "../pages/SpinningWheel";
import config from "../config";

const Wallet = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [email, setEmail] = useRecoilState(userEmailAtom);
  const [addAmount, setAddAmount] = useState(0);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        const res = await axios.get(
          `${config.baseURL}/api/portfolio/getWalletMoney`,
          {
            params: { email: email },
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setWalletAmount(res.data.wallet);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchWalletAmount();
  }, [email, triggerFetch]);

  const handleAddMoney = async () => {
    if (addAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      const res = await axios.post(
        `${config.baseURL}/api/portfolio/addWalletMoney`,
        {
          email: email,
          amount: addAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setTriggerFetch(!triggerFetch);
      const data = res.data;
      alert(`$${data.wallet} added to wallet`);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${config.baseURL}/api/portfolio/getTransactions`,
          {
            params: { email: email },
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(res.data);
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="m-4 grid grid-cols-3 gap-4">
      <div>
        <SpinningWheel/>
      </div>
      <div className="col-span-1 flex-col items-center justify-center">
        <div className="ml-52 font-bold">Wallet</div>
        <div className="p-4 ml-36 font-semibold ">
          Avaliable Money : {walletAmount}{" "}
        </div>
        <div className="flex justify-center mt-10">
          <div className="flex flex-col items-center">
            <h2 className="font-medium">Add Money to Wallet</h2>
            <input
              type="number"
              className="border-2 border-gray-300 p-2 my-2"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white p-2 rounded-md w-auto"
              onClick={handleAddMoney}
            >
              Add Money
            </button>
          </div>
        </div>
      </div>
      <div className="border-2 border-bg-gray-600 mr-2 p-2">
        <h2 className="flex justify-center font-bold">Transactions</h2>
        <div className="">
          
            <ul className="grid grid-cols-4 gap-6 font-bold">
              <li>Type</li>
              <li>Stock</li>
              <li>Quantity</li>
              <li>Amount</li>
            </ul>
          
          {transactions.map((transaction) => (
            <div key={transaction._id} className="grid grid-cols-4 gap-6">
              <div>{transaction.type}</div>
              <div>{transaction.stockId}</div>
              <div>{transaction.quantity}</div>
              <div>${transaction.price * transaction.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
