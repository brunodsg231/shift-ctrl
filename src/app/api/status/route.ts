import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export async function GET() {
  const config = getConfig();
  return NextResponse.json({
    projectors: config.PROJECTORS.map((p) => ({ name: p.name, ip: p.ip })),
    resolume: {
      ip: config.RESOLUME_IP,
      port: config.RESOLUME_PORT,
      url: `http://${config.RESOLUME_IP}:${config.RESOLUME_PORT}`,
    },
  });
}
