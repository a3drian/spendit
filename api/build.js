const { copyFileSync, writeFileSync } = require('fs');

(function build() {
	const [semver = process.env.SEMVER] = process.argv.splice(2);

	// add dist package.json
	const apiPackage = require('./package.json');
	const distPackagePath = '../Deploy/package.json';

	writeFileSync(
		distPackagePath,
		JSON.stringify(
			{
				...apiPackage,
				...(semver ? { version: semver } : {}),
				scripts: { start: apiPackage.scripts.start },
				devDependencies: undefined
			}, null, 4),
		{ encoding: 'utf-8' }
	);
	console.log(`FILE: ${distPackagePath}`);


	// add dist package-lock.json
	const apiPackageLock = './package-lock.json';
	const distPackageLockPath = '../Deploy/package-lock.json';

	copyFileSync(apiPackageLock, distPackageLockPath);
	console.log(`FILE: ${distPackageLockPath}`);

	// add .npmrc
	const npmrc = './.npmrc';
	const distNpmrcPath = '../Deploy/.npmrc';

	copyFileSync(npmrc, distNpmrcPath);
	console.log(`FILE: ${distNpmrcPath}`);
})();
