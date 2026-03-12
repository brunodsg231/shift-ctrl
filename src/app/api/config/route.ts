import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { clearConfigCache } from "@/lib/config";

function getConfigPath(): string {
  const candidates = [
    path.resolve(process.cwd(), "config.json"),
    path.resolve(process.cwd(), "..", "config.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

export async function GET() {
  try {
    const raw = fs.readFileSync(getConfigPath(), "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to read config: " + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.PROJECTORS || !Array.isArray(body.PROJECTORS)) {
      return NextResponse.json(
        { error: "PROJECTORS must be an array" },
        { status: 400 }
      );
    }

    if (!body.RESOLUME_IP || !body.RESOLUME_PORT) {
      return NextResponse.json(
        { error: "RESOLUME_IP and RESOLUME_PORT are required" },
        { status: 400 }
      );
    }

    const config = {
      SERVER_PORT: body.SERVER_PORT || 3000,
      PROJECTORS: body.PROJECTORS.map((p: any) => ({
        name: String(p.name || "").trim(),
        ip: String(p.ip || "").trim(),
      })).filter((p: any) => p.name && p.ip),
      RESOLUME_IP: String(body.RESOLUME_IP).trim(),
      RESOLUME_PORT: Number(body.RESOLUME_PORT) || 8080,
    };

    fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), "utf-8");
    clearConfigCache();

    return NextResponse.json({ success: true, config });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to save config: " + err.message },
      { status: 500 }
    );
  }
}
