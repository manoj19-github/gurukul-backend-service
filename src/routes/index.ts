import { Application } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { UserRoute } from './user.route';
import { CourseRoute } from './course.route';
import { MasterRoute } from './master.route';

class RoutesMain {
	private routes: Routes[] = [new UserRoute(), new CourseRoute(), new MasterRoute()]; // add all routes  here
	constructor() {}
	public initializeAllRoutes(app: Application) {
		this.routes.forEach((route) => {
			app.use('/api/v1', route.router);
		});
	}
}

export default RoutesMain;
