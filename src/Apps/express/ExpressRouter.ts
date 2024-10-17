import { Router } from 'express';
import { IApp, IAppRouter } from '../../interfaces/appInterface';

class ExpressRouter implements IAppRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    public post(path: string, middleware: any): void {
        this.router.post(path, middleware);
    }

    public get(path: string, middleware: any): void {
        this.router.get(path, middleware);
    }

    public put(path: string, middleware: any): void {
        this.router.put(path, middleware);
    }

    public delete(path: string, middleware: any): void {
        this.router.delete(path, middleware);
    }

    public patch(path: string, middleware: any): void {
        this.router.patch(path, middleware);
    }

    public options(path: string, middleware: any): void {
        this.router.options(path, middleware);
    }

    public head(path: string, middleware: any): void {
        this.router.head(path, middleware);
    }

    public all(path: string, middleware: any): void {
        this.router.all(path, middleware);
    }

    public use(...args: any[]): void {
        this.router.use(...args);
    }

    public getRouter(): IAppRouter {
        return this.router as unknown as IAppRouter;
    }



}

export default ExpressRouter;
