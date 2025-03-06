import app from "./app.js";
import mongoose from "mongoose";
import { config } from "dotenv";

config(); 

const database = process.env.DATABASE;
const port = process.env.PORT || 4000;

if (!database) {
  console.error("Database URI is missing in .env!");
  process.exit(1);
}

mongoose
  .connect(database)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
