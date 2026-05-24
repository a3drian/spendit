import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// Components:
import { ShowDepositDialogComponent } from '../dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Interfaces:
import { IDeposit } from '@a3drian/spendit-shared';
import { IUser } from 'src/app/interfaces/IUser';
// Models:
import { Currency } from 'src/app/models/Currency';
// rxjs:
import { BehaviorSubject, merge, Subscription, switchMap } from 'rxjs';
// Services:
import { AuthService } from 'src/app/services/auth.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { InformationService } from 'src/app/services/information.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CURRENCY } from 'src/app/shared/constants/Currencies';
import { getSpendingMonths, getSpendingReport, getSpendingYears, toMonthIndex, toMonthName } from 'src/app/shared/helpers/spendings.helper';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	isLoading: boolean = true;
	isDepositsLoading: boolean = false;

	errorResponse: HttpErrorResponse | null = null;
	today: Date = new Date();

	years!: number[];
	months!: string[];
	showFilters = false;
	spendingReport$ = signal< Map<number, number[]>>(new Map<number, number[]>);

	selectedYear!: string;
	selectedMonth!: string;

	deposits: IDeposit[] = [];
	totalAmount: Currency = { LEI: 0, EUR: 0, GBP: 0, USD: 0 };
	anyMoneySpent: boolean = false;

	owner: string = '';
	user: IUser | null = null;

	showDepositDialogSub: Subscription = new Subscription();
	depositsServiceGetSpendingSub: Subscription = new Subscription();
	depositsServicePostDepositSub: Subscription = new Subscription();
	depositsServiceGetDepositsByOwnerYearMonthSub: Subscription = new Subscription();

	spendingForm: FormGroup = new FormGroup({});

	private get yearFormValue(): number {
		const yearValue = this.spendingForm.controls['years'].value;
		const year = Number(yearValue);
		return year;
	}

	private get monthFormValue(): number {
		const monthValue = this.spendingForm.controls['months'].value;
		const month = toMonthIndex(monthValue);
		return month;
	}

	refreshDeposits$ = new BehaviorSubject(false);
	private get refreshDeposits(): boolean {
		return this.refreshDeposits$.value;
	}
	private set refreshDeposits(value: boolean) {
		this.refreshDeposits$.next(value);
	}

	constructor(
		private depositsService: DepositsService,
		private formBuilder: FormBuilder,
		private informationService: InformationService,
		public showDepositDialog: MatDialog,
		private authService: AuthService
	) {
		this.owner = this.informationService.owner$();
		this.selectedYear = this.today.getFullYear().toString().substring(2);
		this.selectedMonth = toMonthName(this.today.getMonth() + 1);
		this.user = this.authService.user$();

		const years = new FormControl<number>(this.today.getFullYear(), [Validators.required]);
		const months = new FormControl<string>(toMonthName(this.today.getMonth() + 1), [Validators.required]);
		this.spendingForm = this.formBuilder.group({ years: years, months: months });
	}

	ngOnInit(): void {
		this.depositsServiceGetSpendingSub = this.depositsService
			.getSpending(this.owner)
			.subscribe(
				(spendings: { year: number, month: number }[]) => {
					log('dashboard.ts', this.ngOnInit.name, 'Spendings:', spendings);

					this.spendingReport$.set(getSpendingReport(spendings));
					this.years = getSpendingYears(this.spendingReport$());
					this.months = getSpendingMonths(this.spendingReport$(), this.years[this.years.length - 1]).monthNames;
					this.isLoading = false;
				}
			);

		this.reloadDeposits(this.today.getFullYear(), this.today.getMonth());
	}

	ngOnDestroy() {
		if (this.depositsServiceGetDepositsByOwnerYearMonthSub) { this.depositsServiceGetDepositsByOwnerYearMonthSub.unsubscribe(); }
		if (this.depositsServicePostDepositSub) { this.depositsServicePostDepositSub.unsubscribe(); }
		if (this.depositsServiceGetSpendingSub) { this.depositsServiceGetSpendingSub.unsubscribe(); }
		if (this.showDepositDialogSub) { this.showDepositDialogSub.unsubscribe(); }
	}

	openDialog(): MatDialogRef<ShowDepositDialogComponent> {
		return this.showDepositDialog
			.open(
				ShowDepositDialogComponent,
				{
					data: null,
					panelClass: 'custom-view-deposit-dialog-container',
					width: Constants.dialogDimensions.width
				}
			);
	}

	openShowDepositDialog(api: string): void {
		// TODO: use "api" to check for "api/save" or "api/spend"
		const dialogRef = this.openDialog();
		this.showDepositDialogSub = dialogRef
			.afterClosed()
			.subscribe(
				(deposit: IDeposit) => {
					log('dashboard.ts', this.openShowDepositDialog.name, 'Deposit from dialog:', deposit);
					if (deposit) {
						this.saveDeposit(deposit);
					}
				}
			);
	}

	saveDeposit(deposit: IDeposit): void {
		log('dashboard.ts', this.saveDeposit.name, 'deposit:', deposit);

		this.depositsServicePostDepositSub = this.depositsService
			.postDeposit(deposit)
			.subscribe(() => this.refreshDeposits = true);

		// TODO: update "this.spendingReport$" to include the added "year" and/or "month"
	}

	openFilters(): void {
		this.showFilters = !this.showFilters;
	}

	onYearsChange(): void {
		const year = this.yearFormValue;
		log('dashboard.ts', this.onYearsChange.name, 'year:', year);

		// Update list of months available in "months" control, corresponding to the selected year
		const { monthIndexes, monthNames } = getSpendingMonths(this.spendingReport$(), year);
		this.months = monthNames;

		// Update "months" control to the most recent month name
		const mostRecentMonthName = monthNames[monthNames.length - 1];
		this.spendingForm.controls['months'].setValue(mostRecentMonthName);

		// Update "selectedMonth" to the most recent month index
		const mostRecentMonth = monthIndexes[monthIndexes.length - 1];
		this.onFilterChange(year, mostRecentMonth);

		this.reloadDeposits(year, mostRecentMonth);
	}

	onMonthsChange(): void {
		const month = this.monthFormValue;
		log('dashboard.ts', this.onMonthsChange.name, 'month:', month);

		this.onFilterChange(this.yearFormValue, month);

		this.reloadDeposits(this.yearFormValue, month);
	}

	private onFilterChange(year: number, month: number): void {
		this.selectedYear = year.toString().substring(2);
		this.selectedMonth = toMonthName(month + 1);

		log('dashboard.ts', this.onFilterChange.name, 'selectedYear', this.selectedYear);
		log('dashboard.ts', this.onFilterChange.name, 'selectedMonth:', this.selectedMonth);
	}

	private reloadDeposits(year: number, month: number): void {
		this.depositsServiceGetDepositsByOwnerYearMonthSub =
			merge(this.refreshDeposits$)
				.pipe(switchMap(() => {
					this.isDepositsLoading = true;
					return this.depositsService.getDepositsByOwnerYearMonth(this.owner, year, month);
				}))
				.subscribe((deposits: IDeposit[]) => this.loadDeposits(deposits));
	}

	private loadDeposits(deposits: IDeposit[]): void {
		this.deposits = deposits;
		this.totalAmount.LEI = this.depositsService.getTotalAmount(this.deposits);
		this.totalAmount.EUR = this.depositsService.getTotalAmount(this.deposits, CURRENCY.EUR);
		this.totalAmount.GBP = this.depositsService.getTotalAmount(this.deposits, CURRENCY.GBP);
		this.totalAmount.USD = this.depositsService.getTotalAmount(this.deposits, CURRENCY.USD);
		this.anyMoneySpent =
			this.totalAmount.LEI !== 0 ||
			this.totalAmount.EUR !== 0 ||
			this.totalAmount.GBP !== 0 ||
			this.totalAmount.USD !== 0;

		this.updateInformationService();

		setTimeout(() => { this.isDepositsLoading = false; }, Constants.updateTimeout);
	}

	private updateInformationService(): void {
		this.informationService.totalAmount$.set(this.totalAmount);
	}
}
