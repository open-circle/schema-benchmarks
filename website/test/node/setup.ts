import { beforeAll, afterEach, afterAll } from "vite-plus/test";

import { server } from "./mocks.ts";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
