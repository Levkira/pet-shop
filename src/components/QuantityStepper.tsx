interface QuantityStepperProps {
  amount: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityStepper({
  amount,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="h-8 w-8 rounded-full text-lg leading-none text-ink/70 transition-colors hover:bg-sand"
      >
        &minus;
      </button>
      <span className="w-8 text-center font-mono text-sm tabular-nums">{amount}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="h-8 w-8 rounded-full text-lg leading-none text-ink/70 transition-colors hover:bg-sand"
      >
        +
      </button>
    </div>
  );
}
