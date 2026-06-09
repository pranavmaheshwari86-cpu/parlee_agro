"use client";

export default function ProductSkeleton({ gradient }: { gradient?: string }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: gradient || '#f3f4f6' }}
    >
      <div className="flex flex-col items-center gap-4 opacity-40">
        <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
