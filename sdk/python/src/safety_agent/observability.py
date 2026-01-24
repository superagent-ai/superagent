"""
OpenTelemetry helpers for Safety Agent hooks.
"""

from __future__ import annotations

from typing import Any

from .types import GuardHooks, GuardSegmentEvent, GuardStartEvent, GuardResultEvent, GuardErrorEvent


def _set_attributes(span: Any, attributes: dict[str, Any]) -> None:
    if span is None:
        return
    setter = getattr(span, "set_attribute", None)
    if not callable(setter):
        return
    for key, value in attributes.items():
        setter(key, value)


def _add_segment_event(span: Any, event: GuardSegmentEvent) -> None:
    if span is None:
        return
    add_event = getattr(span, "add_event", None)
    if not callable(add_event):
        return
    add_event(
        "guard.segment",
        {
            "guard.segment.kind": event.kind,
            "guard.segment.index": event.index,
            "guard.segment.count": event.count,
            "guard.segment.size": event.segment_size,
            "guard.segment.units": event.segment_units,
            "guard.segment.duration_ms": event.duration_ms,
            "guard.result.classification": event.result.classification,
        },
    )


def create_otel_guard_hooks(
    tracer: Any,
    *,
    span_name: str = "safety_agent.guard",
    include_segment_events: bool = True,
) -> GuardHooks:
    """
    Create GuardHooks that emit OpenTelemetry span data.

    This is dependency-free: pass any tracer/span with OTel-like methods.
    """

    span: Any | None = None

    def on_start(event: GuardStartEvent) -> None:
        nonlocal span
        start_span = getattr(tracer, "start_span", None)
        if not callable(start_span):
            return
        span = start_span(
            span_name,
            attributes={
                "guard.model": event.model,
                "guard.input.type": event.input_type,
                "guard.input.size": event.input_size,
                "guard.input.units": event.input_units,
                "guard.segment.count": event.segment_count,
            },
        )

    def on_segment(event: GuardSegmentEvent) -> None:
        if include_segment_events:
            _add_segment_event(span, event)

    def on_result(event: GuardResultEvent) -> None:
        nonlocal span
        _set_attributes(
            span,
            {
                "guard.result.classification": event.result.classification,
                "guard.result.violation_types": ",".join(event.result.violation_types),
                "guard.result.cwe_codes": ",".join(event.result.cwe_codes),
                "guard.duration_ms": event.duration_ms,
            },
        )
        end = getattr(span, "end", None)
        if callable(end):
            end()
        span = None

    def on_error(event: GuardErrorEvent) -> None:
        nonlocal span
        record_exception = getattr(span, "record_exception", None)
        if callable(record_exception):
            record_exception(event.error)
        set_status = getattr(span, "set_status", None)
        if callable(set_status):
            set_status({"code": 2, "message": "guard failed"})
        _set_attributes(
            span,
            {
                "guard.error.segment.kind": event.segment_kind or "unknown",
                "guard.error.segment.index": event.segment_index or -1,
                "guard.duration_ms": event.duration_ms,
            },
        )
        end = getattr(span, "end", None)
        if callable(end):
            end()
        span = None

    return GuardHooks(
        on_start=on_start,
        on_segment=on_segment,
        on_result=on_result,
        on_error=on_error,
    )
