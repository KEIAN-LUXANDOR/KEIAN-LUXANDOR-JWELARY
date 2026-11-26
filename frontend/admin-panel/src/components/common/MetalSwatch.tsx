import { metalColor, metalLabel } from '@/lib/constants';

/** Coloured dot + metal name: "● Rose Gold". */
export default function MetalSwatch({ metal }: { metal: string }) {
  return (
    <span className="metal">
      <span className="metal__dot" style={{ background: metalColor(metal) }} aria-hidden="true" />
      {metalLabel(metal)}
    </span>
  );
}
