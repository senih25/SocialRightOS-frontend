import { ImageResponse } from "next/og";

const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export function renderSocialShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#FDFBF7",
          color: "#0F172A",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 470,
            height: 470,
            borderRadius: 9999,
            background: "rgba(13, 148, 136, 0.12)",
            top: -210,
            left: -130,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(249, 115, 22, 0.08)",
            right: -100,
            bottom: -170,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "68px 78px 62px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 72,
                height: 72,
                borderRadius: 22,
                background: "#0D9488",
                color: "#FFFFFF",
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              D-SHR
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 750 }}>Sosyal Hak Rehberi</div>
              <div style={{ fontSize: 18, color: "#5D6B73" }}>by SocialRightLabs</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 930,
              gap: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 68,
                lineHeight: 1.04,
                fontWeight: 800,
                letterSpacing: "-0.045em",
              }}
            >
              Sosyal haklara erişimde sade ve güven veren dijital rehber
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 25,
                lineHeight: 1.35,
                color: "#475569",
              }}
            >
              Uygunluk testleri, başvuru rehberleri ve açıklanabilir sonraki adımlar.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 18,
              color: "#5D6B73",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <span>Ön değerlendirme</span>
              <span>•</span>
              <span>Kaynak odaklı rehberlik</span>
              <span>•</span>
              <span>Resmî karar vermez</span>
            </div>
            <div style={{ color: "#0D9488", fontWeight: 700 }}>sosyalhakrehberi.com</div>
          </div>
        </div>
      </div>
    ),
    SOCIAL_IMAGE_SIZE,
  );
}
