import { UseResumeError } from "@useresume/sdk";

export function outputSuccess(data: unknown): void {
  console.log(JSON.stringify(data));
}

export function outputError(error: unknown): void {
  let code = "ERROR";
  let message: string;

  if (error instanceof UseResumeError) {
    code = `HTTP_${error.status}`;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    code = "UNKNOWN_ERROR";
    message = String(error);
  }

  // All output goes to stdout so agents can parse it reliably
  console.log(
    JSON.stringify({
      success: false,
      error: { code, message },
    })
  );
  process.exit(1);
}
