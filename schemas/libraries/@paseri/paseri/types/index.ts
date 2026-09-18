import { getPaseriSchema } from "..";

export const schema = getPaseriSchema();

export const noInference =
  "The inferred type of a paseri schema cannot be named or serialized (TS2883, TS7056), so a schema has to be annotated with the type it describes.";
