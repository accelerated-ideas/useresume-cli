import type { CommandModule } from "yargs";
import { getConfig } from "../client.js";
import { outputSuccess, outputError } from "../output.js";

function extractErrorMessage(body: unknown, status: number, statusText: string): string {
  if (typeof body === "object" && body !== null) {
    const maybeBody = body as {
      error?: unknown;
      message?: unknown;
    };

    if (typeof maybeBody.message === "string") {
      return maybeBody.message;
    }

    if (typeof maybeBody.error === "string") {
      return maybeBody.error;
    }
  }

  return `API returned ${status} ${statusText}`;
}

const command: CommandModule = {
  command: "credentials:test",
  describe:
    "Test your API key and show account status — credits, expiry (0 credits)",
  builder: {},
  handler: async () => {
    try {
      const { apiKey, baseUrl } = getConfig();
      const response = await fetch(`${baseUrl}/credentials/test`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
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
              ),
            },
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
  },
};

export default command;
