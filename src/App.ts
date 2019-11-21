import bodyParser from "body-parser";
import express, { Application } from "express";
import FindRouter from "./Router/FindRouter";

class App {
    private app: Application;
    private routePool: any;

    constructor() {
        this.app = express();
        this.app.use(bodyParser());
        this.app.set("view engine", "pug");
        this.routePool = {
            findRouter: new FindRouter()
        };
        this.initialize();
    }

    private initialize(): void {
        this.registerRoutes();
        this.app.listen(3000);
    }

    private registerRoutes(): void {
        this.app.use(this.routePool.findRouter.get());
    }
}

export default new App();
