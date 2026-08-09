import type { ItemHover } from '../../../config';
import style from './ItemTooltip.module.css';

type ItemTooltipProps = {
  hover: ItemHover | null;
};

export default function ItemTooltip({ hover }: ItemTooltipProps) {
  if (!hover) return null;

  return (
    <div className={style.layer}>
      <span className={style.label} style={{ left: `${hover.xPercent}%`, top: `${hover.yPercent}%` }}>
        {hover.label}
      </span>
    </div>
  );
}
