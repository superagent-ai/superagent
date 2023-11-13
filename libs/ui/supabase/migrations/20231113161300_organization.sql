CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  api_key VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  is_onboarded BOOLEAN DEFAULT false,
  created_at timestamptz default now()
);