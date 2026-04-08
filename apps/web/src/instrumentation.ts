import type { Instrumentation } from "next";

export function register() {}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  console.error("[Server Error]", {
    digest: (err as Error & { digest?: string })?.digest,
    message: (err as Error & { message?: string })?.message,
    host: request.headers?.["x-forwarded-host"],
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    requestId: request.headers?.["x-request-id"],
  });

  return;
};
