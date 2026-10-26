function Marigold({ x, y, size = 1, delay = 0 }) {
  return (
    <g
      className="floral-bloom floral-bloom--marigold"
      transform={`translate(${x} ${y}) scale(${size})`}
      style={{ '--bloom-delay': `${delay}s` }}
    >
      <circle cy="-7" r="5.5" />
      <circle cx="6.5" cy="-2" r="5.5" />
      <circle cx="4" cy="5.5" r="5.5" />
      <circle cx="-4" cy="5.5" r="5.5" />
      <circle cx="-6.5" cy="-2" r="5.5" />
      <circle r="3.5" className="floral-center" />
    </g>
  );
}

function Jasmine({ x, y, size = 1, delay = 0 }) {
  return (
    <g
      className="floral-bloom floral-bloom--jasmine"
      transform={`translate(${x} ${y}) scale(${size})`}
      style={{ '--bloom-delay': `${delay}s` }}
    >
      <ellipse cy="-7" ry="7" rx="4" />
      <ellipse cy="-7" ry="7" rx="4" transform="rotate(72)" />
      <ellipse cy="-7" ry="7" rx="4" transform="rotate(144)" />
      <ellipse cy="-7" ry="7" rx="4" transform="rotate(216)" />
      <ellipse cy="-7" ry="7" rx="4" transform="rotate(288)" />
      <circle r="2.4" className="floral-center" />
    </g>
  );
}

function Garland({ side }) {
  return (
    <svg className={`garland-art garland-art--${side}`} viewBox="0 0 160 300" preserveAspectRatio="none">
      <path className="garland-thread" d="M8 -12C64 31 7 69 48 111S103 184 59 223S47 272 27 311" />
      <path className="garland-leaf" d="M19 35C2 26-3 14 0 5C15 9 25 21 19 35ZM40 78C57 65 71 65 80 71C69 83 53 89 40 78ZM35 133C18 123 13 111 17 101C31 107 41 120 35 133ZM79 172C95 157 109 156 118 162C107 174 91 181 79 172ZM71 228C53 220 47 208 50 198C65 204 76 216 71 228ZM35 268C20 258 17 246 21 238C34 244 42 256 35 268Z" />
      <Marigold x={19} y={35} size={0.92} delay={0.1} />
      <Jasmine x={48} y={111} size={0.86} delay={0.35} />
      <Marigold x={35} y={133} size={0.74} delay={0.55} />
      <Jasmine x={79} y={172} size={0.78} delay={0.2} />
      <Marigold x={71} y={228} size={0.88} delay={0.48} />
      <Jasmine x={35} y={268} size={0.72} delay={0.62} />
    </svg>
  );
}

function CornerFlowers({ side }) {
  return (
    <svg className={`corner-flowers corner-flowers--${side}`} viewBox="0 0 150 128" preserveAspectRatio="xMinYMax meet">
      <path className="flower-stem" d="M-4 125C30 97 53 89 91 88M26 125C43 102 78 79 121 70M78 124C95 101 119 84 154 78" />
      <path className="garland-leaf" d="M20 108C7 101 5 91 9 84C20 89 25 99 20 108ZM55 96C46 84 47 74 53 68C61 78 62 88 55 96ZM90 98C82 84 84 74 91 69C98 79 98 90 90 98ZM118 90C113 78 116 69 123 65C128 76 126 85 118 90Z" />
      <Marigold x={27} y={65} size={1.2} delay={0.25} />
      <Jasmine x={76} y={51} size={1.05} delay={0.4} />
      <Marigold x={122} y={43} size={0.9} delay={0.15} />
      <Jasmine x={105} y={91} size={0.68} delay={0.55} />
    </svg>
  );
}

export default function WeddingFlorals({ variant = 'page' }) {
  return (
    <div className={`wedding-florals wedding-florals--${variant}`} aria-hidden="true">
      <div className="garland-hang garland-hang--left"><Garland side="left" /></div>
      <div className="garland-hang garland-hang--right"><Garland side="right" /></div>
      <CornerFlowers side="left" />
      <CornerFlowers side="right" />
    </div>
  );
}