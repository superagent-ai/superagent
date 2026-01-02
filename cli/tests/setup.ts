import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Load environment variables from root .env file
config({ path: resolve(__dirname, "../../.env") });
