# Chatbot with Tool Usage - Setup Guide

This Chrome extension implements a chatbot with tool usage following the AI SDK guide:
https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage

## Features

- ✅ Streaming chat responses
- ✅ Server-side tool execution (getWeatherInformation)
- ✅ Client-side tool execution (getLocation)
- ✅ Interactive tool confirmation (askForConfirmation)
- ✅ Auto-growing textarea with Enter to send
- ✅ Tool state visualization
- ✅ File attachment support
- ✅ Voice input button
- ✅ Model selection UI

## Quick Start

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the server directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

### 3. Start the Backend Server (Next.js)

```bash
cd server
npm install  # Install dependencies first
npm run dev  # Start Next.js dev server
```

For production:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` with the following tools:
- **getWeatherInformation** - Returns weather for a city (auto-executes server-side)
- **askForConfirmation** - Asks user for confirmation (client-side with UI)
- **getLocation** - Gets user location after confirmation (client-side)

### 4. Build the Extension

```bash
# From the chrome extension root
npm run build
```

### 5. Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

## How It Works

### Architecture

```
Chrome Extension (Client) <--> Backend Server <--> OpenAI API
```

1. **Client** (React + AI SDK):
   - Uses `useChat` hook from `@ai-sdk/react`
   - Renders message parts (text, tools)
   - Handles client-side tool execution
   - Displays tool confirmation UI

2. **Server** (Node.js + AI SDK):
   - Uses `streamText` from `ai` package
   - Defines and executes server-side tools
   - Streams responses back to client

3. **OpenAI API**:
   - Processes messages
   - Decides when to use tools
   - Generates responses

### Tool Types

#### 1. Server-Side Tools (Auto-Execute)

```javascript
getWeatherInformation: {
  description: 'Show the weather in a given city',
  parameters: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    // Executes on server automatically
    return `Weather in ${city}...`;
  },
}
```

#### 2. Client-Side Tools (Manual Handling)

```javascript
getLocation: {
  description: 'Get user location',
  parameters: z.object({}),
  // No execute function - client handles it
}
```

Client handles in `onToolCall`:
```javascript
async onToolCall({ toolCall }) {
  if (toolCall.toolName === "getLocation") {
    addToolResult({
      tool: "getLocation",
      toolCallId: toolCall.toolCallId,
      output: "New York",
    });
  }
}
```

#### 3. Interactive Tools (User Confirmation)

```javascript
askForConfirmation: {
  description: 'Ask user for confirmation',
  parameters: z.object({
    message: z.string(),
  }),
  // No execute - UI renders confirmation buttons
}
```

UI renders based on tool state:
```jsx
{part.type === "tool-askForConfirmation" && (
  <div>
    <p>{part.input.message}</p>
    <Button onClick={() => addToolResult({
      tool: "askForConfirmation",
      toolCallId: part.toolCallId,
      output: "Yes, confirmed"
    })}>Yes</Button>
  </div>
)}
```

### Message Structure

Messages use a `parts` array structure:

```javascript
{
  id: "msg_123",
  role: "assistant",
  parts: [
    { type: "text", text: "I'll check the weather" },
    {
      type: "tool-getWeatherInformation",
      toolCallId: "call_456",
      state: "output-available",
      output: "Weather in NYC is sunny"
    },
    { type: "text", text: "The weather is sunny!" }
  ]
}
```

### Tool States

Tools progress through states:
- `input-streaming` - Tool input is being generated
- `input-available` - Tool input is ready
- `output-available` - Tool execution completed
- `output-error` - Tool execution failed

## Configuration

### Environment Variables

**Client (.env)**:
```bash
AGENT_API_URL=http://localhost:3000/api/chat
```

**Server (.env)**:
```bash
OPENAI_API_KEY=your_key_here
PORT=3000
```

### Customizing Tools

Add new tools in [server/app/api/chat/route.ts](server/app/api/chat/route.ts):

```javascript
tools: {
  yourCustomTool: {
    description: 'Description of your tool',
    parameters: z.object({
      param1: z.string(),
      param2: z.number().optional(),
    }),
    execute: async ({ param1, param2 }) => {
      // Your tool logic here
      return "Tool result";
    },
  },
}
```

## Testing the Chatbot

### Test Weather Tool (Server-Side)

**User**: "What's the weather in San Francisco?"

**Expected**:
1. AI calls `getWeatherInformation` tool
2. Tool executes on server
3. AI responds with weather info

### Test Confirmation Tool (Interactive)

**User**: "Delete all my files"

**Expected**:
1. AI asks for confirmation using `askForConfirmation`
2. UI shows Yes/No buttons
3. User clicks Yes or No
4. AI proceeds based on confirmation

### Test Location Tool (Client-Side)

**User**: "What's the weather at my location?"

**Expected**:
1. AI calls `getLocation` tool
2. Client-side handler returns mock location
3. AI uses location to check weather

## Troubleshooting

### Messages not appearing

- Check browser console for errors
- Verify server is running on port 3000
- Check network tab for API requests

### Tools not executing

- Verify tool names match between client and server
- Check server logs for tool execution
- Ensure `onToolCall` handler is implemented for client tools

### CORS errors

- Server has CORS headers configured
- Check `Access-Control-Allow-Origin` is set
- Verify API URL in `.env` is correct

### TypeScript errors

If you see errors about `approval` or tool states:
- These are from unused ai-elements components
- They've been renamed to `.skip` files
- They won't affect the build

## Production Deployment

### Deploy Backend

**Option 1: Vercel**
```bash
cd server
vercel --prod
```

**Option 2: Railway**
```bash
railway up
```

**Option 3: Your VPS**
```bash
cd server
npm run build
pm2 start "npm start" --name chat-api
```

### Update Extension

1. Update `.env`:
```bash
AGENT_API_URL=https://your-api-domain.com/api/chat
```

2. Rebuild:
```bash
npm run build
```

3. Submit to Chrome Web Store

## Security Notes

- ⚠️ Never put API keys in extension code
- ⚠️ Always use backend server for AI API calls
- ⚠️ Add authentication for production
- ⚠️ Implement rate limiting on server
- ⚠️ Validate all tool inputs on server

## Resources

- [AI SDK Documentation](https://ai-sdk.dev)
- [AI SDK Chatbot Guide](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions)

## Package Versions

- `ai`: ^5.0.82
- `@ai-sdk/react`: ^2.0.82
- `@ai-sdk/openai`: ^2.0.57
- `zod`: ^3.23.8
