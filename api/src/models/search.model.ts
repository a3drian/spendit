import { ISearchOption, ISearchOptionDateRange } from '@a3drian/spendit-shared';

export type SortOption = 'asc' | 'desc';

export const SORT_OPTION: { ASC: SortOption, DESC: SortOption } = {
	ASC: 'asc',
	DESC: 'desc'
};

export class SearchQuery implements ISearchOption {
	owner!: string;

	public constructor(partial?: Partial<ISearchOption>) {
		Object.assign(this, partial);
	}
}

export class SearchQuerySort implements ISearchOption {
	owner!: string;
	sort: SortOption = SORT_OPTION.ASC;

	public constructor(partial?: Partial<SearchQuerySort>) {
		Object.assign(this, partial);
	}
}

export class SearchQueryMonthSort implements ISearchOption {
	owner!: string;
	currentMonth!: number;
	sort: SortOption = SORT_OPTION.ASC;

	public constructor(partial?: Partial<SearchQueryMonthSort>) {
		Object.assign(this, partial);
	}
}

export class SearchQueryYearMonthSort implements ISearchOption {
	owner!: string;
	year!: number;
	month!: number;
	sort: SortOption = SORT_OPTION.ASC;

	public constructor(partial?: Partial<SearchQueryYearMonthSort>) {
		Object.assign(this, partial);
	}
}

export class SearchQueryDateRange implements ISearchOptionDateRange {
	owner!: string;
	from!: Date;
	to!: Date;

	public constructor(partial?: Partial<ISearchOptionDateRange>) {
		Object.assign(this, partial);
	}
}
