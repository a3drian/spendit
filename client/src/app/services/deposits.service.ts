import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Interfaces:
import { IDeposit } from '@a3drian/spendit-shared';
// Models:
import { SearchOption, SearchOptionYearMonth } from '../models/SearchOption';
// rxjs:
import { Observable, tap } from 'rxjs';
// Shared:
import { Constants } from '../shared/Constants';
import { CURRENCY } from '../shared/constants/Currencies';
import { log } from '../shared/Logger';

@Injectable({
	providedIn: 'root'
})
export class DepositsService {

	private readonly BASE_URL: string = Constants.apiEndpoints.SPEND_BASE_URL;
	private readonly SEARCH_BY_OWNER_URL: string = this.BASE_URL + Constants.apiEndpoints.SEARCH_BY_OWNER_URL;
	private readonly SEARCH_BY_OWNER_MONTH_URL: string = this.BASE_URL + Constants.apiEndpoints.SEARCH_BY_OWNER_MONTH_URL;
	private readonly SEARCH_BY_OWNER_YEAR_MONTH_URL: string = this.BASE_URL + Constants.apiEndpoints.SEARCH_BY_OWNER_YEAR_MONTH_URL;
	private readonly SPENDING_URL: string = this.BASE_URL + Constants.apiEndpoints.SPENDING_URL;

	private readonly CLASS_NAME = 'deposits.service.ts';

	constructor(
		private http: HttpClient
	) { }

	validId(id: string): boolean {
		log(this.CLASS_NAME, this.validId.name, 'id:', id);
		return true;
	}

	getDepositsById(id: string): Observable<IDeposit> {
		const url = `${this.BASE_URL}/${id}`;

		log(this.CLASS_NAME, this.getDepositsById.name, 'url:', url);

		const request = this.http
			.get<IDeposit>(url)
			.pipe(tap(() => { }));

		return request;
	}

	getDepositsByOwner(
		email: string
	): Observable<IDeposit[]> {
		log(this.CLASS_NAME, this.getDepositsByOwner.name, 'email:', email);

		const request = this.http
			.post<IDeposit[]>(
				this.SEARCH_BY_OWNER_URL,
				new SearchOption({ owner: email })
			)
			.pipe(tap(() => { }));

		return request;
	}

	getDepositsByOwnerCurrentMonth(
		email: string,
		currentMonth: number
	): Observable<IDeposit[]> {
		log(this.CLASS_NAME, this.getDepositsByOwnerCurrentMonth.name, 'email:', email);
		log(this.CLASS_NAME, this.getDepositsByOwnerCurrentMonth.name, 'currentMonth:', currentMonth);

		const request = this.http
			.post<IDeposit[]>(
				this.SEARCH_BY_OWNER_MONTH_URL,
				new SearchOption({ owner: email, currentMonth: currentMonth })
			)
			.pipe(tap(() => { }));

		return request;
	}

	getDepositsByOwnerYearMonth(
		email: string,
		year: number,
		month: number
	): Observable<IDeposit[]> {
		log(this.CLASS_NAME, this.getDepositsByOwnerYearMonth.name, 'email:', email);
		log(this.CLASS_NAME, this.getDepositsByOwnerYearMonth.name, 'year:', year);
		log(this.CLASS_NAME, this.getDepositsByOwnerYearMonth.name, 'month:', month);

		const request = this.http
			.post<IDeposit[]>(
				this.SEARCH_BY_OWNER_YEAR_MONTH_URL,
				new SearchOptionYearMonth(
					{
						owner: email,
						year: year,
						month: month
					}
				)
			)
			.pipe(tap(() => { }));

		return request;
	}

	getSpending(
		email: string
	): Observable<{ year: number, month: number }[]> {
		log(this.CLASS_NAME, this.getSpending.name, 'email:', email);

		const request = this.http
			.post<{ year: number, month: number }[]>(
				this.SPENDING_URL,
				new SearchOption({ owner: email })
			)
			.pipe(tap(() => { }));

		return request;
	}

	postDeposit(
		deposit: Partial<IDeposit>
	) {
		log(this.CLASS_NAME, this.postDeposit.name, 'deposit:', deposit);

		const request = this.http
			.post<IDeposit>(
				this.BASE_URL,
				deposit
			)
			.pipe(tap(() => { }));

		return request;
	}

	putDeposit(
		id: string,
		deposit: Partial<IDeposit>
	) {
		const url = `${this.BASE_URL}/${id}`;

		log(this.CLASS_NAME, this.putDeposit.name, 'url:', url);

		const request = this.http
			.put<IDeposit>(
				url,
				deposit
			)
			.pipe(tap(() => { }));

		return request;
	}

	deleteDeposit(id: string) {
		const url = `${this.BASE_URL}/${id}`;

		log(this.CLASS_NAME, this.deleteDeposit.name, 'url:', url);

		const request = this.http
			.delete<IDeposit>(url)
			.pipe(tap(() => { }));

		return request;
	}

	getTotalAmount(deposits: IDeposit[], currency: CURRENCY = CURRENCY.LEI): number {
		let total = 0;
		const result = this.getDepositsByCurrency(deposits, currency);
		result.forEach((deposit: IDeposit) => { total += deposit.amount; });
		return total;
	}

	private getDepositsByCurrency(deposits: IDeposit[], currency: CURRENCY = CURRENCY.LEI): IDeposit[] {
		const result = deposits.filter(d => d.currency === currency);
		return result;
	}

}
