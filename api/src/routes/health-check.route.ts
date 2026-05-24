import { Router, Response, Request, NextFunction } from 'express';
// Shared:
import { STATUS_CODES } from '@a3drian/spendit-shared';

export { setHealthCheckRoute };

function setHealthCheckRoute(router: Router): Router {
	router.get('/', getHealthCheck);
	return router;
}

async function getHealthCheck(
	_req: Request,
	res: Response,
	_next: NextFunction
) {

	const response = 'API is up and running';

	return res
		.status(STATUS_CODES.OK)
		.json({
			status: STATUS_CODES.OK,
			response: response
		})
		.end();
}
