"use client";

import { useState, useEffect } from "react";
import {
  Heading,
  Text,
  Button,
  Column,
  Row,
  Line,
  IconButton,
  useToast,
} from "@once-ui-system/core";

interface Projector {
  name: string;
  ip: string;
}

interface Config {
  SERVER_PORT: number;
  PROJECTORS: Projector[];
  RESOLUME_IP: string;
  RESOLUME_PORT: number;
}

export default function Settings() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() =>
        addToast({ variant: "danger", message: "Failed to load config" })
      );
  }, []);

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ variant: "success", message: "Configuration saved" });
        setConfig(data.config);
      } else {
        addToast({ variant: "danger", message: data.error });
      }
    } catch (err: any) {
      addToast({ variant: "danger", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const updateProjector = (
    index: number,
    field: "name" | "ip",
    value: string
  ) => {
    if (!config) return;
    const updated = [...config.PROJECTORS];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, PROJECTORS: updated });
  };

  const addProjector = () => {
    if (!config) return;
    setConfig({
      ...config,
      PROJECTORS: [...config.PROJECTORS, { name: "", ip: "" }],
    });
  };

  const removeProjector = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      PROJECTORS: config.PROJECTORS.filter((_, i) => i !== index),
    });
  };

  if (!config) {
    return (
      <Column fillWidth center padding="xl" style={{ minHeight: "100dvh" }}>
        <Text onBackground="neutral-weak">Loading configuration...</Text>
      </Column>
    );
  }

  return (
    <Column fillWidth horizontal="center" padding="l" style={{ minHeight: "100dvh" }}>
      <Column
        maxWidth="s"
        fillWidth
        gap="24"
        style={{ paddingTop: "env(safe-area-inset-top, 16px)" }}
      >
        {/* Header */}
        <Row fillWidth vertical="center" gap="12">
          <IconButton
            icon="back"
            variant="ghost"
            size="m"
            href="/"
            tooltip="Back"
          />
          <Heading variant="heading-strong-l">Settings</Heading>
        </Row>

        {/* Projectors section */}
        <Column gap="16" fillWidth>
          <Row fillWidth vertical="center">
            <Text
              variant="label-default-s"
              onBackground="neutral-weak"
              style={{
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                flex: 1,
              }}
            >
              Projectors
            </Text>
            <IconButton
              icon="plus"
              variant="ghost"
              size="s"
              onClick={addProjector}
              tooltip="Add projector"
            />
          </Row>

          {config.PROJECTORS.map((p, i) => (
            <Row key={i} gap="8" fillWidth vertical="end">
              <Column gap="4" style={{ flex: 1 }}>
                <Text
                  variant="label-default-xs"
                  onBackground="neutral-weak"
                >
                  Name
                </Text>
                <input
                  className="settings-input"
                  value={p.name}
                  onChange={(e) => updateProjector(i, "name", e.target.value)}
                  placeholder="Projector 1"
                />
              </Column>
              <Column gap="4" style={{ flex: 1 }}>
                <Text
                  variant="label-default-xs"
                  onBackground="neutral-weak"
                >
                  IP Address
                </Text>
                <input
                  className="settings-input"
                  value={p.ip}
                  onChange={(e) => updateProjector(i, "ip", e.target.value)}
                  placeholder="192.168.1.101"
                />
              </Column>
              <IconButton
                icon="trash"
                variant="ghost"
                size="s"
                onClick={() => removeProjector(i)}
                tooltip="Remove"
                style={{ marginBottom: 2 }}
              />
            </Row>
          ))}
        </Column>

        <Line background="neutral-alpha-weak" />

        {/* Resolume section */}
        <Column gap="16" fillWidth>
          <Text
            variant="label-default-s"
            onBackground="neutral-weak"
            style={{
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Resolume Arena
          </Text>

          <Row gap="12" fillWidth>
            <Column gap="4" style={{ flex: 2 }}>
              <Text
                variant="label-default-xs"
                onBackground="neutral-weak"
              >
                IP Address
              </Text>
              <input
                className="settings-input"
                value={config.RESOLUME_IP}
                onChange={(e) =>
                  setConfig({ ...config, RESOLUME_IP: e.target.value })
                }
                placeholder="127.0.0.1"
              />
            </Column>
            <Column gap="4" style={{ flex: 1 }}>
              <Text
                variant="label-default-xs"
                onBackground="neutral-weak"
              >
                Port
              </Text>
              <input
                className="settings-input"
                type="number"
                value={config.RESOLUME_PORT}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    RESOLUME_PORT: Number(e.target.value) || 8080,
                  })
                }
                placeholder="8080"
              />
            </Column>
          </Row>
        </Column>

        <Line background="neutral-alpha-weak" />

        {/* Server section */}
        <Column gap="16" fillWidth>
          <Text
            variant="label-default-s"
            onBackground="neutral-weak"
            style={{
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Server
          </Text>
          <Column gap="4" style={{ maxWidth: 160 }}>
            <Text
              variant="label-default-xs"
              onBackground="neutral-weak"
            >
              Port
            </Text>
            <input
              className="settings-input"
              type="number"
              value={config.SERVER_PORT}
              onChange={(e) =>
                setConfig({
                  ...config,
                  SERVER_PORT: Number(e.target.value) || 3000,
                })
              }
              placeholder="3000"
            />
          </Column>
        </Column>

        {/* Save button */}
        <Column fillWidth paddingTop="8">
          <button
            className="ctrl-btn"
            onClick={save}
            disabled={saving}
            style={{
              width: "100%",
              minHeight: 48,
              borderRadius: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              color: "var(--neutral-on-background-strong)",
              borderColor: "var(--brand-solid-strong)",
            }}
          >
            {saving ? (
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid var(--neutral-border-medium)",
                  borderTopColor: "var(--brand-solid-strong)",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
            ) : null}
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </Column>
      </Column>
    </Column>
  );
}
