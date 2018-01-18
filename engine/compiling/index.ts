import { provideFilesToCompile } from "./provideFilesToCompile";
import * as path from 'path';
import { trace, debug, StaticConfig } from "../../common";
// const debug = require('debug')('ts-builder')

export async function compile() {
    const files = await provideFilesToCompile();

    debug(files);
}

const defaultGlobbyOptions = {
    dot: true,
    silent: true,
    follow: true,
    nosort: true,
    mark: true
  };

export async function checkCompilingDirectory() {
    const requiredFiles = ["8base.yml"];
}


