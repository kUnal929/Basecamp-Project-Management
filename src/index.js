import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";
dotenv.config();
const Port = process.env.PORT || 3000;

connectDB()
   .then(() => {
      app.listen(Port, () => {
         console.log(`Server is running on port http://localhost:${Port}`);
      });
   })
   .catch((err) => {
      console.log("Error in DB connection", err);
      process.exit(1);
   });
