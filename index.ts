import express, { Application, urlencoded, json, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './app/http/middlewares/errorHandler.middleware';

class ExpressApp {
	app: Application;
	PORT: unknown;
	constructor() {
		this.app = express();
		this.PORT = process.env.PORT ?? 5000;
		this.middleware();
		this.routes();
	}
	private middleware(): void {
		this.app.use(cors({ credentials: true, origin: '*', methods: 'GET,POST,PUT,DELETE' }));
		this.app.use(urlencoded({ extended: true, limit: '50mb' }));
		this.app.use(json({ limit: '50mb' }));
		this.app.use(helmet());
		this.app.use(morgan('dev'));
	}
	private routes(): void {
		this.app.get('/', (req: Request, res: Response) => {
			return res.send('<h2>Server is running .....</h2>');
		});

		// put this at the last of all routes
		this.app.use(notFound);
		this.app.use(errorHandler);
	}
	public listen(): void {
		// connectDB();
		this.app.listen(this.PORT, () => {
			console.log(`Server is listening on  port : ${this.PORT}`);
		});
	}
}
config();
const server = new ExpressApp();
server.listen();