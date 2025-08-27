import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
      dbName:'drop2mail'
    })
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error.message);
  }
}

export default ConnectDB;
