import React, { useState, useEffect } from 'react';
import { glass, grayText, grayText2 } from '../styling';
import Image from 'next/image';
import tickMark from '../img/tickMark.png';
import { groupBy, filterUpdate } from '../Utilities/filterFunction';
import { useSpring, animated } from '@react-spring/web';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
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
  const groupAll = groupBy(data, null)
  const equityData = groupedByAssetType.find(item => item.asset_type === 'Equity');
  const debtData = groupedByAssetType.find(item => item.asset_type === 'Debt');
  const totalData = groupAll[0];
  
  const closingValueEquity = equityData ? Number(equityData.sumOfClosingValue) : 0;
  const closingValueDebt = debtData ? Number(debtData.sumOfClosingValue) : 0;
  const total = totalData ? Number(totalData.sumOfClosingValue) : 0;
  const totalClosingCost = totalData ? Number(totalData.sumOfClosingCosts) : 0;
  const totalUnrealisedGain = totalData ? Number(totalData.sumOfUnrealizedGain) : 0;


  
  
  
  const equityPct = total ? (closingValueEquity / total) * 100 : 0;
  const debtPct = total ? (closingValueDebt / total) * 100 : 0;

  
  const { number: animatedEquity } = useSpring({
    number: closingValueEquity,
    from: { number: 0 },
    config: { duration: 500 },
  });

  const { number: animatedDebt } = useSpring({
    number: closingValueDebt,
    from: { number: 0 },
    config: { duration: 600 },
  });

  const { number: animatedEquityPct } = useSpring({
    number: equityPct,
    from: { number: 0 },
    config: { duration: 500 },
  });
  const { number: animatedDebtPct } = useSpring({
    number: debtPct,
    from: { number: 0 },
    config: { duration: 500 },
  });

  const { number: animatedTotal } = useSpring({
    number: total,
    from: { number: 0 },
    config: { duration: 300 },
  });
  const { number: animatedCC } = useSpring({
    number: totalClosingCost,
    from: { number: 0 },
    config: { duration: 300 },
  });
  const { number: animatedUG } = useSpring({
    number: totalUnrealisedGain,
    from: { number: 0 },
    config: { duration: 300 },
  });
  
  const [tColor, setTColor] = useState('emerald')
  const [ugColor, setUgColor] = useState('emerald')

  useEffect(() => {
    if(totalUnrealisedGain < 0)setUgColor('ruby')
    else setUgColor('emerald')
  }, [totalUnrealisedGain])
  
  return (
    <div className={className}>
      <div className="flex justify-around w-full">
        <div className = "flex flex-col items-center justify-center">
          <div className={grayText}>Holding Value</div>
          
          <div className="text-[40px] font-bold">
            ₹ <animated.span>
              {animatedTotal.to(val => Math.round(val).toLocaleString('en-IN'))}
            </animated.span>{' '}
          </div>
          
          <div className="flex flex-col items-center justify-center ">
            <div className={`relative w-full min-w-[500] h-[40px] mt-6 mb-3 text-[${grayText2}] hover:text-white/80 overflow-hidden rounded-[8px] flex`}>
              {/* Equity Bar */}
              <div
                className="h-full bg-emerald cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{ width: `${equityPct}%` }}
                onClick={() => {
                  setHovered(1)
                  filterUpdate(setFilters, 'asset_type', 'Equity')
                }}
              >
                {equityPct > 30 && 
                  <div className = {`${grayText2} `}>
                    ₹ <animated.span>
                      {animatedEquity.to(val => Math.round(val).toLocaleString('en-IN'))}
                    </animated.span>{' '}
                    (
                    <animated.span>
                      {animatedEquityPct.to(val => val.toFixed(0))}
                    </animated.span>
                    %)
                  </div>
                }
              </div>

              {/* Debt Bar */}
              <div
                className="flex absolute right-0 h-full bg-ruby cursor-pointer  items-center justify-center transition-all duration-500 ease-in-out"
                style={{ width: `${debtPct}%` }}
                onClick={() => {
                  setHovered(0)
                  filterUpdate(setFilters, 'asset_type', 'Debt')
                }}
              >
                {debtPct > 30 && 
                  <div className = {`${grayText2} hover:text-white/80`}>
                    ₹ <animated.span>
                        {animatedDebt.to(val => Math.round(val).toLocaleString('en-IN'))}
                      </animated.span>
                      {" "}
                      (
                      <animated.span>
                        {animatedDebtPct.to(val => val.toFixed(0))}
                      </animated.span>
                      %)
                  </div>
                }
              </div>
            </div>
          
            <div className={`flex justify-around w-full ${grayText2} `}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald"/>
                <div>Equity</div>
                {(equityPct <= 30 && equityPct!=0) && 
                  <div>₹ {closingValueEquity.toLocaleString("en-IN")}</div>
                }
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ruby"/>
                <div>Debt</div>
                {(debtPct <= 30 && debtPct!=0) && 
                  <div>₹ {closingValueDebt.toLocaleString("en-IN")}</div>
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className = "flex flex-col items-center justify-around p-6 ">
            <div className = "flex flex-col gap-1">
              <div className = {`${grayText2} ` }>
                Invested Amount
              </div>
              <div className = " text-[23px] text-emerald">
                ₹ <animated.span>
                  {animatedCC.to(val => Math.round(val).toLocaleString('en-IN'))}
                </animated.span>{' '}
              </div>
            </div> 
            <div className = "flex flex-col gap-1 items-center justify-around ">
              <div className = "text-gray">Unrealised Gain/Loss</div>
              <div className =  {`flex items-center text-[23px] text-${ugColor} transition`}>
                ₹ <animated.span>
                  {animatedUG.to(val => Math.round(val).toLocaleString('en-IN'))}
                </animated.span>{' '}
                {ugColor == 'emerald' ? <ArrowUpRight/> :<ArrowDownLeft/>}
              </div>
            </div>
        </div>

      </div>

      {/* Optional tick image */}
      {/* <Image src={tickMark} alt="tick" /> */}
    </div>
  );
};

export default Total;
