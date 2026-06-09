export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="url(#grad1)" stroke="#87CEEB" strokeWidth="2"/>

      {/* Star/Diamond shape */}
      <path
        d="M50 15 L58 42 L85 42 L63 58 L71 85 L50 69 L29 85 L37 58 L15 42 L42 42 Z"
        fill="white"
        opacity="0.9"
      />

      {/* Inner circle */}
      <circle cx="50" cy="50" r="15" fill="url(#grad2)"/>

      {/* E letter */}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="900"
        fontFamily="serif"
      >E</text>

      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E90FF"/>
          <stop offset="100%" stopColor="#87CEEB"/>
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E90FF"/>
          <stop offset="100%" stopColor="#0066cc"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
