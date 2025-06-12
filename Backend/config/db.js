import mongoose  from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectDb=()=>
{
    mongoose.connect(process.env.MONGO_URL).then(()=>
    {
        console.log("Connection Build");
    }).catch((err)=>
    {
        console.log("Error"+err);
    })
}
export {connectDb};