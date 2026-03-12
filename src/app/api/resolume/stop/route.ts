import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { log } from "@/lib/pjlink";

export async function POST() {
  log("Resolume stop requested");
  const config = getConfig();

  try {
    const url = `http://${config.RESOLUME_IP}:${config.RESOLUME_PORT}/api/v1/composition/layers/1/clips/connected`;
    const r = await fetch(url, { method: "DELETE" });
    const text = await r.text();
    log(`Resolume stop response: ${r.status}`);
    return NextResponse.json({
      success: true,
      status: r.status,
      body: text,
    });
  } catch (err: any) {
    log(`Resolume stop error: ${err.message}`);
    return NextResponse.json({ success: false, error: err.message });
  }
}
