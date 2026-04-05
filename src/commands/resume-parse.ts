import type { CommandModule } from "yargs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getClient } from "../client.js";
import { outputSuccess, outputError } from "../output.js";

interface Args {
  "file-url"?: string;
  file?: string;
  "parse-to": string;
}

const command: CommandModule<{}, Args> = {
  command: "resume:parse",
  describe: "Parse an existing resume file into structured data (4 credits)",
  builder: {
    "file-url": {
      type: "string",
      describe: "Public URL of the resume file to parse (max 20MB)",
      conflicts: "file",
    },
    file: {
      type: "string",
      describe: "Local file path to base64-encode and send (max 4MB)",
      conflicts: "file-url",
    },
    "parse-to": {
      type: "string",
      choices: ["json", "markdown"] as const,
      demandOption: true,
      describe: "Output format: json (structured) or markdown (text)",
    },
  },
  handler: async (argv) => {
    try {
      if (!argv["file-url"] && !argv.file) {
        outputError(new Error("Either --file-url or --file is required"));
        return;
      }

      const params: Record<string, string> = {
        parse_to: argv["parse-to"],
      };

      if (argv["file-url"]) {
        params.file_url = argv["file-url"];
      } else if (argv.file) {
        const filePath = resolve(argv.file);
        const fileBuffer = readFileSync(filePath);
        params.file = fileBuffer.toString("base64");
      }

      const client = getClient();
      const result = await client.parseResume(params as any);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  },
};

export default command;
