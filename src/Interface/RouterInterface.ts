export interface IRouter {
    get?(req: Express.Request, res: Express.Response): void;
    put?(req: Express.Request, res: Express.Response): void;
    post?(req: Express.Request, res: Express.Response): void;
    patch?(req: Express.Request, res: Express.Response): void;
    delete?(req: Express.Request, res: Express.Response): void;
}
