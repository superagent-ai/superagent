# flake8: noqa
import ast
from decouple import config
from e2b import DataAnalysis
from langchain.tools import BaseTool


class E2BCodeExecutor(BaseTool):
    name = "Code interpreter"
    description = "useful for running python code, it returns the output of the code"

    # E2B session represents a sandbox runtime for LLM - it's a microVM for every instance of an agent.
    #
    # We probably should keep an active E2B session for the whole time an agent is active.
    # If the "E2B_API_KEY" env var is set, E2B automatically loads it, no need to pass it to the constructor.
    _session = DataAnalysis(api_key=config("E2B_API_KEY"))

    def _add_last_line_print(self, code: str):
        tree = ast.parse(code)
        node = tree.body[-1]
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            if isinstance(node.value.func, ast.Name) and node.value.func.id == "print":
                return tree
        tree.body[-1] = ast.Expr(
            value=ast.Call(
                func=ast.Name(id="print", ctx=ast.Load()),
                args=[node.value],
                keywords=[],
            )
        )
        return ast.unparse(tree)

    # TODO: Once we know the the agent is done, we need to close the E2B session.
    # You most likely want to keep the E2B session active for the whole lifecycle of an agent.
    def _close_session(self):
        self._session.close()

    def _download_artifact(self, artifact):
        # Artifact is a chart file created by matplotlib
        # You can download it right from the E2B LLM Sandbox
        #
        # `artifact_bytes` is a chart file (.png) in bytes
        # TODO: Send the artifact bytes to frontend, save it to DB, etc
        artifact_bytes = artifact.download()

    def _run(self, python_code: str) -> str:
        code = self._add_last_line_print(python_code)

        # E2B offers both streaming output and artifacts or retrieving them after the code has finished running.
        stdout, err, artifacts = self._session.run_python(
            code=code,
            # TODO: To create more responsive UI, you might want to stream stdout, stderr, and artifacts
            on_stdout=lambda line: print("stdout", line),
            on_stderr=lambda line: print("stderr", line),
            on_artifact=self._download_artifact,
        )

        # Or you can download artifacts after the code has finished running:
        # for artifact in artifacts:
        #   self._download_artifact(artifact)

        if err:
            return "There was following error during execution: " + err

        return stdout

    async def _arun(self, python_code: str) -> str:
        try:
            result = self._run(python_code)
        finally:
            self._close_session()
        return result
