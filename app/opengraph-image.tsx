import { ImageResponse } from "next/og"

export const alt = "FormKitCN - shadcn/ui Form Toolkit for React"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#0d1117",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 56,
            left: 72,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: 999,
            padding: "6px 16px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#7c3aed",
            }}
          />
          <span style={{ color: "#a78bfa", fontSize: 14, fontWeight: 600 }}>
            Open Source - Free - shadcn/ui Registry
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 28, fontWeight: 900 }}>
              F
            </span>
          </div>
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            FormKit
            <span style={{ color: "#7c3aed" }}>CN</span>
          </span>
        </div>

        <p
          style={{
            fontSize: 22,
            color: "#8b949e",
            margin: 0,
            marginBottom: 40,
            lineHeight: 1.4,
            maxWidth: 680,
          }}
        >
          Schema-driven form components for React. 17+ field types, multi-step
          forms, data tables, and Redux - install any block with one CLI
          command.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          {[
            "DynamicFormField",
            "FormBuilder",
            "MultiStepForm",
            "DataTable",
            "Redux",
          ].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "8px 16px",
                color: "#e6edf3",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 72,
            color: "#484f58",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          formkitcn.pro
        </div>
      </div>
    ),
    { ...size },
  )
}
