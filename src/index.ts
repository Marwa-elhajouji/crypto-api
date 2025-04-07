import { PORT } from "../src/config/env";
import express from "express";
import router from "./routes/api";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(express.json());
app.use("/", router);
app.use(errorHandler);

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
