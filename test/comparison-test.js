const { promises: fs } = require("fs")
const nfs = require ("fs")
const path = require("path")
const assert = require("chai").assert;

const dirOut = nfs.readdirSync('test/output')

for (dir of dirOut) {
    const scriptTransformed = nfs.readFileSync(`test/output/${dir}`)
    const scriptExpected = nfs.readFileSync(`test/expected/${dir}`)
    console.log('>>> Comparing ' + dir)
    assert(scriptTransformed.equals(scriptExpected))
}

console.log('Tests ran')

copyDir('./test/base', './test/output');

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}