import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import path from 'path';
import { authenticateToken } from "./middlewares/tokenMiddleware";
import { authenticateIP } from "./middlewares/ipMiddleware";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(cors());
app.use(express.json());
// app.all('*', authenticateIP);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.use("/api", authenticateToken, router);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))