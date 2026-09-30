/** Aros concéntricos que giran (geometría sagrada). El `viewBox` se ajusta al radio mayor. */
export function OrbitalRings({ size, rings, spin = 120, reverse = false, nodes = [], className }) {
  const max = Math.max(...rings.map((ring) => ring.r)) + 8

  return (
    <svg
      aria-hidden="true"
      viewBox={`${-max} ${-max} ${max * 2} ${max * 2}`}
      width={size}
      height={size}
      className={className}
      style={{ animation: `${reverse ? 'fm-spin-r' : 'fm-spin'} ${spin}s linear infinite` }}
    >
      {rings.map((ring) => (
        <circle key={ring.r} r={ring.r} fill="none" stroke={ring.stroke} strokeWidth={ring.width ?? 1} strokeDasharray={ring.dash} />
      ))}
      {nodes.map((node) => (
        <circle
          key={`${node.angle}-${node.radius}`}
          cx={Math.cos((node.angle * Math.PI) / 180) * node.radius}
          cy={Math.sin((node.angle * Math.PI) / 180) * node.radius}
          r={(node.size ?? 6) / 2}
          fill={node.color}
          style={{ filter: `drop-shadow(0 0 4px ${node.color})` }}
        />
      ))}
    </svg>
  )
}
