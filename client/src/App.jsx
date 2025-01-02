import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom'; 
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Stock from './pages/Stock.jsx';
import SpinningWheel from './pages/SpinningWheel.jsx';

function App() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [symbol, setSymbol] = useState('');
  const searchContainerRef = useRef(null);
  
  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://finnhub.io/api/v1/search`, {
        params: { q: `${search}`, exchange: 'US', token: 'ctjumk9r01quipmv6dg0ctjumk9r01quipmv6dgg' }
      });
      setSymbol(res.data.result[0].symbol);

      const response = await axios.get(`http://localhost:8000/${res.data.result[0].symbol}`);
      const data = response.data;
      console.log(data);
      
      setSearchResults(data);
    } catch (err) {
      console.log(err.message);
      setSearchResults(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchResults(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <BrowserRouter basename="/">
      <div className="flex flex-col items-center">
        <div ref={searchContainerRef} className="relative w-full max-w-md">
          <div className="flex my-5 justify-center space-x-4 w-full">
            <input 
              className="rounded-lg mr-5 px-4 py-2 border-2 border-indigo-500 w-full" 
              type="text" 
              placeholder="Search" 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value === '') setSearchResults(null);
              }}
            />
            <button 
              className="rounded-lg bg-indigo-500 hover:bg-white text-white hover:text-indigo-500 border-2 border-indigo-500 font-bold py-2 px-4 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          
          {searchResults && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-indigo-500 rounded-lg shadow-lg">
              <div className="flex space-x-4 p-4">
                <div>
                  <p>Current Price: ${searchResults.c}</p>
                  <p>Previous Close: ${searchResults.pc}</p>
                  <p>Open: ${searchResults.o}</p>
                  <p>High: ${searchResults.h}</p>
                  <p>Low: ${searchResults.l}</p>
                </div>
                <Link to={`/stock/${symbol}`} className='text-white bg-indigo-500 px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600'>
                  Detailed view
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/stock/:symbol" element={<Stock />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="wheel" element={<SpinningWheel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;