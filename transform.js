export default function (fileInfo, api) {
	const j = api.jscodeshift;
	const root = j(fileInfo.source);

	// If strict mode is set the codemod will act more conservatively
	// and assume all explicit waits are actually necessary
	const MODE_STRICT = process.env.STRICT;

	// If possible, reuse existing variable names for context and page
	// otherwise, use defaults
	let varContext = 'context';
	let varPage = 'page';

	// Check if target file contains Puppeteer requires/imports, skip if it doesn't
	const puppeteerRequire = root
		.find(j.VariableDeclaration)
		.filter((path) => {
			return (
				path.value?.declarations?.[0]?.init?.arguments?.[0]?.value === 'puppeteer' &&
				path.value?.declarations?.[0]?.init?.callee?.name === 'require'
			);
		})

	const puppeteerImport = root
		.find(j.ImportDeclaration)
		.filter((path) => {
			return (
				path?.value?.source?.value === 'puppeteer' &&
				path?.value?.source?.type === 'Literal'
			);
		})

	if (puppeteerImport.paths().length || puppeteerRequire.paths().length) {

		// Handle puppeteer require
		root
			.find(j.Identifier, { name: 'puppeteer' })
			.filter((path) => {
				return (
					path.parent.value.type === 'VariableDeclarator' &&
					path.parent.value.init.type === 'CallExpression' &&
					path.parent.value.init.callee.type === 'Identifier' &&
					path.parent.value.init.callee.name === 'require' &&
					path.parent.value.init.arguments[0].type === 'Literal' &&
					path.parent.value.init.arguments[0].value === 'puppeteer'
				);
			})
			.replaceWith((path) => {
				return j.identifier('{ chromium }');
			});

		root.find(j.Identifier, { name: 'puppeteer' }).replaceWith(j.identifier('chromium'));

		root.find(j.Literal).replaceWith((path) => {
			if (path.value?.value === 'puppeteer') {
				return j.identifier("'playwright'");
			}
			return path.value;
		});

		// Remove existing context creation, save context variable name for reuse
		root
			.find(j.VariableDeclaration)
			.filter((path) => {
				if (path.value?.declarations[0]?.init?.argument?.callee?.property?.name === 'createIncognitoBrowserContext') {
					varContext = path.value.declarations[0].id.name;
				}
				return (
					path.value?.declarations[0]?.init?.argument?.callee?.property?.name === 'createIncognitoBrowserContext' &&
					path.value.declarations[0].init.argument.callee.object.name === 'browser'
				);
			})
			.remove();

		// Force context creation, save page variable name for reuse
		root
			.find(j.VariableDeclaration)
			.filter((path) => {
				if (path.value?.declarations[0]?.init?.argument?.callee?.property?.name === 'newPage') {
					varPage = path.value.declarations[0].id.name;
				}
				return (
					path.value?.declarations[0]?.init?.argument?.callee?.property?.name === 'newPage' &&
					path.value.declarations[0].init.argument.callee.object.name === 'browser'
				);
			})
			.insertBefore(`const ${varContext} = await browser.newContext()`);

		// Handle page creation from context
		root
			.find(j.VariableDeclaration)
			.filter((path) => {
				return (
					path.value?.declarations[0]?.init?.argument?.callee?.property?.name === 'newPage' &&
					path.value.declarations[0].init.argument.callee.object.name === 'browser'
				);
			})
			.replaceWith(`const ${varPage} = await ${varContext}.newPage()`);

		// Remove sleeps
		root
			.find(j.AwaitExpression)
			.filter((path) => {
				return !MODE_STRICT && path.value?.argument?.callee?.name === 'sleep';
			})
			.remove();

		// Remove waitForTimeout and waitFor
		root
			.find(j.AwaitExpression)
			.filter((path) => {
				return (
					!MODE_STRICT &&
					(path.value?.argument?.callee?.property?.name === 'waitForTimeout' ||
						path?.value?.argument?.callee?.property?.name === 'waitFor')
				);
			})
			.remove();

		// Remove waitForNavigation
		root
			.find(j.VariableDeclaration)
			.filter((path) => {
				return !MODE_STRICT && path.value?.declarations[0]?.init?.callee?.property?.name === 'waitForNavigation';
			})
			.remove();

		// Remove navigationPromise
		root
			.find(j.AwaitExpression)
			.filter((path) => {
				return !MODE_STRICT && path.value?.argument?.name === 'navigationPromise';
			})
			.remove();

		// Remove waitForNetworkIdle
		root
			.find(j.AwaitExpression)
			.filter((path) => {
				return !MODE_STRICT && path.value?.argument?.callee?.property?.name === 'waitForNetworkIdle';
			})
			.remove();

		// Remove waitForSelector only when returned element is not used
		root
			.find(j.AwaitExpression)
			.filter((path) => {
				return (
					!MODE_STRICT &&
					path.value?.argument?.callee?.property?.name === 'waitForSelector' &&
					path.parent?.value?.type !== 'VariableDeclarator'
				);
			})
			.remove();

		// Update method names
		root.find(j.Identifier, { name: 'setViewport' }).replaceWith(j.identifier('setViewportSize'));
		root.find(j.Identifier, { name: 'waitForXPath' }).replaceWith(j.identifier('waitForSelector'));
		root.find(j.Identifier, { name: '$x' }).replaceWith(j.identifier('$'));
		root.find(j.Identifier, { name: 'type' }).replaceWith(j.identifier('fill'));

		// Handle reading cookies
		root
			.find(j.CallExpression)
			.filter((path) => {
				return path.value?.callee?.property?.name === 'cookies';
			})
			.replaceWith(`await ${varContext}.cookies()`);

		// Handle setting cookies
		const varCookies = root.find(j.AwaitExpression).filter((path) => {
			return path.value?.argument?.callee?.property?.name == 'setCookie';
		});

		if (varCookies.length > 0) {
			const elName = varCookies.get().value.argument.arguments[0].argument.name;

			root
				.find(j.CallExpression)
				.filter((path) => {
					return path.value?.callee?.property?.name == 'setCookie';
				})
				.replaceWith(
					j.callExpression(j.memberExpression(j.identifier('browserContext'), j.identifier('addCookies'), false), [
						j.identifier(elName),
					])
				);

			root
				.find(j.ExpressionStatement)
				.filter((path) => {
					return path.value?.expression?.argument?.callee?.property?.name === 'addCookies';
				})
				.insertBefore('// TODO: ensure the following line references the right context');
		}

		// Handle clearing cookies
		root
			.find(j.AwaitExpression)
			.filter((path) => {
				return path.value?.argument?.callee?.property?.name == 'deleteCookie';
			})
			.replaceWith(`// TODO: this deletes all cookies - ensure this is fine\nawait ${varContext}.clearCookies()`);

		return root.toSource();

	}
}
