const cURL = `\`\`\`bash
# cURL request to agent predict endpoint.
curl -X POST /api/v1/agents/{agentId}/predict
   -H "Content-Type: application/json"
   -H "X_SUPERAGENT_API_KEY: <api_token>"
   -d '{"input": {"human_input": "Hello!"}, "has_streaming": true}'
\`\`\``;

const javascript = `\`\`\`jsx
# Javascript request to agent predict endpoint.
const requestOptions = {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json'
        'X_SUPERAGENT_API_KEY': '<api_token>'
    },
    body: JSON.stringify({ 
        input: {human_input: 'Hello!'},
        has_streaming: true, 
    })
};

const response = await fetch(
    '/api/v1/agents/{agentId}/predict', 
    requestOptions
);
const data = await response.json();
\`\`\``;

const python = `\`\`\`python
# Python request to agent predict endpoint.
import requests

url = '/api/v1/agents/{agentId}/predict'
headers = {'X_SUPERAGENT_API_KEY': '<api_token>'}
payload = {'input': {'human_input': 'Hello!'}, has_streaming: true}

response = requests.post(url, data = payload, headers = headers)

print(response.text)
\`\`\``;

const php = `\`\`\`php
# PHP request to agent predict endpoint.
<?php
$url = "/api/v1/agents/{agentId}/predict";
$data = [
    'input' => [
        'human_input' => 'Hello!'
    ],
    'has_streaming' => true
];

$headers = array(
    "Content-Type: application/json",
    "X_SUPERAGENT_API_KEY: <api_token>"
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
\`\`\``;

export const API_DOCS = [
  {
    id: "curl",
    label: "cURL",
    code: cURL,
  },
  {
    id: "javascript",
    label: "Javascript",
    code: javascript,
  },
  {
    id: "python",
    label: "Python",
    code: python,
  },
  {
    id: "php",
    label: "PHP",
    code: php,
  },
];
