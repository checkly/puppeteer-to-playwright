<p>
  <img height="128" src="https://www.checklyhq.com/images/footer-logo.svg" align="right" />
  <h1>puppeteer-to-playwright</h1>
</p>

<p>
  <img src="https://img.shields.io/github/workflow/status/checkly/puppeteer-to-playwright/test" alt="Github Action - CI Test"/>
  <img src="https://img.shields.io/github/package-json/v/checkly/puppeteer-to-playwright" alt="Github package.json Version" />
</p>
<br />

`puppeteer-to-playwright` automatically converts Javascript Puppeteer scripts to Playwright, aiming to reduce the amount of manual work involved in such a migration (ideally reducing it to zero). It is heavily based on [jscodeshift](https://github.com/facebook/jscodeshift).

> puppeteer-to-playwright requires Node.js 14 or newer.

## 👷 Features

`puppeteer-to-playwright` will convert your existing Puppeteer script to Playwright, including:

- Converting import statements
- Converting basic methods to match new API (e.g. `setViewport` to `setViewportSize` and similar)
- Creating browser context explicitly
- Eliminating explicit waiting (unless [Strict mode is enabled](#strict-mode))
- Converting cookies-related commands

### 🛑 Currently unsupported

The following features are not yet supported, meaning that the corresponding instructions won't be converted to Playwright if they are used in your Puppeteer script:

- File upload
- File download
- Request/response interception
- Multiple contexts / tabs

Still, these might very well be implemented in the near future. If you would like to help, see our [how to contribute](#-how-to-contribute) section.

## 🚢 Getting Started

You can use `puppeteer-to-playwright` on a script file or multiple scripts at a time.

> 🚨 _It will overwrite the script file when run_, so we recommend doing a dry-run first.

### Dry run

A dry run will run the conversion without acutally writing to the file(s) you point it at.

```
$ npm run convert -- -d my-puppeteer-script.js
```

You can add `-p` to print out the resulting script:

```
$ npm run convert -- -d -p my-puppeteer-script.js
```

> You can pass additional jscodeshift parameters as described in the [project's repository]((https://github.com/facebook/jscodeshift)).

### Convert script

You can convert scripts one by one...

```
$ npm run convert my-puppeteer-script.js
```

...or you can convert entire folders recursively.

```
$ npm run convert my-puppeteer-folder
```

> puppeteer-to-playwright will ignore files that have any extension other than `.js`, as well as those that do not import/require Puppeteer.

### Strict mode

When converting files, puppeteer-to-playwright will, by default, get rid of likely unnecessary waits that Playwright should handle automatically. If you know that the waits in your Puppeteer script will remain necessary even with Playwright, you can set puppeteer-to-playwright to Strict mode by running `export STRICT=true`. Alternatively, you can set the flag directly when converting a file or folder, e.g.: 
```STRICT=true npm run convert my-puppeteer-folder```

## 🤝 How to contribute

If you would like to improve this codemod, you are very welcome to send a PR. Make sure it contains a test for the specific feature you are trying to add. Testing is currently set up as follows:

1. In `test/base` you have the original Puppeteer script
2. In `test/output` you have the original Puppeteer script, which will be automatically converted when tests are run then immediately restored to the original
3. In `test/expected` you have the expected Playwright script that your result will need to be equal to

You can run `npm run test` locally, and tests will run automatically for each new PR.

## 🔗 Links

- [jscodeshift](https://github.com/facebook/jscodeshift) - without which this project wouldn't be possible.
- [ASTExplorer](https://astexplorer.net/) - useful debugging tool in case you would like to modify the transform file of this project to tweak its output.

## 📄 License

[MIT](https://github.com/checkly/puppeteer-to-playwright/blob/main/LICENSE)

<p align="center">
  <a href="https://checklyhq.com?utm_source=github&utm_medium=sponsor-logo-github&utm_campaign=headless-recorder" target="_blank">
  <img width="100px" src="https://github.com/checkly/headless-recorder/raw/main/assets/checkly-logo.png?raw=true" alt="Checkly" />
  </a>
  <br />
  <i><sub>Delightful Active Monitoring for Developers</sub></i>
  <br>
  <b><sub>From Checkly with ♥️</sub></b>
<p>
