const ObjectId = require('mongoose').Types.ObjectId;
// Interfaces:
import { IDeposit } from '@a3drian/spendit-shared';
import { ISearchOption } from '@a3drian/spendit-shared';
// Shared:
import { log } from '../shared/Logger';

const CLASS_NAME = 'validator.helper.ts';

export function validId(id: string): boolean {
	if (ObjectId.isValid(id)) {
		if ((String)(new ObjectId(id)) === id) { return true; }
	}

	log(CLASS_NAME, validId.name, `id '${id}' is not valid!`);
	return false;
}

export function validDeposit(deposit: Partial<IDeposit>): boolean {
	if (
		!deposit ||
		typeof deposit !== 'object' ||
		!deposit.owner ||
		!deposit.amount ||
		!deposit.currency ||
		!deposit.details ||
		!deposit.createdAt ||
		!deposit.category
	) {
		log(CLASS_NAME, validDeposit.name, 'partial deposit is not valid!');
		return false;
	}

	return true;
}

export function validSearchQuery(searchQuery: ISearchOption): boolean {
	if (
		!searchQuery ||
		typeof searchQuery !== 'object' ||
		!searchQuery.owner
	) {
		log(CLASS_NAME, validSearchQuery.name, 'search query is not valid!');
		return false;
	}

	return true;
}

export function validOldDeposit(id: string, deposit: Partial<IDeposit>): boolean {
	if (validDeposit(deposit)) {
		if (id === (String)(new ObjectId(deposit._id))) {
			return true;
		}
	}

	log(CLASS_NAME, validOldDeposit.name, 'old deposit (with id) is not valid!');
	return false;
}
