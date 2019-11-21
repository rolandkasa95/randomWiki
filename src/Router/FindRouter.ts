import { Request, Response, Router } from "express";
import { FindController } from "../Controller/FindController";
import { IRouter } from "../Interface/RouterInterface";
import { BaseRouter } from "./BaseRouter";

export default class FindRouter extends BaseRouter implements IRouter {
    private controller: FindController;

    constructor() {
        super();
        this.controller = new FindController();
    }

    public get = (): Router => {
        this.router.get("/", this.getRandom.bind(this));
        return this.router;
    }

    public getRandom(req: Request, res: Response): void {
        if ( req?.query?.category ) {
            this.controller.getOneFromCategory(req, res);
            return;
        }

        this.controller.getOneRandom(req, res);
    }
}
