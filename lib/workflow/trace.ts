import type { TraceEvent } from "../domain/types";
import { createId } from "../utils/ids";
import { nowIso } from "../utils/dates";

export type CreateTraceEventInput = Omit<TraceEvent, "id" | "timestamp"> & {
  id?: string;
  timestamp?: string;
};

export function createTraceEvent(input: CreateTraceEventInput): TraceEvent {
  return {
    ...input,
    id: input.id ?? createId("trace"),
    timestamp: input.timestamp ?? nowIso(),
  };
}
