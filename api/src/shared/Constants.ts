const SAVE_URL = '/api/save';
const SPEND_URL = '/api/spend';
const CLIENT_URL = '/*';
const HEALTH_CHECK_URL = '/health';

export { Constants };

class Constants {
	static IN_DEBUG_MODE: boolean = false;
	static APIEndpoints =
		{
			SAVE_URL: SAVE_URL,
			SPEND_URL: SPEND_URL,
			CLIENT_URL: CLIENT_URL,
			HEALTH_CHECK_URL: HEALTH_CHECK_URL
		};

	static PRODUCTION_MODE: string = 'production';
	static DEVELOPMENT_MODE: string = 'development';

	static CLIENT_PATH: string = 'client';
}
