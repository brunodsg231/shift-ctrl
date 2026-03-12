"use client";

import { useState, useEffect, useCallback } from "react";
import { Text, Column, Row, useToast } from "@once-ui-system/core";
import Image from "next/image";

interface Projector {
  name: string;
  ip: string;
}

interface StatusData {
  projectors: Projector[];
  resolume: {
    ip: string;
    port: number;
    url: string;
  };
}

export default function Home() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [projectorStates, setProjectorStates] = useState<
    Record<string, "on" | "off" | "idle">
  >({});
  const { addToast } = useToast();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const send = async (url: string, id: string) => {
    setLoading(id);
    try {
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (data.projectors) {
        const errors = data.projectors.filter(
          (p: { success: boolean }) => !p.success
        );
        if (errors.length > 0) {
          addToast({
            variant: "danger",
            message: errors
              .map(
                (e: { name: string; error: string }) =>
                  `${e.name}: ${e.error}`
              )
              .join(" | "),
          });
        } else {
          const newStates: Record<string, "on" | "off"> = {};
          data.projectors.forEach((p: { name: string }) => {
            newStates[p.name] = data.action === "on" ? "on" : "off";
          });
          setProjectorStates((prev) => ({ ...prev, ...newStates }));
          addToast({
            variant: "success",
            message: `Projectors ${data.action === "on" ? "powered on" : "powered off"}`,
          });
        }
      } else if (data.success === false) {
        addToast({ variant: "danger", message: data.error || "Unknown error" });
      } else {
        addToast({ variant: "success", message: "Command sent" });
      }
    } catch (err: any) {
      addToast({ variant: "danger", message: err.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="app-shell">
      {/* Settings */}
      <a href="/settings" className="settings-btn" aria-label="Settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </a>

      {/* Header */}
      <div className="header-block">
        <Image
          src="/logo.png"
          alt="SHIFT"
          width={176}
          height={40}
          priority
          style={{ objectFit: "contain", width: "clamp(128px, 40vw, 176px)", height: "auto" }}
        />
        <span className="header-sub">Event Controller</span>
      </div>

      {/* Status */}
      {status && (
        <div className="status-row">
          {status.projectors.map((p) => (
            <div key={p.ip} className="status-chip">
              <div
                className={`status-dot status-dot--${projectorStates[p.name] || "idle"}`}
              />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projectors */}
      <div className="section">
        <span className="section-label">Projectors</span>
        <div className="btn-stack">
          <div className="glow-wrap glow-wrap--green">
            <button
              className="ctrl-btn ctrl-btn--on"
              disabled={loading !== null}
              onClick={() => send("/api/projectors/on", "on")}
            >
              {loading === "on" ? (
                <span className="spinner" />
              ) : (
                <span className="dot dot--green" />
              )}
              <span className="btn-text">Power On</span>
            </button>
          </div>

          <div className="glow-wrap glow-wrap--red">
            <button
              className="ctrl-btn ctrl-btn--off"
              disabled={loading !== null}
              onClick={() => send("/api/projectors/off", "off")}
            >
              {loading === "off" ? (
                <span className="spinner" />
              ) : (
                <span className="dot dot--red" />
              )}
              <span className="btn-text">Power Off</span>
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-row">
        <div className="divider-line" />
        <span className="divider-text">Resolume · L1</span>
        <div className="divider-line" />
      </div>

      {/* Resolume */}
      <div className="section">
        <div className="btn-row">
          <div className="glow-wrap glow-wrap--amber" style={{ flex: 1 }}>
            <button
              className="ctrl-btn ctrl-btn--clip"
              disabled={loading !== null}
              onClick={() => send("/api/resolume/clip/1", "clip1")}
            >
              {loading === "clip1" ? (
                <span className="spinner" />
              ) : (
                <span className="tri" />
              )}
              <span className="btn-text">Clip 1</span>
            </button>
          </div>
          <div className="glow-wrap glow-wrap--amber" style={{ flex: 1 }}>
            <button
              className="ctrl-btn ctrl-btn--clip"
              disabled={loading !== null}
              onClick={() => send("/api/resolume/clip/2", "clip2")}
            >
              {loading === "clip2" ? (
                <span className="spinner" />
              ) : (
                <span className="tri" />
              )}
              <span className="btn-text">Clip 2</span>
            </button>
          </div>
        </div>

        <div className="glow-wrap glow-wrap--neutral">
          <button
            className="ctrl-btn ctrl-btn--stop"
            disabled={loading !== null}
            onClick={() => send("/api/resolume/stop", "stop")}
          >
            {loading === "stop" ? (
              <span className="spinner" />
            ) : (
              <span className="sq" />
            )}
            <span className="btn-text btn-text--muted">Stop</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-text">
        {status ? status.resolume.url : "offline"}
      </div>
    </div>
  );
}
