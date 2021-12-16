//create codemod for literal puppeteer and replace it with playwright
export default function (fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    //replace 'const puppeteer' identifier with 'const { chromium }'
    //find keyword const puppeteer and replace it with const { chromium }
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

    //replace identifier createIncognitoBrowserContext with newContext
    root.find(j.Identifier, { name: 'createIncognitoBrowserContext' }).replaceWith(j.identifier('newContext'));

    //replace identifier setViewport with setViewportSize
    root.find(j.Identifier, { name: 'setViewport' }).replaceWith(j.identifier('setViewportSize'));

    //delete lines identifier waitForSelector
    root.find(j.Identifier, { name: 'waitForSelector' }).remove();

    //replace waitForXPath with waitForSelector
    root.find(j.Identifier, { name: 'waitForXPath' }).replaceWith(j.identifier('waitForSelector'));

    //replace page.$x(xpath_selector) with	page.$(xpath_selector)

    //replace waitfornetworkidle with waitforloadstate
    root.find(j.Identifier, { name: 'waitForNetworkIdle' }).replaceWith(j.identifier('waitForLoadState'));

    //replace waitFor with waitForTimeout
    root.find(j.Identifier, { name: 'waitFor' }).replaceWith(j.identifier('waitForTimeout'));

    //replace type with fill
    root.find(j.Identifier, { name: 'type' }).replaceWith(j.identifier('fill'));

    





    return root.toSource();
}
