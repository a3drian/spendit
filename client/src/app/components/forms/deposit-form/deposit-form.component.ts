import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { Currency } from 'net-worth-shared';
import { Deposit } from 'src/app/models/Deposit';
// Services:
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { LocationsService } from 'src/app/services/locations.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CATEGORIES } from 'src/app/shared/constants/Categories';
import { CITIES } from 'src/app/shared/constants/Cities';
import { CURRENCIES } from 'net-worth-shared';
import { LOCATIONS } from 'src/app/shared/constants/Locations';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-deposit-form',
	templateUrl: './deposit-form.component.html',
	styleUrls: ['./deposit-form.component.scss']
})
export class DepositFormComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	depositForm: FormGroup = new FormGroup({});
	canEdit: boolean = false;
	ready: boolean = false;

	@Input()
	deposit!: IDeposit;

	currencies: Currency[] = [];
	categories: CATEGORIES[] = [];
	cities: CITIES[] = [];
	locations: LOCATIONS[] = [];

	constructor(
		private depositsService: DepositsService,
		private categoriesService: CategoriesService,
		private citiesService: CitiesService,
		private currenciesService: CurrenciesService,
		private locationsService: LocationsService,
		private formBuilder: FormBuilder,
		private router: Router
	) {

		this.currencies = this.currenciesService.getCurrencies();
		this.categories = this.categoriesService.getCategories();
		this.cities = this.citiesService.getCities();
		this.locations = this.locationsService.getLocations();
	}

	ngOnInit(): void {
		log('deposit-form.ts', this.ngOnInit.name, 'this.deposit:', this.deposit);
		this.initializeForm();
		this.ready = true;
	}

	private initializeForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [this.deposit.amount, Validators.required],
					details: [this.deposit.details],
					createdAt: [new Date(this.deposit.createdAt).toISOString().split('T')[0], Validators.required],
					category: [this.deposit.category],
					location: [this.deposit.location],
					city: [this.deposit.city]
				}
			);
	}

	enableEditing(): void {
		this.canEdit = !this.canEdit;
	}

	save(): void {
		this.canEdit = !this.canEdit;
	}

}