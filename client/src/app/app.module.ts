import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// Angular Material:
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
// Components:
import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepositCardComponent } from './components/deposits/deposit-card/deposit-card.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
// Dialogs:
import { DeleteDepositDialogComponent } from './components/dialogs/delete-deposit-dialog/delete-deposit-dialog.component';
import { ShowDepositDialogComponent } from './components/dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Firebase:
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
// Guards:
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
// Pipes:
import { AmountPipe } from './shared/pipes/amount.pipe';
import { CurrencyPipe } from './shared/pipes/currency.pipe';
import { UserDisplayNamePipe } from './shared/pipes/userDisplayName.pipe';
// Shared:
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		DepositCardComponent,
		HeaderComponent,
		LoadingSpinnerComponent,
		LoginComponent,
		NotFoundPageComponent,
		DeleteDepositDialogComponent,
		ShowDepositDialogComponent,
		AmountPipe,
		CurrencyPipe,
		UserDisplayNamePipe
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot([
			{ path: '', redirectTo: appRoutes.dashboard.path, pathMatch: 'full' },
			{
				path: appRoutes.dashboard.path, component: DashboardComponent,
				canActivate: [AuthGuard]
			},
			{
				path: appRoutes.login.path, component: LoginComponent,
				canActivate: [LoginGuard]
			},
			{ path: '**', component: NotFoundPageComponent }
		]),
		HttpClientModule,
		FormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatTableModule,
		MatCheckboxModule,
		MatDialogModule,
		NoopAnimationsModule,
		ReactiveFormsModule,
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth())
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
