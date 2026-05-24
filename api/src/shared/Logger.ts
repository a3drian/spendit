/* eslint-disable no-console */
import { Color } from './Console';
import { Constants } from './Constants';

export { log };

const log = function (
	className: string,
	caller: string,
	message: string,
	object?: any
): void {
	if (!Constants.IN_DEBUG_MODE) {
		return;
	}

	if (!(caller.includes('(') || caller.includes(')'))) {
		caller = caller + '()';
	}
	if (caller.includes('^')) {
		caller = caller.replace('^', '');
		caller = caller + '^';
	}
	if (object) {
		const type = typeof (object);
		// console.log('type:', type);
		if (type === 'boolean') {
			console.group(
				Color.BgWhite + Color.FgBlack, className, Color.Reset,
				Color.BgBlue + Color.FgWhite, caller, Color.Reset,
				message,
				Color.FgGreen, object, Color.Reset
			);
			console.groupEnd();
		} else if (type === 'bigint' || type === 'number' || type === 'string') {
			console.group(
				Color.BgWhite + Color.FgBlack, className, Color.Reset,
				Color.BgBlue + Color.FgWhite, caller, Color.Reset,
				message,
				Color.FgGreen, object, Color.Reset
			);
			console.groupEnd();
		} else {
			console.group(
				Color.BgWhite + Color.FgBlack, className, Color.Reset,
				Color.BgBlue + Color.FgWhite, caller, Color.Reset,
				message
			);
			console.log(object, Color.Reset);
			console.groupEnd();
		}
	} else if (object === false) {
		console.group(
			Color.BgWhite + Color.FgBlack, className, Color.Reset,
			Color.BgBlue + Color.FgWhite, caller, Color.Reset,
			message,
			Color.FgGreen, object, Color.Reset
		);
		console.groupEnd();
	} else {
		console.group(
			Color.BgWhite + Color.FgBlack, className, Color.Reset,
			Color.BgBlue + Color.FgWhite, caller, Color.Reset,
			message, Color.Reset
		);
		console.groupEnd();
	}
};
