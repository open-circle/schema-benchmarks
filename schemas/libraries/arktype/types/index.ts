import { getArkTypeSchema } from "..";

export const schema = getArkTypeSchema();

export type Input = (typeof schema)["inferIn"];

export type Output = (typeof schema)["infer"];
