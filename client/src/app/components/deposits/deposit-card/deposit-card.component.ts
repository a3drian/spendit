import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// Components:
import { DeleteDepositDialogComponent } from '../../dialogs/delete-deposit-dialog/delete-deposit-dialog.component';
import { ShowDepositDialogComponent } from '../../dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Interfaces:
import { IDeposit } from '@a3drian/spendit-shared';
// rxjs:
import { Subscription } from 'rxjs';
// Services:
import { DepositsService } from 'src/app/services/deposits.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-deposit-card',
	templateUrl: './deposit-card.component.html',
	styleUrls: ['./deposit-card.component.scss']
})
export class DepositCardComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	@Input() deposit: IDeposit = <IDeposit>{};

	depositId: string = '';

	deleted: boolean = false;

	deleteDepositDialogSub: Subscription = new Subscription();
	showDepositDialogSub: Subscription = new Subscription();

	constructor(
		private depositsService: DepositsService,
		public deleteDepositDialog: MatDialog,
		public showDepositDialog: MatDialog
	) { }

	ngOnInit(): void { this.depositId = this.deposit._id; }

	ngOnDestroy() {
		if (this.deleteDepositDialogSub) { this.deleteDepositDialogSub.unsubscribe(); }
		if (this.showDepositDialogSub) { this.showDepositDialogSub.unsubscribe(); }
	}

	deleteDeposit(deposit: IDeposit): void {
		log('deposit-card.ts', this.deleteDeposit.name, 'deposit:', deposit._id);

		this.depositsService
			.deleteDeposit(deposit._id)
			.subscribe();
	}

	saveDeposit(deposit: IDeposit): void {
		log('deposit-card.ts', this.saveDeposit.name, 'depositId:', this.depositId);
		log('deposit-card.ts', this.saveDeposit.name, 'deposit:', deposit);

		this.depositsService
			.putDeposit(this.depositId, deposit)
			.subscribe(
				() => {
					this.deposit = deposit;
					// this.updateAmount(deposit);
				}
			);
	}

	getShowDepositDialogRef(deposit: IDeposit): MatDialogRef<ShowDepositDialogComponent> {
		return this.showDepositDialog
			.open(
				ShowDepositDialogComponent,
				{
					data: deposit,
					panelClass: 'custom-view-deposit-dialog-container',
					width: Constants.dialogDimensions.width
				}
			);
	}

	getDeleteDepositDialogRef(deposit: IDeposit): MatDialogRef<DeleteDepositDialogComponent> {
		return this.deleteDepositDialog
			.open(
				DeleteDepositDialogComponent,
				{
					data: deposit,
					panelClass: 'custom-delete-deposit-dialog-container',
					width: Constants.dialogDimensions.width
				}
			);
	}

	openShowDepositDialog(deposit: IDeposit): void {
		log('deposit-card.ts', this.openShowDepositDialog.name, 'Selected deposit:', deposit);

		const dialogRef = this.getShowDepositDialogRef(deposit);
		this.showDepositDialogSub = dialogRef
			.afterClosed()
			.subscribe(
				(d: IDeposit) => {
					log('deposit-card.ts', this.openShowDepositDialog.name, 'Deposit from dialog:', d);
					if (d) {
						this.saveDeposit(d);
					}
				}
			);
	}

	openDeleteDepositDialog(deposit: IDeposit): void {
		log('deposit-card.ts', this.openDeleteDepositDialog.name, 'Selected deposit:', deposit);

		const dialogRef = this.getDeleteDepositDialogRef(deposit);
		this.deleteDepositDialogSub = dialogRef
			.afterClosed()
			.subscribe(
				(canDelete: boolean) => {
					log('deposit-card.ts', this.openDeleteDepositDialog.name, 'canDelete:', canDelete);
					if (canDelete) {
						setTimeout(() => { this.deleted = true; }, Constants.updateTimeout);
						this.deleteDeposit(deposit);
					}
				}
			);
	}
}
