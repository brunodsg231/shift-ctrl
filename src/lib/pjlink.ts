import net from "net";
import crypto from "crypto";

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

export function sendPJLink(
  ip: string,
  command: string,
  password: string = ""
): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let response = "";
    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error(`Timeout connecting to ${ip}`));
    }, 5000);

    socket.connect(4352, ip, () => {
      log(`Connected to ${ip}:4352`);
    });

    socket.on("data", (data) => {
      const str = data.toString();
      response += str;

      if (str.startsWith("PJLINK")) {
        if (str.includes("PJLINK 1 ")) {
          const token = str.split("PJLINK 1 ")[1].trim();
          const hash = crypto
            .createHash("md5")
            .update(token + password)
            .digest("hex");
          socket.write(hash + command + "\r");
        } else {
          socket.write(command + "\r");
        }
      } else if (str.startsWith("%")) {
        clearTimeout(timeout);
        socket.destroy();
        resolve(str.trim());
      }
    });

    socket.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`PJLink error for ${ip}: ${err.message}`));
    });

    socket.on("close", () => {
      clearTimeout(timeout);
    });
  });
}

export { log };
