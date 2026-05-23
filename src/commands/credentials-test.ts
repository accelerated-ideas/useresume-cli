import type { CommandModule } from "yargs";
import { getConfig } from "../client.js";
import { outputSuccess, outputError } from "../output.js";

type ApiErrorBody = {
  error?: unknown;
  message?: unknown;
  details?: unknown;
  field_errors?: unknown;
};

function formatFieldErrors(fieldErrors: unknown): string | null {
  if (!Array.isArray(fieldErrors)) {
    return null;
  }

  const formatted = fieldErrors
    .map((fieldError) => {
      if (!fieldError || typeof fieldError !== "object") {
        return null;
      }

      const { path, message } = fieldError as {
        path?: unknown;
        message?: unknown;
      };

      if (typeof message !== "string") {
        return null;
      }

      const pathText = Array.isArray(path)
        ? path.map((segment) => String(segment)).join(".")
        : typeof path === "string"
          ? path
          : "";

      return pathText ? `${pathText}: ${message}` : message;
    })
    .filter((value): value is string => Boolean(value));

  return formatted.length > 0 ? formatted.join("; ") : null;
}

function extractErrorMessage(
  body: unknown,
  status: number,
  statusText: string
): string {
  if (typeof body === "object" && body !== null) {
    const maybeBody = body as ApiErrorBody;
    const primaryMessage =
      typeof maybeBody.message === "string"
        ? maybeBody.message
        : typeof maybeBody.error === "string"
          ? maybeBody.error
          : `API returned ${status} ${statusText}`;

    const extraParts = [
      typeof maybeBody.details === "string" ? maybeBody.details : null,
      formatFieldErrors(maybeBody.field_errors),
    ].filter((value): value is string => Boolean(value));

    return extraParts.length > 0
      ? `${primaryMessage} (${extraParts.join(" | ")})`
      : primaryMessage;
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
