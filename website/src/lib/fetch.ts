import * as v from "valibot";

export class HTTPError extends Error {
  constructor(public response: Response) {
    super(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
}

export async function fetchJson<TSchema extends v.GenericSchema>(
  schema: TSchema,
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, init);
  if (!response.ok) throw new HTTPError(response);
  return v.parse(schema, await response.json());
}
