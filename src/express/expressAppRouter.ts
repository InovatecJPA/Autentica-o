// adapters/ExpressAppRouter.ts
import { Router } from 'express';
import { IAppRouter } from '../interfaces/appInterface';

export class ExpressAppRouter implements IAppRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }
    put(path: string, middleware: any): void {
        throw new Error('Method not implemented.');
    }
    delete(path: string, middleware: any): void {
        throw new Error('Method not implemented.');
    }
    patch(path: string, middleware: any): void {
        throw new Error('Method not implemented.');
    }
    options(path: string, middleware: any): void {
        throw new Error('Method not implemented.');
    }
    head(path: string, middleware: any): void {
        throw new Error('Method not implemented.');
    }
    all(path: string, middleware: any): void {
        throw new Error('Method not implemented.');
    }

  use(middleware: any): void {
    this.router.use(middleware);
  }

  post(path: string, handler: any): void {
    this.router.post(path, handler);
  }

  get(path: string, handler: any): void {
    this.router.get(path, handler);
  }

  getExpressRouter(): Router {
    return this.router;
  }
}
