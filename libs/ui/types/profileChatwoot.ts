export interface ProfileChatwoot {
  access_token?: string;
  account_id: number;
  accounts: Array<any>;
  available_name: string;
  avatar_url: string;
  confirmed: boolean;
  display_name?: string | null;
  email: string;
  id: number;
  inviter_id?: number | null;
  message_signature?: string | null;
  name: string;
  provider: string;
  pubsub_token: string;
  role: string;
  type?: string | null;
  ui_settings: object;
  uid: string;
}
