export function TypographyLead({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`text-muted-foreground text-xl ${className}`}>
      {text}
    </p>
  );
}
