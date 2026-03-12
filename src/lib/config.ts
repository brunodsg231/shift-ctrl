import path from "path";
import fs from "fs";

interface ProjectorConfig {
  name: string;
  ip: string;
}

interface AppConfig {
  SERVER_PORT: number;
  PROJECTORS: ProjectorConfig[];
  RESOLUME_IP: string;
  RESOLUME_PORT: number;
}

const DEFAULT_CONFIG: AppConfig = {
  SERVER_PORT: 3000,
  PROJECTORS: [
    { name: "Projector 1", ip: "192.168.1.101" },
    { name: "Projector 2", ip: "192.168.1.102" },
    { name: "Projector 3", ip: "192.168.1.103" },
  ],
  RESOLUME_IP: "127.0.0.1",
  RESOLUME_PORT: 8080,
};

let _config: AppConfig | null = null;

function getConfigPath(): string {
  // Check multiple locations: same dir as cwd, parent dir, exe dir
  const candidates = [
    path.resolve(process.cwd(), "config.json"),
    path.resolve(process.cwd(), "..", "config.json"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  // Create default config in cwd if none found
  const defaultPath = candidates[0];
  fs.writeFileSync(defaultPath, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf-8");
  return defaultPath;
}

export function getConfig(): AppConfig {
  if (_config) return _config;

  const configPath = getConfigPath();
  const raw = fs.readFileSync(configPath, "utf-8");
  _config = JSON.parse(raw) as AppConfig;
  return _config;
}

export function clearConfigCache() {
  _config = null;
}
