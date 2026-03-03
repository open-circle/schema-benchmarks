import { createIsomorphicFn } from "@tanstack/react-start";
import { WebHaptics } from "web-haptics";

export const haptics = createIsomorphicFn().client(() => new WebHaptics())();
