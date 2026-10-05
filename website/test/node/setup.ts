import { network } from "virtual:msw";
import { beforeAll, afterEach, afterAll } from "vite-plus/test";

beforeAll(() => network.enable());
afterEach(() => network.resetHandlers());
afterAll(() => network.disable());
