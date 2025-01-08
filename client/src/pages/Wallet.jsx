import React, {useEffect, useState} from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userEmailAtom } from "../store/userAtoms";


const Wallet = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [email,setEmail] = useRecoilState(userEmailAtom);
  const [addAmount, setAddAmount] = useState(0);
  const [triggerFetch, setTriggerFetch] = useState(false);
  

  useEffect(() => {
    const fetchWalletAmount = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/portfolio/getWalletMoney", {
                params: { email: email },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            setWalletAmount(res.data.wallet);
        } catch (err) {
            console.error(err.message);
        }
    };

    fetchWalletAmount();
  },[email,triggerFetch]);


  const handleAddMoney = async () => {
    if(addAmount <= 0){
        alert("Please enter a valid amount");
        return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/api/portfolio/addWalletMoney",
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





  return (
    <div className="flex flex-col items-center">
      <div className="font-bold">Wallet</div>
      <div className="p-4 font-semibold ">Avaliable Money : {walletAmount} </div>
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
  );
};

export default Wallet;
