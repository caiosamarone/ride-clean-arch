import express, { Request, Response } from 'express';
import cors from 'cors';

// Framework and Driver

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](
      url.replace(/\{|\}/g, ''),
      async function (req: Request, res: Response) {
        try {
          const output = await callback(req.params, req.body);
          res.json(output);
        } catch (e: any) {
          res.status(422).json({ message: e.message });
        }
      }
    );
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
