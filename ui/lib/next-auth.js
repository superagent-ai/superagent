import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/auth/sign-in`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const { data } = await response.json();

        if (response.ok && data.user) {
          return {
            user: data.user,
            token: data.token,
          };
        }

        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ user, token, account }) {
      if (user) {
        token.user = user;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.oauthToken = token.accessToken;
      return session;
    },
    async signIn(credentials) {
      let response;
      const oauthObject = credentialObjBuilder(credentials);

      if (oauthObject.password) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/auth/sign-in`,
          {
            method: "POST",
            body: JSON.stringify(oauthObject),
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/auth/oauth/callback`,
          {
            method: "POST",
            body: JSON.stringify(oauthObject),
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const { data } = await response.json();
      if (response.ok && data) {
        return true;
        return {
          user: data,
          token: data.token,
        };
      }

      return false;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
};

export function credentialObjBuilder(data) {
  const { provider } = data.account;

  if (provider === "github") {
    return {
      email: data.user.email,
      name: data.user.name,
      access_token: data.account.access_token,
      provider: data.account.provider,
    };
  } else if (provider === "azure-ad") {
    return {
      email: data.user.email,
      name: data.user.name,
      access_token: data.account.access_token,
      provider: data.account.provider,
    };
  } else if (provider === "google") {
    return {
      email: data.user.email,
      name: data.user.name,
      access_token: data.account.access_token,
      provider: data.account.provider,
    };
  } else {
    return {
      email: data.credentials.email,
      password: data.credentials.password,
    };
  }
}
