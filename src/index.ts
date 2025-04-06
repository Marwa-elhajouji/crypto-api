import { PORT } from "../src/config/env";
import express from "express";
import router from "./routes/api";

const app = express();

app.use(express.json());
app.use("/", router);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
export default app;
