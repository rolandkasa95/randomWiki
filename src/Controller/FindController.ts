import { Request, Response } from "express";
import { FindService } from "../Service/FindService";

export class FindController {
    public async getOneRandom(req: Request, res: Response): Promise<void> {
        const result = await FindService.getOneRandom();

        return res.render("index", { ...result });
    }

    public async getOneFromCategory(req: Request, res: Response): Promise<void> {
        const category = req?.query?.category;
        const result = await FindService.getOneFromCategory(category);
        return res.render("index", { ...result, category });
    }
}
