import { type NextRequest, NextResponse } from "next/server";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const body = await getLLMText(page);

  return new NextResponse(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
