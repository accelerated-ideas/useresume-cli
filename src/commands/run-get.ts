import type { CommandModule } from "yargs";
import { getClient } from "../client.js";
import { outputSuccess, outputError } from "../output.js";

interface Args {
  "run-id": string;
}

const command: CommandModule<{}, Args> = {
  command: "run:get <run-id>",
  describe: "Get the status and result of an async run (0 credits)",
  builder: {
    "run-id": {
      type: "string",
      demandOption: true,
      describe: "The run ID returned from a create or parse command",
    },
  },
  handler: async (argv) => {
    try {
      const client = getClient();
      const result = await client.getRun({ run_id: argv["run-id"] });
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  },
};

export default command;
