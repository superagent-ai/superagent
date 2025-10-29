/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AGENT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
