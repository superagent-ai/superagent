import type { GuardHooks, GuardSegmentEvent, GuardStartEvent, GuardResultEvent, GuardErrorEvent } from "../types.js";

export type OtelSpanLike = {
  setAttribute?: (key: string, value: unknown) => void;
  addEvent?: (name: string, attributes?: Record<string, unknown>) => void;
  recordException?: (error: unknown) => void;
  setStatus?: (status: { code: number; message?: string }) => void;
  end?: () => void;
};

export type OtelTracerLike = {
  startSpan: (name: string, options?: { attributes?: Record<string, unknown> }) => OtelSpanLike;
};

export interface OtelGuardHookOptions {
  spanName?: string;
  includeSegmentEvents?: boolean;
}

const STATUS_ERROR = 2;

function setAttributes(span: OtelSpanLike | null, attributes: Record<string, unknown>): void {
  if (!span?.setAttribute) return;
  Object.entries(attributes).forEach(([key, value]) => {
    span.setAttribute?.(key, value);
  });
}

function addSegmentEvent(span: OtelSpanLike | null, event: GuardSegmentEvent): void {
  if (!span?.addEvent) return;
  span.addEvent("guard.segment", {
    "guard.segment.kind": event.kind,
    "guard.segment.index": event.index,
    "guard.segment.count": event.count,
    "guard.segment.size": event.segmentSize,
    "guard.segment.units": event.segmentUnits,
    "guard.segment.duration_ms": event.durationMs,
    "guard.result.classification": event.result.classification,
  });
}

export function createOtelGuardHooks(
  tracer: OtelTracerLike,
  options: OtelGuardHookOptions = {}
): GuardHooks {
  let span: OtelSpanLike | null = null;
  const spanName = options.spanName ?? "safety_agent.guard";
  const includeSegmentEvents = options.includeSegmentEvents ?? true;

  const onStart = (event: GuardStartEvent): void => {
    span = tracer.startSpan(spanName, {
      attributes: {
        "guard.model": event.model,
        "guard.input.type": event.inputType,
        "guard.input.size": event.inputSize,
        "guard.input.units": event.inputUnits,
        "guard.segment.count": event.segmentCount,
      },
    });
  };

  const onSegment = (event: GuardSegmentEvent): void => {
    if (!includeSegmentEvents) return;
    addSegmentEvent(span, event);
  };

  const onResult = (event: GuardResultEvent): void => {
    setAttributes(span, {
      "guard.result.classification": event.result.classification,
      "guard.result.violation_types": event.result.violation_types.join(","),
      "guard.result.cwe_codes": event.result.cwe_codes.join(","),
      "guard.duration_ms": event.durationMs,
    });
    span?.end?.();
    span = null;
  };

  const onError = (event: GuardErrorEvent): void => {
    span?.recordException?.(event.error);
    span?.setStatus?.({ code: STATUS_ERROR, message: "guard failed" });
    setAttributes(span, {
      "guard.error.segment.kind": event.segmentKind ?? "unknown",
      "guard.error.segment.index": event.segmentIndex ?? -1,
      "guard.duration_ms": event.durationMs,
    });
    span?.end?.();
    span = null;
  };

  return { onStart, onSegment, onResult, onError };
}
