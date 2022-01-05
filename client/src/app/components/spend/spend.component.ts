import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Interfaces:
import { Currency } from 'src/app/models/Currency';
import { IDeposit } from 'net-worth-shared';
// Models:
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
import { CURRENCIES } from 'src/app/shared/constants/Currencies';
import { LOCATIONS } from 'src/app/shared/constants/Locations';

@Component({
	selector: 'app-spend',
	templateUrl: './spend.component.html',
	styleUrls: ['./spend.component.scss']
})
export class SpendComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	DASHBOARD_URL = '/' + Constants.appEndpoints.DASHBOARD_URL;

	depositForm: FormGroup;

	currencies: Currency[] = [];
	categories: CATEGORIES[] = [];
	cities: CITIES[] = [];
	locations: LOCATIONS[] = [];

	defaultAmount = 10;
	defaultCurrency = CURRENCIES.LEI;
	defaultCreatedAt = new Date().toISOString().split('T')[0];
	defaultExchangeRate = 1;
	defaultCategory = CATEGORIES.GROCERIES;
	defaultLocation = LOCATIONS.SELGROS;
	defaultCity = CITIES.BRASOV;

	constructor(
		private depositsService: DepositsService,
		private categoriesService: CategoriesService,
		private citiesService: CitiesService,
		private currenciesService: CurrenciesService,
		private locationsService: LocationsService,
		private formBuilder: FormBuilder,
		private router: Router
	) {

		console.log(this.defaultCurrency);
		console.log(this.defaultCategory);
		this.currencies = this.currenciesService.getCurrencies();
		this.categories = this.categoriesService.getCategories();
		this.cities = this.citiesService.getCities();
		this.locations = this.locationsService.getLocations();
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [this.defaultAmount, Validators.required],
					currency: [this.defaultCurrency, Validators.required],
					createdAt: [this.defaultCreatedAt, Validators.required],
					exchangeRate: [this.defaultExchangeRate],
					category: [this.defaultCategory],
					recurrent: [false],
					location: [this.defaultLocation],
					city: [this.defaultCity]
				}
			);
	}

	ngOnInit(): void { }

	spendDeposit(): void {
		const depositFromForm = this.depositForm.value;
		const deposit: IDeposit = new Deposit({
			owner: 'adi@foodspy.com',
			amount: depositFromForm.amount,
			currency: depositFromForm.currency.symbol,
			createdAt: depositFromForm.createdAt,
			exchangeRate: depositFromForm.exchangeRate,
			category: depositFromForm.category,
			recurrent: depositFromForm.recurrent,
			location: depositFromForm.location,
			city: depositFromForm.city
		});
		this.depositsService
			.postDeposit(deposit)
			.subscribe();
	}

	redirect(): void {
		this.router.navigate([this.DASHBOARD_URL]);
	}

}