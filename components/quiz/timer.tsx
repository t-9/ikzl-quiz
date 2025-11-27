interface Props {
  seconds: number;
}

export default function Timer({ seconds }: Props) {
  return (
    <div className="badge" aria-live="polite">
      <span role="img" aria-label="timer">
        ⏱️
      </span>
      <span className="timer">{seconds}s</span>
    </div>
  );
}
