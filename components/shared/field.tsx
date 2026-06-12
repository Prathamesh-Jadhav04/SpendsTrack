"use client";

import { Label } from "@/components/ui/label";

export function Field({
  label,
  children,
  required,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && (
          <span className="text-destructive text-xs" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}
