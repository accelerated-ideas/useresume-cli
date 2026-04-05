import { useResume } from "@useresume/sdk";

export interface ClientConfig {
  apiKey: string;
  baseUrl: string;
}

export function getConfig(): ClientConfig {
  const apiKey = process.env.USERESUME_API_KEY;
  if (!apiKey) {
    console.log(
      JSON.stringify({
        success: false,
        error: {
          code: "MISSING_API_KEY",
          message:
            "USERESUME_API_KEY environment variable is not set. Get your key at https://useresume.ai/account/api-platform",
        },
      })
    );
    process.exit(1);
  }
  const baseUrl =
    process.env.USERESUME_API_BASE_URL || "https://useresume.ai/api/v3";
  return { apiKey, baseUrl };
}

export function getClient(): useResume {
  const { apiKey, baseUrl } = getConfig();
  return new useResume(apiKey, { baseUrl });
}
