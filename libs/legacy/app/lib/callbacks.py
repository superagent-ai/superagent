from typing import Any, Dict, List, Optional, Union

from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import AgentAction, AgentFinish, LLMResult


class StreamingCallbackHandler(BaseCallbackHandler):
    """Callback handler for streaming LLM responses."""

    def __init__(
        self, agent_type, on_llm_new_token_, on_llm_end_, on_chain_end_
    ) -> None:
        self.on_llm_new_token_ = on_llm_new_token_
        self.on_llm_end_ = on_llm_end_
        self.on_chain_end_ = on_chain_end_
        self.agent_type = agent_type
        self.token_buffer = ["", "", ""]
        self.seen_final_answer = [False]

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Print out the prompts."""
        pass

    def on_llm_new_token(self, token: str, *args, **kwargs: Any) -> None:
        """Run on new LLM token. Only available when streaming is enabled."""
        if self.agent_type == "OPENAI":
            self.on_llm_new_token_(token)

        else:
            self.token_buffer.pop(0)
            self.token_buffer.append(token)

            if self.seen_final_answer[0]:
                self.on_llm_new_token_(token)

            if self.token_buffer == ["Final", " Answer", ":"]:
                self.seen_final_answer[0] = True

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Check for Final answer and return."""
        for gen_list in response.generations:
            for gen in gen_list:
                if self.agent_type == "OPENAI":
                    if gen.message.content != "":
                        self.on_llm_end_()
                else:
                    if "Final Answer" in gen.message.content:
                        self.seen_final_answer[0] = False
                        self.on_llm_end_()

    def on_llm_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Do nothing."""
        pass

    def on_chain_start(
        self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs: Any
    ) -> None:
        """Print out that we are entering a chain."""
        pass

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> None:
        """Print out that we finished a chain."""
        self.on_chain_end_(outputs)

    def on_chain_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Do nothing."""
        pass

    def on_tool_start(
        self,
        serialized: Dict[str, Any],
        input_str: str,
        **kwargs: Any,
    ) -> None:
        """Print out the log in specified color."""
        pass

    def on_agent_action(self, action: AgentAction, **kwargs: Any) -> Any:
        """Run on agent action."""
        # st.write requires two spaces before a newline to render it
        pass

    def on_tool_end(
        self,
        output: str,
        observation_prefix: Optional[str] = None,
        llm_prefix: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        """If not the final action, print out observation."""
        pass

    def on_tool_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Do nothing."""
        pass

    def on_text(self, text: str, **kwargs: Any) -> None:
        """Run on text."""
        # st.write requires two spaces before a newline to render it
        pass

    def on_agent_finish(self, finish: AgentFinish, **kwargs: Any) -> None:
        """Run on agent end."""
        # st.write requires two spaces before a newline to render it
        pass
