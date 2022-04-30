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
