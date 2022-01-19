# puppeteer-to-playwright
puppeteer-to-playwright automatically converts Javascript Puppeteer scripts to Playwright, aiming to reduce the amount of manual work involved in such a migration (ideally reducing it to zero). It is heavily based on [jscodeshift](https://github.com/facebook/jscodeshift).

## Features
puppeteer-to-playwright will convert your script to Playwright, including:

* Converting import statements
* Converting basic methods to match new API (e.g. `setViewport` to `setViewportSize` and similar)
* Creating browser context explicitly
* Eliminating explicit waiting (unless `STRICT` mode is enabled)
* Converting cookies-related commands

## Things it doesn't handle yet

* File upload
* File download
* Request/response interception

## How to start it
You can use puppeteer-to-playwright on one script or multiple scripts at a time.
*Note that it will overwrite the scripts when run*, so you might want to try a dry run first.

### Dry run
`npm run dryrun`

### Convert script
`npm run convert my-puppeteer-script.js`

### Convert scripts in folder
`npm run convert my-puppeteer-folder`

## Links
* [jscodeshift](https://github.com/facebook/jscodeshift), which this project is based upon.
* [ASTExplorer](https://astexplorer.net/), useful in case you would like to modify the transform file of this project to tweak its output

