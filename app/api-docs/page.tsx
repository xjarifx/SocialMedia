"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <SwaggerUI url="/api/v1/openapi" />
    </div>
  );
}
