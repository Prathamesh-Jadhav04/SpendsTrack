export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-gradient-to-br from-muted to-muted/50">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-extrabold">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
