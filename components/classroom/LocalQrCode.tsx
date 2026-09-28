"use client";

import { useMemo } from "react";
import { createLocalQrMatrix } from "@/services/localQrCode";

interface Props {
  value: string;
  size?: number;
  className?: string;
}

export default function LocalQrCode({ value, size = 220, className = "" }: Props) {
  const result = useMemo(() => {
    try {
      return { matrix: createLocalQrMatrix(value), error: "" };
    } catch (error) {
      return {
        matrix: [] as boolean[][],
        error: error instanceof Error ? error.message : "Unable to create QR code.",
      };
    }
  }, [value]);

  if (result.error || result.matrix.length === 0) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-xs leading-5 text-amber-800 ${className}`} style={{ width: size, height: size }}>
        QR unavailable. Use the classroom join URL and session code instead.
      </div>
    );
  }

  const quietZone = 4;
  const matrixSize = result.matrix.length;
  const viewBoxSize = matrixSize + quietZone * 2;

  return (
    <svg
      role="img"
      aria-label="QR code for classroom observers"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect width={viewBoxSize} height={viewBoxSize} fill="white" />
      {result.matrix.map((row, rowIndex) =>
        row.map((dark, columnIndex) =>
          dark ? (
            <rect
              key={`${rowIndex}-${columnIndex}`}
              x={columnIndex + quietZone}
              y={rowIndex + quietZone}
              width="1"
              height="1"
              fill="black"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
