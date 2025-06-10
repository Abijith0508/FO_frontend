import React, { useState, useEffect } from 'react';
import { glass, grayText } from '../styling';
import Image from 'next/image';
import tickMark from '../img/tickMark.png';
import { groupBy, filterUpdate } from './filterFunction';
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
  setFilters : any
};

const Total = ({ data, className ,filters, setFilters }: Props) => {
  const [hovered, setHovered] = useState<0 | 1>(1);
  useEffect(()=>{
    
    if(hovered) setTColor('emerald')
    else setTColor('ruby')

  }, [hovered])
 
  const groupedByAssetType = groupBy(data, 'asset_type');

  const equityData = groupedByAssetType.find(item => item.asset_type === 'Equity');
  const debtData = groupedByAssetType.find(item => item.asset_type === 'Debt');

  const closingValueEquity = equityData ? Number(equityData.sumOfClosingValue) : 0;
  const closingValueDebt = debtData ? Number(debtData.sumOfClosingValue) : 0;
  const total = closingValueEquity + closingValueDebt;

  const selectedCost = hovered == 1 ? closingValueEquity : closingValueDebt;
  const percentage = total ? (selectedCost / total) * 100 : 0;
  
  const equityPct = total ? (closingValueEquity / total) * 100 : 0;
  const debtPct = total ? (closingValueDebt / total) * 100 : 0;

  
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

  const { number: animatedTotal } = useSpring({
    number: total,
    from: { number: 0 },
    config: { duration: 300 },
  });

  
  const [tColor, setTColor] = useState('emerald')

  
  return (
    <div className={className}>
      <div className="flex justify-between w-full">
        <div className = "flex flex-col items-center justify-center">
          <div className={grayText}>Wallet</div>
          <div>
            <div className="text-[40px] font-bold">
              ₹ <animated.span>
                {animatedTotal.to(val => Math.round(val).toLocaleString('en-IN'))}
              </animated.span>{' '}
            </div>
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
          <div className="relative w-full min-w-[308] h-[28.5px] my-6 bg-ruby overflow-hidden rounded-[8px] flex text-white text-xs font-medium">
            {/* Equity Bar */}
            <div
              className="h-full bg-emerald cursor-pointer flex items-center justify-center transition-transform"
              style={{ width: `${equityPct}%` }}
              onClick={() => {
                setHovered(1)
                filterUpdate(setFilters, 'asset_type', 'Equity')
              }}
            >
              {equityPct > 10 && `Equity`}
            </div>

            {/* Debt Bar */}
            <div
              className="h-full bg-ruby cursor-pointer flex items-center justify-center transition-transform"
              style={{ width: `${debtPct}%` }}
              onClick={() => {
                setHovered(0)
                filterUpdate(setFilters, 'asset_type', 'Debt')
              }}
            >
            {debtPct > 10 && `Debt`}
          </div>
        </div>
        </div>
        
        <div className = "flex flex-col items-center justify-center ">
            <div>
              ClosingCost
            </div> 
            <div>
              Unrealised Gain
            </div>
        </div>

      </div>

      {/* Optional tick image */}
      {/* <Image src={tickMark} alt="tick" /> */}
    </div>
  );
};

export default Total;
