"use client";

import { useState, useEffect, use } from "react";
import { Render, type Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck-config";
import { PreviewStyles, PreviewBar, PreviewFooter } from "../preview-components";

export default function PagePreviewBySlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [data, setData] = useState<Data | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/editor/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setTitle(json.data.title);
          try {
            setData(JSON.parse(json.data.data) as Data);
          } catch {
            setError("Invalid page data");
          }
        } else {
          setError(json.error || "Page not found");
        }
      } catch {
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <>
      <PreviewStyles />
      <PreviewBar title={title || slug} />

      {loading && (
        <div className="preview-loading">Loading page...</div>
      )}

      {error && (
        <div className="preview-error">
          <h2>Page Not Available</h2>
          <p>{error}</p>
          <a
            href="/page-preview"
            style={{ marginTop: "1rem", color: "#C28F50", textDecoration: "underline", fontSize: "0.875rem" }}
          >
            ← View sample preview instead
          </a>
        </div>
      )}

      {!loading && !error && data && (
        <main className="preview-main">
          <Render config={puckConfig} data={data} />
        </main>
      )}

      <PreviewFooter />
    </>
  );
}
