import { NextResponse } from "next/server";
import { openApiSpec } from "@/lib/openapi";

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
