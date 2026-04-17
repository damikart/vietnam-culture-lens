import { ImageResponse } from "next/og";
import { getEntityBySlug, getAllSlugsForCategory } from "@/lib/data";
import { SCHOLARS } from "@/lib/scholars";

export async function generateStaticParams() {
  return getAllSlugsForCategory("tuc-ngu");
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntityBySlug("tuc-ngu", slug);
  if (!entity)
    return new ImageResponse(
      <div style={{ background: "#0F1117", width: "100%", height: "100%" }} />,
      size
    );
  const scholar = SCHOLARS[entity.scholarId];

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0F1117",
        padding: "60px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: scholar.color,
          }}
        />
        <span style={{ color: scholar.color, fontSize: 20 }}>{scholar.name}</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>
          {scholar.field}
        </span>
      </div>
      <div
        style={{
          color: "white",
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.2,
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {entity.displayName}
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }}>
        Lat Van Hoa — Kham pha chieu sau van hoa Viet Nam
      </div>
    </div>,
    size
  );
}
