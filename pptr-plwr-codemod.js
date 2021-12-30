export default function (fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    // if strict mode is set the codemod will act more conservatively
    // and assume all explicit waits are actually necessary 
    const MODE_STRICT = process.env.STRICT;

    // if possible, reuse existing variable names for context and page
    // otherwise, use defaults
    let contextName = 'context'
    let pageName = 'page'

    root.find(j.Identifier, { name: 'puppeteer' }).filter(path => {
        return path.parent.value.type === 'VariableDeclarator' &&
            path.parent.value.init.type === 'CallExpression' &&
            path.parent.value.init.callee.type === 'Identifier' &&
            path.parent.value.init.callee.name === 'require' &&
            path.parent.value.init.arguments[0].type === 'Literal' &&
            path.parent.value.init.arguments[0].value === 'puppeteer';
    }).replaceWith(path => {
        return j.identifier('\{ chromium \}');
    });

    root.find(j.Identifier, { name: 'puppeteer' }).replaceWith(j.identifier('chromium'));

    root.find(j.Literal).replaceWith(path => {
        if (path.value.value === 'puppeteer') {
            return j.identifier('\'playwright\'');
        }
        return path.value;
    }
    ).toSource();

    // Remove existing context creation
    root.find(j.VariableDeclaration).filter(path => {
        if (!path.value.declarations[0].init.argument) {
            return
        }
        if (path.value.declarations[0].init.argument.callee.property.name === "createIncognitoBrowserContext") {
            contextName = path.value.declarations[0].id.name
        }
        return path.value.declarations[0].init.argument.callee.property.name === "createIncognitoBrowserContext" &&
            path.value.declarations[0].init.argument.callee.object.name === "browser"
    }).remove()

    // Force context creation
    root.find(j.VariableDeclaration).filter(path => {
        if (!path.value.declarations[0].init.argument) {
            return
        }
        if (path.value.declarations[0].init.argument.callee.property.name === "newPage") {
            pageName = path.value.declarations[0].id.name
        }
        return path.value.declarations[0].init.argument.callee.property.name === "newPage" &&
            path.value.declarations[0].init.argument.callee.object.name === "browser"
    }).insertBefore(`const ${contextName} = await browser.newContext()`)

    root.find(j.VariableDeclaration).filter(path => {
        if (!path.value.declarations[0].init.argument) {
            return
        }
        return path.value.declarations[0].init.argument.callee.property.name === "newPage" &&
            path.value.declarations[0].init.argument.callee.object.name === "browser"
    }).replaceWith(`const ${pageName} = await ${contextName}.newPage()`)

    root.find(j.Identifier, { name: 'setViewport' }).replaceWith(j.identifier('setViewportSize'));

    root.find(j.AwaitExpression).filter(path => {
        if (!path.value.argument.callee) {
            return false
        }
        return !MODE_STRICT && (path.value.argument.callee.name === 'sleep')
    }).remove()

    root.find(j.VariableDeclaration).filter(path => {
        if (!path.value.declarations[0].init.callee || !path.value.declarations[0].init.callee.property) {
            return
        }
        return !MODE_STRICT && path.value.declarations[0].init.callee.property.name === 'waitForNavigation'
    }).remove()

    root.find(j.AwaitExpression).filter(path => {
        return !MODE_STRICT && (path.value.argument.name === 'navigationPromise')
    }).remove()

    root.find(j.AwaitExpression).filter(path => {
        if (!path.value.argument.callee.property) {
            return false
        }
        return !MODE_STRICT && (path.value.argument.callee.property.name === 'waitForNetworkIdle')
    }).remove()

    // remove waitForSelector only when returned element is not used
    root.find(j.AwaitExpression).filter(path => {
        if (!path.value.argument.callee || !path.value.argument.callee.property) {
            return false
        }
        return !MODE_STRICT && path.value.argument.callee.property.name === 'waitForSelector' &&
            path.parent.value.type !== 'VariableDeclarator'
    }).remove()

    root.find(j.Identifier, { name: 'waitForXPath' }).replaceWith(j.identifier('waitForSelector'));

    root.find(j.Identifier, { name: '$x' }).replaceWith(j.identifier('$'))

    root.find(j.Identifier, { name: 'waitFor' }).replaceWith(j.identifier('waitForTimeout'));
    root.find(j.Identifier, { name: 'type' }).replaceWith(j.identifier('fill'));

    const el = root.find(j.SpreadElement) // TODO get if setcookie
    if (el.length > 0) {
        const elName = el.get().value.argument.name;

        root.find(j.CallExpression).filter(path => {
            if (!path.value.callee.property || !path.value.callee) {
                return false
            }
            return path.value.callee.property.name == 'setCookie'
        }).replaceWith(j.callExpression(j.memberExpression(j.identifier('browserContext'), j.identifier('addCookies'), false), [j.identifier(elName)]))

        root.find(j.ExpressionStatement).filter(path => {
            if (!path.value.expression || !path.value.expression.argument) {
                return false
            }
            return path.value.expression.argument.callee.property.name === 'addCookies'
        }).insertBefore('// TODO: ensure the following line references the right context')

    }

    return root.toSource();
}
