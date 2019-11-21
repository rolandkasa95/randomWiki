import express, { Router } from "express";

export abstract class BaseRouter {
    public router: Router;

    constructor() {
        this.router = express.Router();
    }
}
