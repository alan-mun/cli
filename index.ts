#!/usr/bin/env node

import { CommandController } from "./engine";
import { trace, printHelp, debug, ExecutionConfig, setTraceLevel, TraceLevel } from "./common";
import { BaseCommand } from "./engine";

// print copyright ?
trace("\nWelcome to 8base command line interface");

let command: BaseCommand;



async function initialize(): Promise<any> {
    try {

        let config = new ExecutionConfig(process.argv.slice(2));

        if (config.isParameterPresent('d')) {
            setTraceLevel(TraceLevel.Debug);
        } else {
            setTraceLevel(TraceLevel.Trace);
        }

        debug("start init");
        return await CommandController.initialize(config);
    }
    catch(err) {
        setTraceLevel(TraceLevel.Trace);
        printHelp();
        throw err;
    }
}

initialize()
    .then((cmd) => {
        command = cmd;
        return CommandController.run(command);
    })
    .then(() => {
        trace("\n" + command.onSuccess());
    })
    .catch(err => { trace("\nError = " + err.message); });