import { ISearchOption } from '@a3drian/spendit-shared';

export class SearchOption implements ISearchOption {
	owner!: string;
	currentMonth!: number;

	public constructor(partial?: Partial<SearchOption>) {
		Object.assign(this, partial);
	}
}

export class SearchOptionYearMonth implements ISearchOption {
	owner!: string;
	year!: number;
	month!: number;

	public constructor(partial?: Partial<SearchOptionYearMonth>) {
		Object.assign(this, partial);
	}
}
