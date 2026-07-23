import { corridors } from "@/data/ports";

interface CorridorSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

const CorridorSelector = ({ value, onChange }: CorridorSelectorProps) => {
  return (
    <div className="glass-panel p-3 flex flex-wrap gap-2 items-center">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">
        Corridor
      </span>
      {corridors.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`text-xs px-3 py-1.5 rounded-md border transition-all font-mono ${
            value === c.id
              ? "bg-primary/20 text-primary border-primary/40"
              : "bg-secondary/60 text-muted-foreground border-border/50 hover:text-foreground"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CorridorSelector;
