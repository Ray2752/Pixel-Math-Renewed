export default function RangeField({ label, value, min, max, step = 1, onChange }) {
  return (
    <div className="range-field">
      <div className="range-field-row">
        <span>{label}</span>
        <span className="range-field-value">{value}</span>
      </div>
      <div className="range-field-controls">
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          type="number"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onBlur={() => onChange(Math.min(max, Math.max(min, Number(value) || min)))}
        />
      </div>
    </div>
  );
}
