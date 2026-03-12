import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { sendPJLink, log } from "@/lib/pjlink";

export async function POST() {
  log("Projectors OFF requested");
  const config = getConfig();

  const results = await Promise.allSettled(
    config.PROJECTORS.map(async (p) => {
      const result = await sendPJLink(p.ip, "%1POWR 0");
      return { name: p.name, ip: p.ip, result };
    })
  );

  const response = results.map((r, i) => ({
    name: config.PROJECTORS[i].name,
    success: r.status === "fulfilled",
    result: r.status === "fulfilled" ? r.value.result : undefined,
    error: r.status === "rejected" ? r.reason.message : undefined,
  }));

  log(`Projectors OFF results: ${JSON.stringify(response)}`);
  return NextResponse.json({ action: "off", projectors: response });
}
