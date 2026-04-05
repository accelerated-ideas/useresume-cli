import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import resumeCreate from "./commands/resume-create.js";
import resumeCreateTailored from "./commands/resume-create-tailored.js";
import resumeParse from "./commands/resume-parse.js";
import coverLetterCreate from "./commands/cover-letter-create.js";
import coverLetterCreateTailored from "./commands/cover-letter-create-tailored.js";
import coverLetterParse from "./commands/cover-letter-parse.js";
import runGet from "./commands/run-get.js";
import credentialsTest from "./commands/credentials-test.js";

yargs(hideBin(process.argv))
  .scriptName("useresume")
  .command(resumeCreate)
  .command(resumeCreateTailored)
  .command(resumeParse)
  .command(coverLetterCreate)
  .command(coverLetterCreateTailored)
  .command(coverLetterParse)
  .command(runGet)
  .command(credentialsTest)
  .demandCommand(1, "You must specify a command")
  .strict()
  .fail((msg, err) => {
    console.log(
      JSON.stringify({
        success: false,
        error: {
          code: "CLI_ERROR",
          message: msg || err?.message || "Unknown CLI error",
        },
      })
    );
    process.exit(1);
  })
  .help()
  .version()
  .parse();
