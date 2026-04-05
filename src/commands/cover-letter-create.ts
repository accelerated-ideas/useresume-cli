import type { CommandModule } from "yargs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getClient } from "../client.js";
import { outputSuccess, outputError } from "../output.js";

interface Args {
  input: string;
}

const command: CommandModule<{}, Args> = {
  command: "cover-letter:create",
  describe: "Create a cover letter from a JSON input file (1 credit)",
  builder: {
    input: {
      type: "string",
      demandOption: true,
      describe: "Path to JSON file containing cover letter content and style",
    },
  },
  handler: async (argv) => {
    try {
      const filePath = resolve(argv.input);
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      const client = getClient();
      const result = await client.createCoverLetter(data);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  },
};

export default command;
