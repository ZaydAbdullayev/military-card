import React, { useRef, useEffect } from "react";
import bwipjs from "@bwip-js/browser";

/**
 * PDF417 barkodu oluşturan bileşen
 * @param {string} value - Barkoda yazılacak metin
 */
export const PDF417Canvas = ({
  value = "Default PDF417 Data",
  width = 2,
  height = 10,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: "pdf417", // Barkod tipi
        text: value,
        scale: window.devicePixelRatio || 2,
        height: height, // mm cinsinden bar yüksekliği
        includetext: false,
        textxalign: "center",
        padding: 4,
      });
    } catch (err) {
      console.error("📛 PDF417 çizilemedi:", err);
    }
  }, [value, width, height]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />;
};
