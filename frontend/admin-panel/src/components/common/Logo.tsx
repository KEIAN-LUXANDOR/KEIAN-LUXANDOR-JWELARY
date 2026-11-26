/** Keian Luxandor logo. `light` = white version for dark backgrounds. */
export default function Logo({ light = false, height = 34 }: { light?: boolean; height?: number }) {
  return (
    <img
      src={light ? '/logos/keian-logo-white.webp' : '/logos/keian-logo-black.webp'}
      alt="Keian Luxandor"
      height={height}
      width={Math.round(height * 2.6)}
      style={{ height, width: 'auto' }}
    />
  );
}
