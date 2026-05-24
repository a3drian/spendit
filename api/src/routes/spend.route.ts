import { Router, Response, Request, NextFunction } from 'express';
// Models:
import { IDeposit } from '@a3drian/spendit-shared';
import { Deposit } from '../models/deposit.model';
import { SearchQuery, SearchQueryMonthSort, SearchQuerySort, SearchQueryYearMonthSort, SORT_OPTION } from '../models/search.model';
// Services:
import * as depositService from '../services/deposits.service';
// Shared:
import { log } from '../shared/Logger';
import { STATUS_CODES } from '@a3drian/spendit-shared';

const CLASS_NAME = 'spend.route.ts';

export { setSpendRoute };

function setSpendRoute(router: Router): Router {
	router.get('/:id', getDepositById);
	router.post('/owner/', getDepositsByOwner);
	router.post('/owner/month/', getDepositsByOwnerCurrentMonth);
	router.post('/owner/yearmonth/', getDepositsByOwnerYearMonth);
	router.post('/owner/spending/', getSpending);
	router.post('/', postDeposit);
	router.put('/:id', putDeposit);
	router.delete('/:id', deleteDeposit);
	return router;
}

async function getDepositById(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit | void | any> {

	const id = req.params.id;

	let response: Error | IDeposit;
	try {
		response = await depositService.getDepositById(id);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function getDepositsByOwner(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit[] | void | any> {
	log(CLASS_NAME, getDepositsByOwner.name, '');

	const body = req.body;
	log(CLASS_NAME, getDepositsByOwner.name, 'body:', body);

	const searchQuery = new SearchQuerySort(
		{
			owner: body.owner,
			sort: body.sort ?? SORT_OPTION.DESC
		}
	);

	let response: Error | IDeposit[];
	try {
		response = await depositService.getDepositsByOwner(searchQuery);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function getSpending(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<{ year: number, month: number }[] | void | any> {
	log(CLASS_NAME, getSpending.name, '');

	const body = req.body;
	log(CLASS_NAME, getSpending.name, 'body:', body);

	const searchQuery = new SearchQuery({ owner: body.owner });

	let response: Error | { year: number, month: number }[];
	try {
		response = await depositService.getSpending(searchQuery);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function getDepositsByOwnerCurrentMonth(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit[] | void | any> {
	log(CLASS_NAME, getDepositsByOwnerCurrentMonth.name, '');

	const body = req.body;
	log(CLASS_NAME, getDepositsByOwnerCurrentMonth.name, 'body:', body);

	const searchQuery = new SearchQueryMonthSort(
		{
			owner: body.owner,
			currentMonth: body.currentMonth ?? 0,
			sort: body.sort ?? SORT_OPTION.DESC
		}
	);

	let response: Error | IDeposit[];
	try {
		response = await depositService.getDepositsByOwnerCurrentMonth(searchQuery);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function getDepositsByOwnerYearMonth(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit[] | void | any> {
	log(CLASS_NAME, getDepositsByOwnerYearMonth.name, '');

	const body = req.body;
	log(CLASS_NAME, getDepositsByOwnerYearMonth.name, 'body:', body);

	const searchQuery = new SearchQueryYearMonthSort(
		{
			owner: body.owner,
			year: body.year ?? 1970,
			month: body.month ?? 0,
			sort: body.sort ?? SORT_OPTION.DESC
		}
	);

	log(CLASS_NAME, getDepositsByOwnerYearMonth.name, 'searchQuery:', searchQuery);

	let response: Error | IDeposit[];
	try {
		response = await depositService.getDepositsByOwnerYearMonth(searchQuery);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function postDeposit(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit | void | any> {
	log(CLASS_NAME, postDeposit.name, '');

	const body = req.body;
	log(CLASS_NAME, postDeposit.name, 'body:', body);

	const newDeposit = new Deposit(
		{
			owner: body.owner,
			amount: body.amount,
			currency: body.currency,
			details: body.details,
			createdAt: body.createdAt,
			category: body.category,
			refundable: body.refundable,
			refunded: body.refunded
		}
	);

	let response: Error | IDeposit;
	try {
		response = await depositService.postDeposit(newDeposit);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.CREATED)
		.json(response)
		.end();
}

async function putDeposit(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit | void | any> {
	log(CLASS_NAME, putDeposit.name, '');

	const id = req.params.id;
	const body = req.body;

	log(CLASS_NAME, putDeposit.name, 'body:', body);

	const editedDeposit = new Deposit(
		{
			owner: body.owner,
			amount: body.amount,
			currency: body.currency,
			details: body.details,
			createdAt: body.createdAt,
			category: body.category,
			refundable: body.refundable,
			refunded: body.refunded
		}
	);

	let response: Error | IDeposit;
	try {
		response = await depositService.putDeposit(id, editedDeposit);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function deleteDeposit(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | any> {

	const id = req.params.id;

	let response: Error | IDeposit;
	try {
		response = await depositService.deleteDeposit(id);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}
