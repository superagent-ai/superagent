"""
Guard observability hook tests
"""

from safety_agent import create_client, GuardHooks
from safety_agent.types import (
    AnalysisResponse,
    AnalysisResponseChoice,
    ChatMessage,
    TokenUsage,
)


async def test_guard_hooks_emit_events(monkeypatch):
    async def fake_call_provider(model, messages, response_format=None):
        return AnalysisResponse(
            id="test",
            usage=TokenUsage(prompt_tokens=1, completion_tokens=1, total_tokens=2),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(
                        role="assistant",
                        content='{"classification":"pass","violation_types":[],"cwe_codes":[]}',
                    ),
                )
            ],
        )

    monkeypatch.setattr("safety_agent.client.call_provider", fake_call_provider)

    client = create_client(api_key="test-key")

    start_events = []
    segment_events = []
    result_events = []

    hooks = GuardHooks(
        on_start=start_events.append,
        on_segment=segment_events.append,
        on_result=result_events.append,
    )

    await client.guard(
        input="one two three four five six seven eight nine ten eleven twelve",
        model="openai/gpt-4o-mini",
        chunk_size=10,
        hooks=hooks,
    )

    assert len(start_events) == 1
    assert len(segment_events) == start_events[0].segment_count
    assert len(segment_events) > 1
    assert len(result_events) == 1


async def test_guard_hooks_emit_error(monkeypatch):
    async def failing_call_provider(model, messages, response_format=None):
        raise RuntimeError("provider failure")

    monkeypatch.setattr("safety_agent.client.call_provider", failing_call_provider)

    client = create_client(api_key="test-key")

    error_events = []

    hooks = GuardHooks(on_error=error_events.append)

    try:
        await client.guard(
            input="short input",
            model="openai/gpt-4o-mini",
            chunk_size=0,
            hooks=hooks,
        )
    except RuntimeError:
        pass

    assert len(error_events) == 1
