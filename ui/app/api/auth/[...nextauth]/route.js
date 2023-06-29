import NextAuth from "next-auth";
import { options } from "@/lib/next-auth";

const handler = NextAuth(options);

export const GET = handler;

export const POST = handler;
