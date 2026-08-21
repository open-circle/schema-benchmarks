import { beforeAll, afterEach, afterAll } from "vitest";

import { server } from "./mocks.ts";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
