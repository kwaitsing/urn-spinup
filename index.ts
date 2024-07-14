#!/usr/bin/env bun

// Load env
import { $ } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import { logger } from 'toolbx'

const work_dir = process.cwd()
const assignDir = (Bun.argv.slice(2))[0]
let scaffold = work_dir
if (assignDir) scaffold = assignDir
scaffold = path.resolve(scaffold)

// Start ricing process

if (fs.existsSync(scaffold)) {
    if (!(fs.readdirSync(scaffold).length === 0)) { logger(`Directory not empty, abort`, 2); process.exit(1) } // Handle dir is not empty
}


// Git clone the spin-up template
try {
    await $`git clone https://github.com/kwaitsing/urn-spinup-template.git ${scaffold}`.quiet()
    await $`cd ${scaffold} && bun install`.quiet()
    // Modify the template
    fs.rmSync(`${scaffold}/.git`, {recursive: true, force: true})
    if (assignDir) {
       let contents = await Bun.file(`${scaffold}/package.json`).json();
       contents.name = assignDir
       await Bun.write(`${scaffold}/package.json`, JSON.stringify(contents, null, 2));
    }
} catch (err) {
    logger(`Something went wrong ${err}`, 2)
}

logger(`Successfully bootstrap the URN instance
    
cd ${scaffold}
bun run dev
    
To start the dev server`, 1)
