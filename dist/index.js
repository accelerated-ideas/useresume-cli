#!/usr/bin/env node

// src/index.ts
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// src/commands/resume-create.ts
import { readFileSync } from "fs";
import { resolve } from "path";

// src/client.ts
import { useResume } from "@useresume/sdk";
function getConfig() {
  const apiKey = process.env.USERESUME_API_KEY;
  if (!apiKey) {
    console.log(
      JSON.stringify({
        success: false,
        error: {
          code: "MISSING_API_KEY",
          message: "USERESUME_API_KEY environment variable is not set. Get your key at https://useresume.ai/dashboard/api-platform"
        }
      })
    );
    process.exit(1);
  }
  const baseUrl = process.env.USERESUME_API_BASE_URL || "https://useresume.ai/api/v3";
  return { apiKey, baseUrl };
}
function getClient() {
  const { apiKey, baseUrl } = getConfig();
  return new useResume(apiKey, { baseUrl });
}

// src/output.ts
import { UseResumeError } from "@useresume/sdk";
function outputSuccess(data) {
  console.log(JSON.stringify(data));
}
function outputError(error) {
  let code = "ERROR";
  let message;
  if (error instanceof UseResumeError) {
    code = `HTTP_${error.status}`;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    code = "UNKNOWN_ERROR";
    message = String(error);
  }
  console.log(
    JSON.stringify({
      success: false,
      error: { code, message }
    })
  );
  process.exit(1);
}

// src/commands/resume-create.ts
var command = {
  command: "resume:create",
  describe: "Create a resume from a JSON input file (1 credit)",
  builder: {
    input: {
      type: "string",
      demandOption: true,
      describe: "Path to JSON file containing resume content and style"
    }
  },
  handler: async (argv) => {
    try {
      const filePath = resolve(argv.input);
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      const client = getClient();
      const result = await client.createResume(data);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var resume_create_default = command;

// src/commands/resume-create-tailored.ts
import { readFileSync as readFileSync2 } from "fs";
import { resolve as resolve2 } from "path";
var command2 = {
  command: "resume:create-tailored",
  describe: "Create an AI-tailored resume optimized for a specific job (5 credits)",
  builder: {
    input: {
      type: "string",
      demandOption: true,
      describe: "Path to JSON file containing resume_content, target_job, and optional tailoring_instructions"
    }
  },
  handler: async (argv) => {
    try {
      const filePath = resolve2(argv.input);
      const data = JSON.parse(readFileSync2(filePath, "utf-8"));
      const client = getClient();
      const result = await client.createTailoredResume(data);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var resume_create_tailored_default = command2;

// src/commands/resume-parse.ts
import { readFileSync as readFileSync3 } from "fs";
import { resolve as resolve3 } from "path";
var command3 = {
  command: "resume:parse",
  describe: "Parse an existing resume file into structured data (4 credits)",
  builder: {
    "file-url": {
      type: "string",
      describe: "Public URL of the resume file to parse (max 20MB)",
      conflicts: "file"
    },
    file: {
      type: "string",
      describe: "Local file path to base64-encode and send (max 4MB)",
      conflicts: "file-url"
    },
    "parse-to": {
      type: "string",
      choices: ["json", "markdown"],
      demandOption: true,
      describe: "Output format: json (structured) or markdown (text)"
    }
  },
  handler: async (argv) => {
    try {
      if (!argv["file-url"] && !argv.file) {
        outputError(new Error("Either --file-url or --file is required"));
        return;
      }
      const params = {
        parse_to: argv["parse-to"]
      };
      if (argv["file-url"]) {
        params.file_url = argv["file-url"];
      } else if (argv.file) {
        const filePath = resolve3(argv.file);
        const fileBuffer = readFileSync3(filePath);
        params.file = fileBuffer.toString("base64");
      }
      const client = getClient();
      const result = await client.parseResume(params);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var resume_parse_default = command3;

// src/commands/cover-letter-create.ts
import { readFileSync as readFileSync4 } from "fs";
import { resolve as resolve4 } from "path";
var command4 = {
  command: "cover-letter:create",
  describe: "Create a cover letter from a JSON input file (1 credit)",
  builder: {
    input: {
      type: "string",
      demandOption: true,
      describe: "Path to JSON file containing cover letter content and style"
    }
  },
  handler: async (argv) => {
    try {
      const filePath = resolve4(argv.input);
      const data = JSON.parse(readFileSync4(filePath, "utf-8"));
      const client = getClient();
      const result = await client.createCoverLetter(data);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var cover_letter_create_default = command4;

// src/commands/cover-letter-create-tailored.ts
import { readFileSync as readFileSync5 } from "fs";
import { resolve as resolve5 } from "path";
var command5 = {
  command: "cover-letter:create-tailored",
  describe: "Create an AI-tailored cover letter optimized for a specific job (5 credits)",
  builder: {
    input: {
      type: "string",
      demandOption: true,
      describe: "Path to JSON file containing cover_letter_content, target_job, and optional tailoring_instructions"
    }
  },
  handler: async (argv) => {
    try {
      const filePath = resolve5(argv.input);
      const data = JSON.parse(readFileSync5(filePath, "utf-8"));
      const client = getClient();
      const result = await client.createTailoredCoverLetter(data);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var cover_letter_create_tailored_default = command5;

// src/commands/cover-letter-parse.ts
import { readFileSync as readFileSync6 } from "fs";
import { resolve as resolve6 } from "path";
var command6 = {
  command: "cover-letter:parse",
  describe: "Parse an existing cover letter file into structured data (4 credits)",
  builder: {
    "file-url": {
      type: "string",
      describe: "Public URL of the cover letter file to parse (max 20MB)",
      conflicts: "file"
    },
    file: {
      type: "string",
      describe: "Local file path to base64-encode and send (max 4MB)",
      conflicts: "file-url"
    },
    "parse-to": {
      type: "string",
      choices: ["json", "markdown"],
      demandOption: true,
      describe: "Output format: json (structured) or markdown (text)"
    }
  },
  handler: async (argv) => {
    try {
      if (!argv["file-url"] && !argv.file) {
        outputError(new Error("Either --file-url or --file is required"));
        return;
      }
      const params = {
        parse_to: argv["parse-to"]
      };
      if (argv["file-url"]) {
        params.file_url = argv["file-url"];
      } else if (argv.file) {
        const filePath = resolve6(argv.file);
        const fileBuffer = readFileSync6(filePath);
        params.file = fileBuffer.toString("base64");
      }
      const client = getClient();
      const result = await client.parseCoverLetter(params);
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var cover_letter_parse_default = command6;

// src/commands/run-get.ts
var command7 = {
  command: "run:get <run-id>",
  describe: "Get the status and result of an async run (0 credits)",
  builder: {
    "run-id": {
      type: "string",
      demandOption: true,
      describe: "The run ID returned from a create or parse command"
    }
  },
  handler: async (argv) => {
    try {
      const client = getClient();
      const result = await client.getRun({ run_id: argv["run-id"] });
      outputSuccess(result);
    } catch (error) {
      outputError(error);
    }
  }
};
var run_get_default = command7;

// src/commands/credentials-test.ts
function extractErrorMessage(body, status, statusText) {
  if (typeof body === "object" && body !== null) {
    const maybeBody = body;
    if (typeof maybeBody.message === "string") {
      return maybeBody.message;
    }
    if (typeof maybeBody.error === "string") {
      return maybeBody.error;
    }
  }
  return `API returned ${status} ${statusText}`;
}
var command8 = {
  command: "credentials:test",
  describe: "Test your API key and show account status \u2014 credits, expiry (0 credits)",
  builder: {},
  handler: async () => {
    try {
      const { apiKey, baseUrl } = getConfig();
      const response = await fetch(`${baseUrl}/credentials/test`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        console.log(
          JSON.stringify({
            success: false,
            data: {
              valid: false,
              status: response.status,
              message: extractErrorMessage(
                body,
                response.status,
                response.statusText
              )
            }
          })
        );
        process.exit(1);
        return;
      }
      const data = await response.json();
      outputSuccess(data);
    } catch (error) {
      outputError(error);
    }
  }
};
var credentials_test_default = command8;

// src/index.ts
yargs(hideBin(process.argv)).scriptName("useresume").command(resume_create_default).command(resume_create_tailored_default).command(resume_parse_default).command(cover_letter_create_default).command(cover_letter_create_tailored_default).command(cover_letter_parse_default).command(run_get_default).command(credentials_test_default).demandCommand(1, "You must specify a command").strict().fail((msg, err) => {
  console.log(
    JSON.stringify({
      success: false,
      error: {
        code: "CLI_ERROR",
        message: msg || err?.message || "Unknown CLI error"
      }
    })
  );
  process.exit(1);
}).help().version().parse();
