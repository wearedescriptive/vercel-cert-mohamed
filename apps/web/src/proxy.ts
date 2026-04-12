import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", crypto.randomUUID());

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("x-request-id", requestHeaders.get("x-request-id")!);

  return response;
}

/** Skip Next internals, favicon, and typical `public/` assets (served from root with a file extension). Matcher must be a compile-time static string. */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|webmanifest|woff2?|ttf|otf|eot|pdf|map)$).*)",
  ],
};
