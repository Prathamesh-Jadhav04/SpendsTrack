export function ScreenHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-primary">
          {eyebrow}
        </p>
        <h2 className="truncate text-2xl font-extrabold tracking-normal text-foreground">
          {title}
        </h2>
      </div>
      {action}
    </header>
  );
}
