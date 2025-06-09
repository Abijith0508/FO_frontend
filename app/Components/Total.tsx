import React, { useState, useEffect } from 'react';
import { glass, grayText } from '../styling';
import Image from 'next/image';
import tickMark from '../img/tickMark.png';
import { groupBy } from './filterFunction';
import { useSpring, animated } from '@react-spring/web';

interface DataItem {
  id: number;
  entity: string;
  advisor: string;
  substrategy: string;
  isin: string;
  folio_no: string;
  name: string;
  quantity: string;
  avg_cost: string;
  market_price: string;
  closing_cost: string;
  closing_value: string;
  unrealized_gain: string;
  irr: string;
  gain_cq: string | null;
  irr_cq: string | null;
  asset_type: string;
  strategy: string;
}

type Props = {
  data: DataItem[];
  className: string;
  filters : string[];
};

const Total = ({ data, className ,filters }: Props) => {
  const groupedByAssetType = groupBy(data, 'asset_type');

  const equityData = groupedByAssetType.find(item => item.asset_type === 'Equity');
  const debtData = groupedByAssetType.find(item => item.asset_type === 'Debt');

  const closingCostEquity = equityData ? Number(equityData.sumOfClosingCosts) : 0;
  const closingCostDebt = debtData ? Number(debtData.sumOfClosingCosts) : 0;
  const total = closingCostEquity + closingCostDebt;

  const [hovered, setHovered] = useState<0 | 1>(1);
  const selectedCost = hovered === 1 ? closingCostEquity : closingCostDebt;
  const percentage = total ? (selectedCost / total) * 100 : 0;

  const equityPct = total ? (closingCostEquity / total) * 100 : 0;
  const debtPct = total ? (closingCostDebt / total) * 100 : 0;

  // 🎯 Animate numbers
  const { number: animatedValue } = useSpring({
    number: selectedCost,
    from: { number: 0 },
    config: { duration: 500 },
  });

  const { number: animatedPct } = useSpring({
    number: percentage,
    from: { number: 0 },
    config: { duration: 500 },
  });

  const formattedTotal = total.toLocaleString('en-IN');
  const [tColor, setTColor] = useState('emerald')
  useEffect(()=>{
    
    if(hovered) setTColor('emerald')
    else setTColor('ruby')

  }, [hovered])
  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center">
        <div className={grayText}>Wallet</div>
        <div>
          <div className="text-[40px] font-bold">₹ {formattedTotal}</div>
          <div className={`relative text-[18px] text-${tColor} transition-colors`}>
            ₹ <animated.span>
              {animatedValue.to(val => Math.round(val).toLocaleString('en-IN'))}
            </animated.span>{' '}
            (
            <animated.span>
              {animatedPct.to(val => val.toFixed(2))}
            </animated.span>
            %)
          </div>
        </div>

        {/* 🟩 Bar with internal labels */}
        <div className="relative w-full h-[28.5px] my-6 bg-ruby overflow-hidden rounded-[8px] flex text-white text-xs font-medium">
          {/* Equity Bar */}
          <div
            className="h-full bg-emerald cursor-pointer flex items-center justify-center"
            style={{ width: `${equityPct}%` }}
            onClick={() => setHovered(1)}
          >
            {equityPct > 10 && `Equity`}
          </div>

          {/* Debt Bar */}
          <div
            className="h-full bg-ruby cursor-pointer flex items-center justify-center"
            style={{ width: `${debtPct}%` }}
            onClick={() => setHovered(0)}
          >
            {debtPct > 10 && `Debt`}
          </div>
        </div>
      </div>

      {/* Optional tick image */}
      {/* <Image src={tickMark} alt="tick" /> */}
    </div>
  );
};

export default Total;
