import type { CommandModule } from "yargs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getClient } from "../client.js";
import { outputSuccess, outputError } from "../output.js";

interface Args {
  input: string;
}

const command: CommandModule<{}, Args> = {
  command: "cover-letter:create-tailored",
  describe:
    "Create an AI-tailored cover letter optimized for a specific job (5 credits)",
  builder: {
    input: {
      type: "string",
      demandOption: true,
      describe:
        "Path to JSON file containing cover_letter_content, target_job, and optional tailoring_instructions",
    },
  },
  handler: async (argv) => {
    try {
      const filePath = resolve(argv.input);
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      const client = getClient();
      const result = await client.createTailoredCoverLetter(data);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  },
};

export default command;
