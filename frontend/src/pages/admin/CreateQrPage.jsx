"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Loader2, Check, Download, CopyCheck } from "lucide-react";
import QRCode from "qrcode";
import TooltipWrapper from "@/components/TooltipWrapper";

const BASE_URL = "http://cloudkitchen247.netlify.app?table=";

const CreateQrPage = () => {
  const [tableNo, setTableNo] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(BASE_URL);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);

  const handleGenerate = async () => {
    if (!tableNo.trim()) return;
    setLoading(true);

    const finalUrl = `${BASE_URL}${tableNo}`;
    setUrl(finalUrl);

    try {
      const canvas = canvasRef.current;

      // Create higher resolution canvas for crisp rendering
      const scale = 3; // 3x resolution for better quality
      const displaySize = 300;
      const highResSize = displaySize * scale;

      canvas.width = highResSize;
      canvas.height = highResSize;

      const ctx = canvas.getContext("2d");

      // Generate QR code
      await QRCode.toCanvas(canvas, finalUrl, {
        width: highResSize,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // Calculate text width to create properly sized background
      ctx.font = `bold ${20 * scale}px sans-serif`;
      const text = `Table ${tableNo}`;
      const textWidth = ctx.measureText(text).width;
      const padding = 10 * scale;

      // Draw background with rounded corners
      const bgWidth = textWidth + padding * 2;
      const bgHeight = 30 * scale;
      const bgX = (highResSize - bgWidth) / 2;
      const bgY = (highResSize - bgHeight) / 2;

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 4 * scale);
      ctx.fill();

      // Draw text
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, highResSize / 2, highResSize / 2);

      setQrUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("QR generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Table QR Generator
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Generate QR codes for your restaurant tables
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Table Number"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
              type="number"
              min={0}
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>

          {qrUrl && (
            <div className="flex flex-col items-center gap-4 mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-lg font-semibold">
                QR Code Preview
              </div>
              <div className="border overflow-hidden rounded-xl shadow-md">
                <img
                  src={qrUrl}
                  alt="Generated QR"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <div className="w-full mt-2">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Shareable URL
                </div>
                <div className="relative">
                  <Input
                    value={url}
                    className="pr-12 text-sm"
                    readOnly
                  />
                  <TooltipWrapper message="Copy URL">
                    <Button
                      size="icon"
                      onClick={handleCopy}
                      disabled={copied}
                      className="rounded-md rounded-l-none absolute top-0 right-0"
                    >
                      {copied ? <CopyCheck /> : <Copy />}
                    </Button>
                  </TooltipWrapper>
                </div>
              </div>

              <Button
                asChild
              >
                <a
                  href={qrUrl}
                  download={`table-${tableNo}-qrcode.png`}
                  className="flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download QR Code
                </a>
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQrPage;
