import { GetServerSidePropsContext } from "next/types";

type ApiPathname = `/${string}`;

type JsonResponse<T> = Promise<T>;

export function getSsrData(): JsonResponse<Record<string, string>> {
  return get("/ssr", undefined).then((res) => res.json());
}

function get(pathname: ApiPathname, query: string | undefined) {
  return request("GET", pathname, query, undefined);
}

function post(
  pathname: ApiPathname,
  query: string | undefined,
  body: RequestInit["body"]
) {
  return request("POST", pathname, query, body);
}

export function request(
  method: RequestInit["method"],
  pathname: ApiPathname,
  query: string | undefined,
  body: RequestInit["body"]
) {
  const url = `${pathname}${query ? `?${query}` : ""}`;
  return fetch(`http://backend:8000/${url}`, { method, body });
}

export function syncSession(context: GetServerSidePropsContext) {
  const cookieValue = context.req.headers.cookie;
  if (!cookieValue) {
    return fetch("http://backend:8000/sync_session").then((res) => {
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

const COOKIE_PATTERN = /token=([0-9a-z]+);/i;
