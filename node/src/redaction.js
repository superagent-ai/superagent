export function initializeSensitivePatterns() {
  return [
    // ==== OPENAI & AI PROVIDERS - Keep specific API key patterns ====
    /sk-proj-[A-Za-z0-9_-]{20,}/g,                // OpenAI project-scoped key
    /dtn_[A-Za-z0-9_]{60,}/g,                     // Daytona API key
    /e2b_[A-Za-z0-9_]{32,}/g,                     // E2B API key
    /sk-ant-[A-Za-z0-9_-]{20,}/g,                 // Anthropic API key
    /sk-or-[A-Za-z0-9_-]{20,}/g,                  // OpenAI org-scoped key
    /sk-[A-Za-z0-9_-]{24,}/g,                     // OpenAI generic secret
    /gsk_[A-Za-z0-9_-]{20,}/g,                    // Google Generative AI Studio key
    /xai-[A-Za-z0-9_-]{20,}/g,                    // xAI key

    // ==== GITHUB - Keep specific token patterns ====
    /ghp_[A-Za-z0-9_]{36}/g,                      // GitHub PAT (classic)
    /gho_[A-Za-z0-9_]{36}/g,                      // GitHub OAuth token
    /ghs_[A-Za-z0-9_]{36}/g,                      // GitHub App server-to-server
    /ghu_[A-Za-z0-9_]{36}/g,                      // GitHub App user-to-server
    /ghr_[A-Za-z0-9_]{36}/g,                      // GitHub refresh token
    /github_pat_[A-Za-z0-9_]{22}_[A-Za-z0-9_]{59}/g, // GitHub fine-grained PAT

    // ==== GITLAB ====
    /glpat-[A-Za-z0-9_-]{20,}/g,                  // GitLab PAT

    // ==== AWS - Keep specific patterns ====
    /AKIA[0-9A-Z]{16}/g,                          // AWS access key ID (long-lived)
    /ASIA[0-9A-Z]{16}/g,                          // AWS temporary access key ID
    /(aws_)?secret(access)?(_)?key\s*[:=]\s*["']?[A-Za-z0-9\/+=]{35,}["']?/gi, // AWS secret key

    // ==== GOOGLE API KEYS ====
    /AIza[0-9A-Za-z-_]{35}/g,                     // Google API key (common AIza prefix)
    /ya29\.[0-9A-Za-z-_]+/g,                      // Google OAuth access token
    /GOCSPX-[A-Za-z0-9-_]{20,}/g,                 // Google OAuth client secret

    // ==== SLACK ====
    /xoxb-[A-Za-z0-9-]{10,}-[A-Za-z0-9-]{10,}-[A-Za-z0-9-]{20,}/g, // Slack bot token
    /xoxp-[A-Za-z0-9-]{10,}-[A-Za-z0-9-]{10,}-[A-Za-z0-9-]{20,}/g, // Slack user token
    /xoxa-[A-Za-z0-9-]{10,}-[A-Za-z0-9-]{10,}-[A-Za-z0-9-]{20,}/g, // Slack workspace token
    /xapp-1-[A-Z0-9-]{10,}-[0-9]{13,}-[A-Za-z0-9]{64,}/g,          // Slack App level token

    // ==== STRIPE ====
    /sk_live_[0-9a-zA-Z]{24,}/g,                  // Stripe live secret key
    /sk_test_[0-9a-zA-Z]{24,}/g,                  // Stripe test secret key
    /rk_live_[0-9a-zA-Z]{24,}/g,                  // Stripe restricted key live
    /rk_test_[0-9a-zA-Z]{24,}/g,                  // Stripe restricted key test
    /whsec_[A-Za-z0-9]{32,}/g,                    // Stripe webhook secret

    // ==== TWILIO ====
    /AC[0-9a-fA-F]{32}/g,                         // Twilio Account SID
    /SK[0-9a-fA-F]{32}/g,                         // Twilio API Key SID

    // ==== SENDGRID / MAIL PROVIDERS ====
    /SG\.[A-Za-z0-9_\-\.]{66}/g,                  // SendGrid API key
    /key-[0-9a-f]{32}/g,                          // Mailgun API key (specific with 'key-' prefix)
    /xkeysib-[A-Za-z0-9]{64}-[A-Za-z0-9]{16}/g,   // SendInBlue API key

    // ==== PAYMENT / CREDIT CARDS ====
    /\b4[0-9]{12}(?:[0-9]{3})?\b/g,               // Visa (no spaces)
    /\b4[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g, // Visa (with spaces/dashes)
    /\b5[1-5][0-9]{14}\b/g,                       // MasterCard (no spaces)
    /\b5[1-5][0-9]{2}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g, // MasterCard (with spaces/dashes)
    /\b3[47][0-9]{13}\b/g,                        // AmEx (no spaces)
    /\b3[47][0-9]{2}[\s-]?[0-9]{6}[\s-]?[0-9]{5}\b/g, // AmEx (with spaces/dashes)
    /\b6(?:011|5[0-9]{2})[0-9]{12}\b/g,           // Discover (no spaces)
    /\b6(?:011|5[0-9]{2})[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g, // Discover (with spaces/dashes)


    // ==== EMAIL ADDRESSES ====
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, // Email addresses

    // ==== DATABASE CONNECTION STRINGS - With passwords ====
    /\bpostgres(?:ql)?:\/\/[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[^\s]+\/[A-Za-z0-9_.-]+/g,
    /\bmongodb(?:\+srv)?:\/\/[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[^\s]+\/[A-Za-z0-9_.-]+/g,
    /\bmysql:\/\/[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[^\s]+\/[A-Za-z0-9_.-]+/g,
    /\bredis:\/\/[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[A-Za-z0-9_.:-]+/g,

    // ==== JWT TOKENS ====
    /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, // JWT tokens

    // ==== SSH KEYS ====
    /-----BEGIN (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----[\s\S]+?-----END (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/g,

    // ==== OTHER SPECIFIC API KEYS ====
    /\bDD_API_KEY\b[^\n]{0,40}[:=]\s*[0-9a-f]{32}\b/gi,         // Datadog
    /\bDD_APP_KEY\b[^\n]{0,40}[:=]\s*[0-9a-f]{40}\b/gi,         // Datadog
    /NRAK-[A-Z0-9]{27}/g,                                        // New Relic ingest key
    /NRAL-[A-Z0-9]{27}/g,                                        // New Relic license key
    /shpat_[a-f0-9]{32}/g,                                       // Shopify private app access token
    /shpss_[a-f0-9]{32}/g,                                       // Shopify shared secret
    /npm_[A-Za-z0-9]{36}/g,                                      // npm access token
    /\bpypi-AgENdGV\w{20,}\b/g,                                 // PyPI token
    /EAA[A-Za-z0-9]{20,}/g,                                      // Facebook access token
    /\bBearer\s+AAAAAAAA[A-Za-z0-9%\-_]{20,}/g,                 // Twitter bearer token
    /lin_[A-Za-z0-9]{40}/g,                                      // Linear API key
    /secret_[A-Za-z0-9]{43}/g,                                   // Notion token
    // Removed: key[A-Za-z0-9]{14} - too broad, would catch regular file names
    /CFPAT-[A-Za-z0-9_-]{50,}/g,                                // Contentful API token
    /sdk-[A-Za-z0-9_-]{32,}/g,                                  // LaunchDarkly SDK key (made more specific)
    /mob-[A-Za-z0-9_-]{32,}/g,                                  // LaunchDarkly Mobile key (made more specific)
    /r8_[A-Za-z0-9]{32,}/g,                                      // Replicate API token

    // ==== CRYPTO WALLETS ====
    /\b0x[a-fA-F0-9]{40}\b/g,                                    // Ethereum address
    /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,                     // Bitcoin (legacy)
    /\bbc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{11,71}\b/g,       // Bitcoin Bech32

    // ==== SPECIFIC SECRET PATTERNS WITH CONTEXT ====
    /\b(SECRET_KEY|API_SECRET|CLIENT_SECRET|PRIVATE_KEY)\b\s*[:=]\s*["']?[A-Za-z0-9\-_.+/=]{16,}["']?/gi,
    /\b(password|passwd|pwd)\b\s*[:=]\s*["']?[^\s"']{8,}["']?/gi,
    /\b(api_key|apikey|api_token|access_token)\b\s*[:=]\s*["']?[A-Za-z0-9\-_.]{16,}["']?/gi,
  ];
}