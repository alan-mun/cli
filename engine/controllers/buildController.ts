import * as fs from "fs-extra";
import * as path from 'path';
import { debug, FunctionDefinition, ProjectDefinition, StaticConfig } from "../../common";
import { resolveCompiler, ProjectController } from "../../engine";
import * as glob from "glob";


export class BuildController {

    /**
     * @param files files contain function from config yml file
     * @param buildDir output build directory
     * @return list of compiled files
     */
    static async compile(project: ProjectDefinition): Promise<any> {

        BuildController.clean();

        const files = ProjectController.getFunctionSourceCode(project);

        BuildController.prepare();

        debug("resolve compilers");
        const compiler = resolveCompiler(files);

        const compiledFiles = await compiler.compile(StaticConfig.buildDir);
        debug("compiled files = " + compiledFiles);

        BuildController.makeFunctionHandlers(ProjectController.getFunctions(project));

        BuildController.saveHandler(StaticConfig.buildDir);

        ProjectController.saveMetaDataFile(project, StaticConfig.summaryDir);

        ProjectController.saveSchema(project, StaticConfig.summaryDir);

        return {
            build: StaticConfig.buildDir,
            summary: StaticConfig.summaryDir
        };
    }

    /**
     * Private functions
     */

    private static makeFunctionHandlers(functions: FunctionDefinition[]) {

        functions.forEach(func => {
            debug("process function = " + func.name);

            const handler = func.handler.value();
            const ext = path.parse(handler).ext;

            const mask = path.join(StaticConfig.buildDir, handler.replace(ext, "*"));

            if (glob.sync(mask).length !== 1) {
                throw new Error("target compiled file " + handler + " not exist");
            }

            BuildController.makeFunctionWrapper(func.name, handler.replace(ext, ""));
        });
    }

    private static makeFunctionWrapper(name: string, functionPath: string) {

        const fullWrapperFuncPath = path.join(StaticConfig.buildDir, name.concat(StaticConfig.FunctionHandlerExt));

        debug("full function path = " + fullWrapperFuncPath);

        debug("read function wrapper");
        let wrapper = fs.readFileSync(StaticConfig.functionWrapperPath);
        const updatedWrapper = wrapper.toString().replace("__functionname__", functionPath );
        debug("prepare wrapper complete");

        fs.writeFileSync(fullWrapperFuncPath, updatedWrapper);
        debug("write func wrapper compete = " + fullWrapperFuncPath);
    }

    private static saveHandler(outDir: string) {
        const handlerFile = path.join(outDir, path.basename(StaticConfig.functionHandlerPath));
        fs.copyFileSync(StaticConfig.functionHandlerPath, handlerFile);
    }

    static generateBuildName(): string {
        return `build_${Date.now()}`;
    }

    private static clean() {
        fs.removeSync(StaticConfig.buildRootDir);
    }

    private static prepare() {
        fs.mkdirpSync(StaticConfig.buildDir);
        fs.mkdirpSync(StaticConfig.summaryDir);
    }
}


