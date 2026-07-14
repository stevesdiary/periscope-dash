import { PRODUCT_COLORS, PRODUCT_NAMES } from '../../types';

export function AppTag({ appKey }: { appKey: string }) {
  const color = PRODUCT_COLORS[appKey] ?? '#94A3B8';
  const name = PRODUCT_NAMES[appKey] ?? appKey;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-outline text-on-surface-variant">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}
