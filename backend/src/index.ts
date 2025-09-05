import express from "express";
import dotenv from "dotenv";
import messageRoutes from "./routers/message-builder.route"


dotenv.config();

const app = express();

app.use(express.json());

app.use("/message", messageRoutes);

app.listen(process.env.PORT, () => console.log(`http://locahost:3000`));