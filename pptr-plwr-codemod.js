export default function (fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

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
  
    // remove waitForSelector only when returned element is not used
    root.find(j.AwaitExpression).filter(path => {
		console.log(path.parent.value.type == 'VariableDeclarator')
      return path.value.argument.callee.property.name === 'waitForSelector' &&
          path.parent.value.type !== 'VariableDeclarator'
    }).remove()

    // TODO add strict mode
    root.find(j.Identifier, { name: 'waitForXPath' }).replaceWith(j.identifier('waitForSelector'));
    root.find(j.AwaitExpression).filter(path => {
        return path.value.argument.callee.property.name === 'waitForNetworkIdle'
    }).remove()

    root.find(j.Identifier, { name: '$x' }).replaceWith(j.identifier('$'))

    root.find(j.Identifier, { name: 'waitFor' }).replaceWith(j.identifier('waitForTimeout'));
    root.find(j.Identifier, { name: 'type' }).replaceWith(j.identifier('fill'));
    
    // cookies
    root.find(j.Identifier, { name: 'page.cookies' }).replaceWith(j.identifier('context.cookies'));

    return root.toSource();
}
