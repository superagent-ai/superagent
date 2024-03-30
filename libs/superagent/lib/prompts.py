# adapted from https://github.com/langchain-ai/langchain/blob/d1a2e194c376f241116bf8e520f1a9bb297cdf3a/libs/core/langchain_core/output_parsers/format_instructions.py
JSON_FORMAT_INSTRUCTIONS = """{base_prompt}

Always answer using the below output schema. 
The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {{"properties": {{"foo": {{"title": "Foo", "description": "a list of strings", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}} the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of the schema. The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Here is the output schema:
```
{output_schema}
```
"""
