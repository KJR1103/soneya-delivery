import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void;
  existingSignature?: string | null;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  existingSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' (Conakry GMT)'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0B7A4B';
    ctx.lineWidth = 2.5;

    if (existingSignature && !hasDrawn) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setLastPos(coords);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCoords = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentCoords.x, currentCoords.y);
    ctx.stroke();

    setLastPos(currentCoords);
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        onSignatureChange(dataUrl);
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
        <label className="font-semibold text-[#0B2B1E] dark:text-emerald-100 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
          <span>Tracez votre signature au doigt ou à la souris</span>
        </label>
        {hasDrawn && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 min-h-[32px] px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Effacer</span>
          </button>
        )}
      </div>

      <div className="relative border-2 border-dashed border-[#0B7A4B]/40 dark:border-[#1E3B2D] rounded-2xl bg-white dark:bg-[#08120D] overflow-hidden shadow-inner touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-32 block cursor-crosshair"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-[#5C7A6E] dark:text-emerald-200/50 space-y-1">
            <span className="text-xs">Signez à l'intérieur de ce cadre</span>
            <div className="w-32 h-[1px] bg-[#D4E9DD] dark:bg-[#1E3B2D]" />
          </div>
        )}

        <div className="absolute bottom-2 right-2 pointer-events-none bg-white/95 dark:bg-[#10231B]/95 px-2 py-0.5 rounded text-[9px] font-mono text-[#2F4F42] dark:text-emerald-200/70 border border-[#D4E9DD] dark:border-[#1E3B2D]">
          {currentTime}
        </div>
      </div>

      <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70 flex flex-wrap items-center justify-between gap-2">
        <span>Horodatage officiel : la signature sera scellée à la date de soumission.</span>
        {hasDrawn && (
          <span className="text-[#0B7A4B] dark:text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-3 h-3" /> Signature capturée
          </span>
        )}
      </div>
    </div>
  );
};
