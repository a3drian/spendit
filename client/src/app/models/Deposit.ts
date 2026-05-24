import { IDeposit } from '@a3drian/spendit-shared';

export class Deposit implements IDeposit {
	_id!: string;

	owner!: string;

	amount!: number;
	currency!: string;

	details!: string;
	createdAt!: Date;

	category!: string;

	refundable?: boolean;
	refunded?: boolean;

	public constructor(partial?: Partial<Deposit>) {
		Object.assign(this, partial);
	}
}

export class DepositDTO {
	id?: string;

	owner?: string;

	amount?: number;
	currency?: string;

	details?: string;
	createdAt?: Date;

	category?: string;

	refundable?: boolean;
	refunded?: boolean;

	public constructor(partial?: Partial<DepositDTO>) {
		Object.assign(this, partial);
	}
}
