import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import _ = require("lodash");
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/Translations";

export default {
  name: "logs",
  handler: async (params: any, context: Context) => {
    const result = await context.request(GraphqlActions.logs, { functionName: params.f, limit: params.n });
    context.logger.info(result.logs);
  },
  describe: translations.i18n.t("logs_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("logs_usage"))
      .option("f", {
        alias: 'function',
        require: true,
        type: "string",
        describe: "function to invoke"
      })
      .option("n", {
        alias: 'num',
        default: 10,
        describe: "number of lines to display (default: 10, max: 100)",
        type: "number",
        coerce: arg => arg > 100 ? 100 : arg
      });
  }
};
