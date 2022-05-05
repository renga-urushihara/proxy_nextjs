import { GetServerSidePropsContext } from "next/types";

const SERVER_URL = "http://backend:8000";

const COOKIE_PATTERN = /token=([0-9a-z]+);/i;

type ApiPathname = `/${string}`;

type JsonResponse<T> = Promise<T>;

export function getSsrData(
  context: GetServerSidePropsContext
): JsonResponse<Record<string, string>> {
  return get("/ssr", undefined, context).then((res) => res.json());
}

function get(
  pathname: ApiPathname,
  query: string | undefined,
  context: GetServerSidePropsContext
) {
  const cookie = context.req.headers.cookie;
  return request(
    "GET",
    pathname,
    query,
    cookie ? { cookie } : undefined,
    undefined
  );
}

export function request(
  method: RequestInit["method"],
  pathname: ApiPathname,
  query: string | undefined,
  headers?: RequestInit["headers"],
  body?: RequestInit["body"]
) {
  const url = `${pathname}${query ? `?${query}` : ""}`;
  return fetch(`${SERVER_URL}${url}`, { method, headers, body });
}

export function syncSession(context: GetServerSidePropsContext) {
  const cookieValue = context.req.headers.cookie;
  if (!cookieValue) {
    return fetch(`${SERVER_URL}/sync_session`).then((res) => {
      const setCookieString = res.headers.get("Set-Cookie");
      if (!setCookieString) {
        throw new Error("Fatal Error: invalid http header");
      }
      const sessionId = getSessionId(setCookieString);
      if (sessionId) {
        context.res.setHeader("Set-Cookie", setCookieString);
      }
      return sessionId;
    });
  }
  return Promise.resolve(cookieValue.split("=")?.[1]);
}

function getSessionId(cookieString: string) {
  return COOKIE_PATTERN.exec(cookieString)?.[1] ?? "";
}
