// adapters/ExpressApp.ts
import express, { Application } from 'express';
import { IApp } from '../interfaces/appInterface';

export class ExpressApp implements IApp {
  private app: Application;

  constructor() {
    this.app = express();
  }

  use(middleware: any): void {
    this.app.use(middleware);
  }

  start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  // Expose the underlying Express app if needed
  getExpressApp(): Application {
    return this.app;
  }
}
