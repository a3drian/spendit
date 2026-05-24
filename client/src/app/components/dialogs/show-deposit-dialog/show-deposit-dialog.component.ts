import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IDeposit } from '@a3drian/spendit-shared';
// Models:
import { DepositDTO } from 'src/app/models/Deposit';
// Services:
import { CategoriesService } from 'src/app/services/categories.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { InformationService } from 'src/app/services/information.service';
// Validators:
import { positiveNumberValidator } from 'src/app/shared/validators/positiveNumberValidator';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CATEGORY } from 'src/app/shared/constants/Categories';
import { CURRENCY } from 'src/app/shared/constants/Currencies';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-show-deposit-dialog',
	templateUrl: './show-deposit-dialog.component.html',
	styleUrls: ['./show-deposit-dialog.component.scss']
})
export class ShowDepositDialogComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	CLASS_NAME = 'show-deposit-dialog.ts';

	inEditMode: boolean = false;
	isFormReady: boolean = false;

	canSubmit: boolean = true;

	depositForm: FormGroup = new FormGroup({});

	formDefaults = Constants.formDefaults;
	formPlaceholders = Constants.formPlaceholders;

	categories: CATEGORY[] = [];
	currencies: CURRENCY[] = [];

	today: Date = new Date();

	titleText: string = '';

	amountErrors = Constants.amountErrors;
	detailsErrors = Constants.detailsErrors;
	amountErrorMessage: string = Constants.amountErrors.empty;
	detailsErrorMessage: string = Constants.detailsErrors.empty;

	depositChanged$ = signal(false);

	constructor(
		@Inject(MAT_DIALOG_DATA) public deposit: IDeposit,
		public dialogReference: MatDialogRef<ShowDepositDialogComponent>,
		private formBuilder: FormBuilder,
		private informationService: InformationService,
		private categoriesService: CategoriesService,
		private currenciesService: CurrenciesService
	) {
		this.categories = this.categoriesService.getCategories();
		this.currencies = this.currenciesService.getCurrencies();
	}

	ngOnInit(): void {
		this.deposit === null ? this.intializeAddPage() : this.initializeEditPage();
		this.formValueChanged();
	}

	isFormValid(): boolean { return this.depositForm.valid; }

	save(): void {
		const updatedDeposit: IDeposit = this.getFormContents(this.deposit);
		this.updateTotalAmount(
			this.deposit.amount.toString(),
			updatedDeposit.amount.toString(),
			this.deposit.currency as CURRENCY,
			updatedDeposit.currency as CURRENCY
		);
		const changed = this.depositChanged$();
		if (changed) { this.saveDeposit(updatedDeposit); }
	}

	add(): void {
		const newDeposit: IDeposit = this.getFormContents(null);
		const initialValuesNewDeposit = { amount: 0, currency: CURRENCY.LEI };
		this.updateTotalAmount(
			initialValuesNewDeposit.amount.toString(),
			newDeposit.amount.toString(),
			initialValuesNewDeposit.currency,
			newDeposit.currency as CURRENCY
		);
		this.saveDeposit(newDeposit);
	}

	// Form validation:
	isInputValid(inputName: string): boolean {
		return this.depositForm.controls[`${inputName}`].valid;
	}

	isAmountValid(): boolean {
		const control = this.depositForm.controls['amount'];
		const errors = control.errors;
		if (!errors) { return true; }
		const required = errors['required'];
		if (required) { this.amountErrorMessage = this.amountErrors.empty; }
		const negative = errors['negative'];
		if (negative) { this.amountErrorMessage = this.amountErrors.negativeValue; }
		return control.valid;
	}

	isDetailsValid(): boolean {
		const control = this.depositForm.controls['details'];
		const errors = control.errors;
		if (!errors) { return true; }
		const required = errors['required'];
		if (required) { this.detailsErrorMessage = this.detailsErrors.empty; }
		const tooLong = errors['maxlength'];
		if (tooLong) { this.detailsErrorMessage = this.detailsErrors.tooLong; }
		return control.valid;
	}

	hasDepositChanged(): boolean {
		if (this.isFormValid()) {
			if (this.depositChanged$() === true) {
				return true;
			}
		}
		return false;
	}

	private intializeAddPage(): void {
		this.titleText = 'Add new';
		this.inEditMode = false;
		this.initializeEmptyForm();

		this.isFormReady = true;
	}

	private initializeEditPage(): void {
		this.titleText = 'View or edit';
		this.inEditMode = true;
		this.initializeEditableForm();

		this.isFormReady = true;
	}

	private initializeDepositForm(
		initial: IDeposit | { amount: number, currency: CURRENCY, details: string, category: CATEGORY, refundable: boolean, refunded: boolean },
		initialDate: Date
	): void {

		const amount = new FormControl<number>(initial.amount, [Validators.required, Validators.min(0), positiveNumberValidator()]);
		const currency = new FormControl<string>(initial.currency, [Validators.required]);
		const details = new FormControl<string>(initial.details, [Validators.required, Validators.maxLength(30)]);
		const createdAt = new FormControl<string>(initialDate.toISOString().split('T')[0], [Validators.required]);
		const category = new FormControl<string>(initial.category, [Validators.required]);
		const refundable = new FormControl<boolean | undefined>(initial.refundable);
		const refunded = new FormControl<boolean | undefined>(initial.refunded);

		this.depositForm = this.formBuilder
			.group(
				{
					amount: amount,
					currency: currency,
					details: details,
					createdAt: createdAt,
					category: category,
					refundable: refundable,
					refunded: refunded
				}
			);
	}

	private initializeEmptyForm(): void {
		this.initializeDepositForm(this.formDefaults, this.today);
		log(this.CLASS_NAME, this.initializeEmptyForm.name, 'initialized empty form:', this.depositForm.value);
	}

	private initializeEditableForm(): void {
		this.initializeDepositForm(this.deposit, new Date(this.deposit.createdAt));
		log(this.CLASS_NAME, this.initializeEditableForm.name, 'initialized editable form:', this.depositForm.value);
	}

	private updateTotalAmount(oldAmount: string, newAmount: string, oldCurrency: CURRENCY, newCurrency: CURRENCY): void {
		if (!oldAmount || !newAmount) { return; }
		const totalAmount = this.informationService.totalAmount$();

		const oAmount = Number(oldAmount);
		const nAmount = Number(newAmount);

		if (oldCurrency === newCurrency) {
			switch (oldCurrency) {
				case CURRENCY.EUR: {
					totalAmount.EUR = (totalAmount.EUR - oAmount) + nAmount;
					break;
				}
				case CURRENCY.GBP: {
					totalAmount.GBP = (totalAmount.GBP - oAmount) + nAmount;
					break;
				}
				case CURRENCY.USD: {
					totalAmount.USD = (totalAmount.USD - oAmount) + nAmount;
					break;
				}
				default: {
					totalAmount.LEI = (totalAmount.LEI - oAmount) + nAmount;
				}
			}
		} else {
			// first, substract from INITIAL value and INITIAL currency
			// second, add new value to new currency
			// cases where you only have 2 deposits, one in £ and one in €
			// eg, (£58, 0€) => £10 to 10€ => 58 - 10 = £48, 0 + 10 = 10€
			// eg, (£48, 10€) => 10€ to £10 => 10 - 10 = €0, 48 + 10 = £58
			// eg, (£58, 0€) => £10 to 100€ => 58 - 10 = £48, 0 + 100 = 100€
			// eg, (£48, 10€) => 10€ to £100 => 10 - 10 = 0€, 48 + 100 = £158
			// eg, (£53, 0€) => £3 to 1€ => 53 - 3 = £50, 0 + 1 = 1€
			// cases where one deposits is made up of many smaller £ deposits
			// eg, (£70 = £53 + £17, 0€) => £17 to 12€ => 17 - 17 = £0, 0 + 12 = 12€ => (£53 = £53 + £0, 12€)

			switch (oldCurrency) {
				case CURRENCY.EUR: {
					totalAmount.EUR = totalAmount.EUR - oAmount;
					break;
				}
				case CURRENCY.GBP: {
					totalAmount.GBP = totalAmount.GBP - oAmount;
					break;
				}
				case CURRENCY.USD: {
					totalAmount.USD = totalAmount.USD - oAmount;
					break;
				}
				default: {
					totalAmount.LEI = totalAmount.LEI - oAmount;
				}
			}

			switch (newCurrency) {
				case CURRENCY.EUR: {
					totalAmount.EUR = totalAmount.EUR + nAmount;
					break;
				}
				case CURRENCY.GBP: {
					totalAmount.GBP = totalAmount.GBP + nAmount;
					break;
				}
				case CURRENCY.USD: {
					totalAmount.USD = totalAmount.USD + nAmount;
					break;
				}
				default: {
					totalAmount.LEI = totalAmount.LEI + nAmount;
				}
			}
		}

		setTimeout(() => { this.informationService.totalAmount$.set(totalAmount); }, Constants.updateTimeout);
	}

	private getFormContents(deposit: IDeposit | null): IDeposit {

		const depositFromForm: DepositDTO = this.depositForm.value as DepositDTO;

		if (deposit) {

			const updatedDeposit = <IDeposit>{
				...depositFromForm,
				_id: this.deposit._id,	// after "Save", DELETE request fails because "id" is "undefined"
			};

			log(this.CLASS_NAME, this.getFormContents.name, 'updated depositFromForm:', updatedDeposit);
			return updatedDeposit;
		} else {

			const newDeposit = depositFromForm as IDeposit;
			newDeposit['owner'] = this.informationService.owner$();

			log(this.CLASS_NAME, this.getFormContents.name, 'new depositFromForm:', newDeposit);
			return newDeposit;
		}
	}

	private formValueChanged() {
		this.depositForm
			.valueChanges
			.subscribe(
				selectedValue => {
					log(this.CLASS_NAME, this.formValueChanged.name, 'selectedValue:', selectedValue);
					this.depositChanged$.set(true);
				}
			);
	}

	private saveDeposit(updatedDeposit: IDeposit): void {
		if (!this.isFormValid()) {
			this.dialogReference.close(null);
		} else {
			log(this.CLASS_NAME, this.saveDeposit.name, 'updatedDeposit:', updatedDeposit);
			this.dialogReference.close(updatedDeposit);
		}
	}
}
