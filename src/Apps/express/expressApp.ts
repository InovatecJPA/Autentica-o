// adapters/ExpressApp.ts
import express, { Application } from 'express';
import { IApp, IAppAdapter, IAppRouter } from '../../interfaces/appInterface';
import ExpressRouter from './ExpressRouter';
import ExpressAppAdapter from './expressAdapter';

export class ExpressApp implements IApp {
  router: IAppRouter
  adapter: IAppAdapter
  private app: Application;

  constructor() {
    this.app = express();
    this.router = new ExpressRouter
    this.adapter = new ExpressAppAdapter
  }

  use(middleware: any): void {
    this.app.use(middleware);
  }

  useRoute(path: string, middleware: any): void {
    this.app.use(path, middleware);
  }

  start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  getExpressApp(): Application {
    return this.app;
  }
}
