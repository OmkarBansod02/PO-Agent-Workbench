import type { Blocker } from "../domain/types";
import { createId } from "../utils/ids";

export type CreateBlockerInput = Omit<Blocker, "id"> & { id?: string };

export function createBlocker(input: CreateBlockerInput): Blocker {
  return {
    ...input,
    id: input.id ?? createId("blocker"),
  };
}
