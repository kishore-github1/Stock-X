import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import finnhub from 'finnhub';

import userRoute from './routes/userRoute.js';
import portfolioRoute from './routes/portfolioRoute.js';

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());

app.use('/api/user',userRoute);
app.use('/api/portfolio',portfolioRoute);



app.get('/:symbol',(req,res)=>{

    
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_API_KEY;
    const finnhubClient = new finnhub.DefaultApi();
    
   

    const getStockPrice = (symbol) => {
      // var symbol = '';
      // finnhubClient.symbolSearch(symbol, (error, data, response) => {
      //   if (error) {
      //     console.error('Error fetching stock data:', error);
      //     return;
      //   } 
      //   console.log(`symbol : ${data}`);
      //   symbol = data.result[0].symbol;
      //   res.send(data);
        
      // });

      finnhubClient.quote(symbol, (error, data, response) => {
        if (error) {
          console.error('Error fetching stock data:', error);
          return;
        }                                                       
        console.log(`Current price of ${symbol}: $${data.c}`);
        res.send(data);
      });
    };
    getStockPrice(req.params.symbol);
  
  });


const startServer = async()=>{

  try {
      connectDB(process.env.MONGODB_URL);
      app.listen(8000, () => console.log('Server has started on port http://localhost:8000'))
  } catch(error){
      console.log(error);
  }
  
}

startServer();

