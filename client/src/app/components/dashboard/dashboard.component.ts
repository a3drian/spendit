import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Services:
import { DepositsService } from 'src/app/services/deposits.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
	isLoading: boolean = true;

	errorResponse: HttpErrorResponse | null = null;
	today: Date = new Date();

	deposits: any;
	totalAmount!: number;

	constructor(
		private router: Router,
		private depositsService: DepositsService
	) { }

	ngOnInit(): void {
		this.depositsService
			.getDepositsByOwner('adi@foodspy.com')
			.subscribe(
				(deposits: IDeposit[]) => {
					this.deposits = deposits;
					this.totalAmount = this.depositsService.getTotalAmount(this.deposits);
					this.isLoading = false;
				}
			);
	}

	navigateToSpendPage(): void {
		const spendUrl = Constants.appEndpoints.SPEND_URL;
		this.router
			.navigateByUrl(spendUrl)
			.catch((error) => { log('dashboard.ts', this.navigateToSpendPage.name, `Could not navigate to: ${spendUrl}`, error); });
	}

	viewDeposit(deposit: IDeposit): void {
		log('dashboard.ts', this.viewDeposit.name, 'deposit:', deposit._id);

		const viewUrl = `${Constants.appEndpoints.VIEW_URL}/${deposit._id}`;
		this.router
			.navigateByUrl(viewUrl)
			.catch((error) => { log('dashboard.ts', this.navigateToSpendPage.name, `Could not navigate to: ${viewUrl}`, error); });
	}

	deleteDeposit(deposit: IDeposit): void {
		log('dashboard.ts', this.deleteDeposit.name, 'deposit:', deposit._id);

		// ask for user confirmation before deleting

		this.depositsService
			.deleteDeposit(deposit._id)
			.subscribe();
	}
}
