import mongoose from 'mongoose';

const connectDB = (url) =>{
    mongoose.set('strictQuery',true);
    mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "stock_market" })
    .then(() => console.log('MongoDB connected'))
    .catch((err)=> console.log(err));
}

export default connectDB;