import express, { Request, Response } from "express";
import { MessageBuilderController } from "../controllers/message-builder.controller";

const messageBuilderController = new MessageBuilderController();

const router = express.Router();

router.get("/", (req: Request, res: Response) => messageBuilderController.getMessage(req, res));

export default router;