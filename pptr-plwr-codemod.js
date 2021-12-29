export default function (fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    // if strict mode is set the codemod will act more conservatively
    // and assume all explicit waits are actually necessary 
    const MODE_STRICT = process.env.STRICT;

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
  
    root.find(j.Identifier, { name: 'createIncognitoBrowserContext' }).replaceWith(path => {
        return j.identifier('newContext');
    });
  
    root.find(j.Identifier, { name: 'setViewport' }).replaceWith(j.identifier('setViewportSize'));

    root.find(j.AwaitExpression).filter(path => {
        if (!path.value.argument.callee) {
            return false
        }
        return !MODE_STRICT && (path.value.argument.callee.name === 'sleep')
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
    return root.toSource();
}
