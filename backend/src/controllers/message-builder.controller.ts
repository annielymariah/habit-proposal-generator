import e, { Request, Response } from "express";
import { MessageBuilderService } from "../services/message-builder.service";
import { RequestBody } from "../types/request-body";

export class MessageBuilderController {
    private readonly messageBuilderService: MessageBuilderService;

    constructor() {
        this.messageBuilderService = new MessageBuilderService();
    }

    public getMessage(req: Request<{}, {}, RequestBody>, res: Response): Response {
        try {
            const message = this.messageBuilderService.getMessage(req.body);
            console.log(message);
            return res.status(200).json(message);
        } catch(error) {
            return res.status(200).json(error);
        }
    }
}
