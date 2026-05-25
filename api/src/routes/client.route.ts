import path from 'path';
import { Router, Response, Request, NextFunction } from 'express';
import { env } from '../env';

export { setClientRoute };

function setClientRoute(router: Router): Router {
	router.get('/', getClient);
	return router;
}

async function getClient(
	_req: Request,
	res: Response,
	_next: NextFunction
) {

	const indexPath = path
		.join(
			__dirname,
			'..',
			'..',
			`${env.CLIENT_PATH}`,
			'index.html'
		);

	res.sendFile(indexPath);
	return res;
}
