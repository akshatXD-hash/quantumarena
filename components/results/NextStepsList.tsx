interface NextStepsListProps {
  steps: string[];
}

export function NextStepsList({ steps }: NextStepsListProps) {
  if (steps.length === 0) return null;

  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold mt-0.5">
            {i + 1}
          </span>
          <span className="text-foreground">{step}</span>
        </li>
      ))}
    </ol>
  );
}
