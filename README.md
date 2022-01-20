<p>
  <img height="128" src="https://www.checklyhq.com/images/footer-logo.svg" align="right" />
  <h1>puppeteer-to-playwright</h1>
</p>

<p>
  <img src="https://img.shields.io/github/workflow/status/checkly/puppeteer-to-playwright/ci?label=test" alt="Github Action - CI Test"/>
  <img src="https://img.shields.io/github/package-json/v/checkly/puppeteer-to-playwright" alt="Github package.json Version" />
</p>
<br />

`puppeteer-to-playwright` automatically converts Javascript Puppeteer scripts to Playwright, aiming to reduce the amount of manual work involved in such a migration (ideally reducing it to zero). It is heavily based on [jscodeshift](https://github.com/facebook/jscodeshift).

## 👷 Features

`puppeteer-to-playwright` will convert your existing Puppeteer script to Playwright, including:

- Converting import statements
- Converting basic methods to match new API (e.g. `setViewport` to `setViewportSize` and similar)
- Creating browser context explicitly
- Eliminating explicit waiting (unless `STRICT` mode is enabled)
- Converting cookies-related commands

### 🛑 Currently unsupported

- File upload
- File download
- Request/response interception

## 🚢 Getting Started

You can use `puppeteer-to-playwright` on a script file or multiple scripts at a time.

> _It will overwrite the script file when run_, so we recommend doing a dry-run first

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

```
$ npm run convert my-puppeteer-script.js
```

### Convert entire folder of scripts

```
$ npm run convert my-puppeteer-folder
```

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
