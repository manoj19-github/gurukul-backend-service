import { sanitize } from 'class-sanitizer';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exceptions';
const DTOValidationMiddleware =
	(type: any, skipMissingProperties: boolean = false) =>
	(req: Request, res: Response, next: NextFunction) => {
		const dtoObject = plainToInstance(type, req.body);
		validate(dtoObject, { skipMissingProperties })
			.then((errors: ValidationError[]) => {
				if (errors.length > 0) {
					const dtoErrors = errors.map((self: ValidationError) => (Object as any).values(self).join(', ')).join(';');
					return new HttpException(400, dtoErrors);
				} else {
					sanitize(dtoObject);
					req.body = dtoObject;
					next();
				}
			})
			.catch((errors) => {
				console.log('errors:', errors);
				return new HttpException(400, JSON.stringify(errors));
			});
	};
export default DTOValidationMiddleware;
