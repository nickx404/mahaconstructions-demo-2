export default function RollingNumber({ value }) {
  return (
    <span className="rolling-number">
      <span className="sr-only">{value}</span>
      <span className="rolling-number-visual" aria-hidden="true">
        {String(value).split('').map((digit, index) => (
          <span className="rolling-digit" key={index}>
            <span className="rolling-digit-strip" data-stop={10 + Number(digit)} style={{ transform: `translateY(-${(10 + Number(digit)) * 1.1}em)` }}>
              {Array.from({ length: 20 }, (_, step) => <span key={step}>{step % 10}</span>)}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
