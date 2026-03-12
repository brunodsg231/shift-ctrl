import { NextResponse, NextRequest } from "next/server";
import { getConfig } from "@/lib/config";
import { log } from "@/lib/pjlink";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number: clipNum } = await params;
  log(`Resolume clip ${clipNum} requested`);
  const config = getConfig();

  try {
    const url = `http://${config.RESOLUME_IP}:${config.RESOLUME_PORT}/api/v1/composition/layers/1/clips/${clipNum}/connect`;
    const r = await fetch(url, { method: "POST" });
    const text = await r.text();
    log(`Resolume clip ${clipNum} response: ${r.status}`);
    return NextResponse.json({
      success: true,
      clip: clipNum,
      status: r.status,
      body: text,
    });
  } catch (err: any) {
    log(`Resolume clip ${clipNum} error: ${err.message}`);
    return NextResponse.json({
      success: false,
      clip: clipNum,
      error: err.message,
    });
  }
}
