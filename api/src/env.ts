import dotenv from 'dotenv';
const serviceAccount = require('../.service.account.json');
// Shared:
import { Constants } from './shared/Constants';
import { log } from './shared/Logger';

const config = dotenv.config();
console.log('');
log('env.ts', 'global call', 'dotenv.config():', config);

let NODE_ENVIRONMENT: string;
if (Constants.IN_DEBUG_MODE === true) {
	NODE_ENVIRONMENT = Constants.DEVELOPMENT_MODE;
} else {
	NODE_ENVIRONMENT = Constants.PRODUCTION_MODE;
}

const CLUSTER_URI: string = process.env.ENV_MONGO_URI ?
	process.env.ENV_MONGO_URI : '';

export const env = Object.freeze(
	{
		PORT: process.env.PORT || 8008,	// for compatibility with Heroku

		NODE_ENV: NODE_ENVIRONMENT,
		SERVICE_ACCOUNT: serviceAccount,

		MONGO_URL: CLUSTER_URI,
		DB_NAME: 'NetWorthDb',
		TEST_DB_NAME: 'NetWorthDbTest',

		CLIENT_PATH: Constants.CLIENT_PATH,

		SAVE_ROUTE: Constants.APIEndpoints.SAVE_URL,
		SPEND_ROUTE: Constants.APIEndpoints.SPEND_URL,

		CLIENT_ROUTE: Constants.APIEndpoints.CLIENT_URL,
		HEALTH_CHECK_ROUTE: Constants.APIEndpoints.HEALTH_CHECK_URL
	}
);
