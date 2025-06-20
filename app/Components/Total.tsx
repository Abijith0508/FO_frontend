import React, { useState, useEffect } from 'react';
import { grayText, grayText2, glass, responsiveIcon } from '../styling';

import { groupBy, filterUpdate, updateTimeFilter } from '../Utilities/filterFunction';
import { useSpring, animated } from '@react-spring/web';
import { ArrowUpRight, ArrowDownLeft, Funnel } from 'lucide-react';
import DataItem from '../Utilities/dataItem';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { Table2 } from 'lucide-react';

// Utility function to format numbers consistently
const formatNumber = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '0';
  return Math.round(value).toLocaleString('en-IN');
};

// Utility function to format percentages consistently
const formatPercentage = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '0.00';
  return value.toFixed(2);
};

type Props = {
  data: DataItem[];
  className: string;
  filters: string[];
  setFilters : any;
  mode : string;
  setMode: any;
  setFilteredData?: any
  ogData? : any
  setIsTableVisible: any
  isTableVisible: boolean
  setIsISINTableVisible: any
  isISINTableVisible: boolean
};

const Total = ({ data, className, filters, setFilters, mode, setMode, setFilteredData, ogData, setIsTableVisible, isTableVisible, setIsISINTableVisible, isISINTableVisible }: Props) => {
  // console.log(data)
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
  // console.log(totalData)
  
  const closingValueEquity = equityData ? Number(equityData.sumOfClosingValue || 0) : 0;
  const closingValueDebt = debtData ? Number(debtData.sumOfClosingValue || 0) : 0;
  const total = totalData ? Number(totalData.sumOfClosingValue || 0) : 0;
  const totalClosingCost = totalData ? Number(totalData.sumOfClosingCosts || 0) : 0;
  const totalUnrealisedGain = totalData ? Number(totalData.sumOfUnrealizedGain || 0) : 0;
  const totalOpeningCost = totalData ? Number(totalData.sumOfOpeningCost || 0) : 0;
  const totalRealizedGain = totalData ? Number(totalData.sumOfRealizedGain || 0) : 0;
  const totalOpeningValue = totalData ? Number(totalData.sumOfOpeningValue || 0) : 0; 

  const equityPct = (total ? (closingValueEquity / total) * 100 : 0) ;
  const debtPct = (total ? (closingValueDebt / total) * 100 : 0) ;
  const equityXirr = equityData ? Number(equityData.xirr || 0) : 0;
  const debtXirr = debtData ? Number(debtData.xirr || 0) : 0;
  const totalXirr = totalData ? Number(totalData.xirr || 0) : 0;
  
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
  const { number: animatedOC } = useSpring({
    number: totalOpeningCost,
    from: { number: 0 },
    config: { duration: 300 },
  });
  const { number: animatedOV } = useSpring({
    number: totalOpeningValue,
    from: { number: 0 },
    config: { duration: 300 },
  });
  const { number: animatedUG } = useSpring({
    number: totalUnrealisedGain,
    from: { number: 0 },
    config: { duration: 300 },
  });
  const { number: animatedRG } = useSpring({
    number: totalRealizedGain,
    from: { number: 0 },
    config: { duration: 300 },
  });
  const { number: animatiedXIRR } = useSpring({
    number: totalXirr,
    from: { number: 0 },
    config: { duration: 300 },
  });
  

  const [tColor, setTColor] = useState('emerald')
  const [ugColor, setUgColor] = useState('emerald')
  const [rgColor, setRgColor] = useState('emerald')
  const [isOpen, setIsOpen] = useState(false)
  const [xirrColor, setXirrColor] = useState('emerald')

  useEffect(() => {
    if(totalUnrealisedGain < 0) setUgColor('ruby')
    else setUgColor('emerald')
    if(totalRealizedGain < 0) setRgColor('ruby')
    else setRgColor('emerald')
    if(totalXirr < 0) setXirrColor('ruby')
    else setXirrColor('emerald')
  }, [totalUnrealisedGain, totalRealizedGain])

  if(mode == "Expenses"){
    return (
      <ExpenseTotal 
        data={data} 
        ogData={ogData} 
        filters={filters} 
        setFilters={setFilters} 
        className={` ${glass} py-6`} 
        mode={mode} 
        setMode={setMode} 
        setFilteredData={setFilteredData}
        setIsTableVisible={setIsTableVisible}
        isTableVisible={isTableVisible}
        setIsISINTableVisible={setIsISINTableVisible}
        isISINTableVisible={isISINTableVisible}
      />
    );
  }
  else if(mode == "Gain"){
    return (
      <GainTotal 
        data={data} 
        ogData={ogData} 
        filters={filters} 
        setFilters={setFilters} 
        className={` ${glass} py-6 px-15`} 
        mode={mode} 
        setMode={setMode} 
        setFilteredData={setFilteredData}
        setIsTableVisible={setIsTableVisible}
        isTableVisible={isTableVisible}
        setIsISINTableVisible={setIsISINTableVisible}
        isISINTableVisible={isISINTableVisible} 
      />
    );
  }
  return (
      <div className={`flex flex-wrap items-center justify-around w-full ${className} gap-5`} >
        <div className = "flex flex-col items-center justify-center gap-3">
          <div className={`${grayText} flex gap-2 `}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <div
                  className="cursor-pointer flex items-center"
                >
                  {mode}
                  <ChevronDown
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/80 border border-none outline-none text-white/80" align="start">
                <DropdownMenuItem onClick={() => setMode("Holdings Value")} className=" text-lg">
                  Holdings Value
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Performance")} className=" text-lg">
                  Performance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Expenses")} className=" text-lg">
                  Expenses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Gain")} className=" text-lg">
                  Gain
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
          
          <div className="text-[30px] sm:text-[40px] sm:font-bold flex items-center gap-2">
            <div className="flex">
               ₹<animated.span>
              {animatedTotal.to(val => Math.round(val).toLocaleString('en-IN'))}
            </animated.span> 
            </div>
           
            <Table2 
                data-tooltip-id="BCTooltip"
                data-tooltip-content="View Overview Table"
                data-tooltip-place="top"
                data-tooltip-float
                className={`${responsiveIcon}`}
                onClick={() => setIsTableVisible(()=>!isTableVisible)}
              />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className={`relative min-w-[225px] sm:min-w-[400px] h-[40px] mt-6 mb-3 text-[${grayText2}] hover:text-white/80 overflow-hidden rounded-[8px] flex`}>
              {/* Equity Bar */}
              <Tooltip id="BCTooltip1" float place="top" className='z-40'/>
              <div
                className="h-full bg-emerald cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{ width: `${equityPct}%` }}
                onClick={() => {
                  setHovered(1)
                  filterUpdate(setFilters, 'asset_type', 'Equity', setIsISINTableVisible, isISINTableVisible)
                }}
                data-tooltip-id="BCTooltip1"
                data-tooltip-content={"XIRR: " +equityXirr.toFixed(2) + "%"}
                data-tooltip-place="top"
                data-tooltip-float
              >
                {equityPct > 30 && 
                  <div className = {`${grayText2} `}>
                    ₹ <animated.span>
                      {animatedEquity.to(val => Math.round(val).toLocaleString('en-IN'))}
                    </animated.span>
                  </div>
                }
              </div>

              {/* Debt Bar */}
              <div
                className="flex absolute right-0 h-full bg-ruby cursor-pointer  items-center justify-center transition-all duration-500 ease-in-out"
                style={{ width: `${debtPct}%` }}
                onClick={() => {
                  setHovered(0)
                    filterUpdate(setFilters, 'asset_type', 'Debt' , setIsISINTableVisible, isISINTableVisible)
                }}
                data-tooltip-id="BCTooltip1"
                data-tooltip-content= {"XIRR: " + debtXirr.toFixed(2) + "%"}
                data-tooltip-place="top"
                data-tooltip-float
              >
                {debtPct > 30 && 
                  <div className = {`${grayText2} hover:text-white/80`}>
                    ₹ <animated.span>
                        {animatedDebt.to(val => Math.round(val).toLocaleString('en-IN'))}
                      </animated.span> 
                  </div>
                }
              </div>
            </div>
              
            <div className={`flex flex-col items-center justify-around w-[100%] ${grayText2} gap-1`}>
              <div className="flex items-center sm:gap-2 gap-1">
                <div className="w-3 h-3 bg-emerald cursor-pointer" 
                onClick={() => {
                  setHovered(1)
                  filterUpdate(setFilters, 'asset_type', 'Equity', setIsISINTableVisible, isISINTableVisible)
                }}
                />
                <div>Equity</div>
                {(equityPct <= 30 && equityPct!=0) && 
                  <div>₹{formatNumber(closingValueEquity)}</div>
                }
              </div>
              
              <div className="flex items-center sm:gap-2 gap-1">
                <div className="w-3 h-3 bg-ruby cursor-pointer"
                onClick={() => {
                  setHovered(1)
                  filterUpdate(setFilters, 'asset_type', 'Debt', setIsISINTableVisible, isISINTableVisible)
                }}/>
                <div>Debt</div>
                {(debtPct <= 30 && debtPct!=0) && 
                  <div>₹{formatNumber(closingValueDebt)}</div>
                }
              </div>
            </div>
          </div>
          
        </div>
        
        <div className = "flex flex-wrap items-center justify-center p-0 gap-5 max-w-[50%]">
            {mode === "Performance" && (
              <div className = "flex flex-col">
                <div className = {`${grayText2} ` }>
                  Opening Cost 
                  <div className="text-white/30">as on April 1</div>
                </div>
                <div className = " text-[23px] text-white/90">
                  ₹ <animated.span>
                    {animatedOC.to(val => Math.round(val).toLocaleString('en-IN'))}
                  </animated.span>{' '}
                </div>
              </div> 
            )}
            {mode === "Performance" && (
              <div className = "flex flex-col">
                <div className = {`${grayText2} ` }>
                  Opening Value 
                  <div className="text-white/30">as on April 1</div>
                </div>
                <div className = " text-[23px] text-white/90">
                  ₹ <animated.span>
                    {animatedOV.to(val => Math.round(val).toLocaleString('en-IN'))}
                  </animated.span>{' '}
                </div>
              </div> 
            )}
            <div className = "flex flex-col items-center text-center justify-center">
              <div className = {`${grayText2} ` }>
                Invested Amount
                <div className="text-white/30">as on yesterday</div>
              </div>
              <div className = " text-[23px] text-white/90">
                ₹<animated.span>
                  {animatedCC.to(val => Math.round(val).toLocaleString('en-IN'))}
                </animated.span>{' '}
              </div>
            </div> 
            <div className = "flex flex-col items-center justify-around ">
              <div className = "text-gray whitespace-nowrap">Unrealised Gain/Loss</div>
              <div className =  {`flex items-center text-[23px] text-${ugColor} transition`}>
                ₹ <animated.span>
                  {animatedUG.to(val => Math.round(val).toLocaleString('en-IN'))}
                </animated.span>{' '}
                {ugColor == 'emerald' ? <ArrowUpRight/> :<ArrowDownLeft/>}
              </div>
            </div>
            <div className = "flex flex-col items-center justify-around ">
              <div className = "text-gray">XIRR</div>
              <div className =  {`flex items-center text-[23px] text-${ugColor} transition`}>
                <animated.span>
                  {animatiedXIRR.to(val => val.toFixed(2))}
                </animated.span>{' '}%
                {xirrColor == 'emerald' ? <ArrowUpRight/> :<ArrowDownLeft/>}
              </div>
            </div>
            {mode === "Performance" && (
              <div className = "flex flex-col items-center justify-around ">
                <div className = "text-gray">Realised Gain/Loss</div>
                <div className =  {`flex items-center text-[23px] text-${rgColor} transition`}>
                  ₹ <animated.span>
                    {animatedRG.to(val => Math.round(val).toLocaleString('en-IN'))}
                  </animated.span>{' '}
                  {rgColor == 'emerald' ? <ArrowUpRight/> :<ArrowDownLeft/>}
                </div>
              </div>
            )}
        </div>
      </div>
  );
};

export default Total;


const ExpenseTotal = ({ data, className, filters, setFilters, mode, setMode, setFilteredData, ogData, setIsISINTableVisible, isISINTableVisible }: Props) => {
  // console.log(data)
  const [hovered, setHovered] = useState<0 | 1>(1);
  
  const groupedByAssetType = groupBy(data, 'asset_type');
  const groupAll = groupBy(data, null)
  const equityData = groupedByAssetType.find(item => item.asset_type === 'Equity');
  const debtData = groupedByAssetType.find(item => item.asset_type === 'Debt');
  const totalData = groupAll[0];
  // console.log(totalData)
  
  const totalUnrealisedGain = totalData ? Number(totalData.sumOfUnrealizedGain || 0) : 0;
  
  const totalRealizedGain = totalData ? Number(totalData.sumOfRealizedGain || 0) : 0;
  const totalOtherExpenses = totalData ? Number(totalData.sumOfOtherExpenses || 0) : 0;
  const totalSttPaid = totalData ? Number(totalData.sumOfSttPaid || 0) : 0;
  const totalStampDuty = totalData ? Number(totalData.sumOfStampDuty || 0) : 0;
  const totalExpenses = totalOtherExpenses + totalSttPaid + totalStampDuty;
  const equityExpenses = equityData ? Number(equityData.sumOfSttPaid || 0) + Number(equityData.sumOfStampDuty || 0) + Number(equityData.sumOfOtherExpenses || 0) : 0;
  const debtExpenses = debtData ? Number(debtData.sumOfSttPaid || 0) + Number(debtData.sumOfStampDuty || 0) + Number(debtData.sumOfOtherExpenses || 0) : 0;


  const equityPct = (totalExpenses ? (equityExpenses / totalExpenses) * 100 : 0);
  const debtPct = (totalExpenses ? (debtExpenses / totalExpenses) * 100 : 0);
  
  const { number: animatedEquityExpenses } = useSpring({
    number: equityExpenses,
    from: { number: 0 },
    config: { duration: 500 },
  });

  const { number: animatedDebtExpenses } = useSpring({
    number: debtExpenses,
    from: { number: 0 },
    config: { duration: 500 },

  });

  const { number: animatedOtherExpenses } = useSpring({
    number: totalOtherExpenses,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const { number: animatedStampDuty } = useSpring({
    number: totalStampDuty,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const { number: animatedSttPaid } = useSpring({
    number: totalSttPaid,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const { number: animatedTotalExpenses } = useSpring({
    number: totalExpenses,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const [ugColor, setUgColor] = useState('emerald')
  const [rgColor, setRgColor] = useState('emerald')

  const [isOpen, setIsOpen] = useState(false)

  const [fromYear, setFromYear] = useState<number | ''>('')
  const [toYear, setToYear] = useState<number | ''>('')

  useEffect(() => {
    if(totalUnrealisedGain < 0) setUgColor('ruby')
    else setUgColor('emerald')
    if(totalRealizedGain < 0) setRgColor('ruby')
    else setRgColor('emerald')
  }, [totalUnrealisedGain, totalRealizedGain])
  
  return (
      <div className={`sm:flex flex-wrap items-center justify-around w-full ${className} mb-5`} >
        <div className = "flex flex-col items-center justify-center gap-3 mb-3 sm:mb-0">
          <div className={`${grayText} flex gap-2 flex-col sm:flex-row items-center`}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer flex items-center">
                  {mode}
                  <ChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}/>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/80 border border-none outline-none text-white/80" align="start">
                <DropdownMenuItem onClick={() => setMode("Holdings Value")} className=" text-lg">Holdings Value</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Performance")} className=" text-lg">Performance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Expenses")} className=" text-lg">Expenses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Gain")} className=" text-lg">Gain</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <div className="flex w-[200px] divide-x divide-white/50 overflow-hidden rounded-2xl">
                <Input placeholder="From Year" value={fromYear === 0 ? '' : fromYear} className="bg-white/10 h-[30px] outline-none border-none focus:outline-none focus:border-none text-white/80 placeholder:text-white/50" onChange={(e) => setFromYear(parseInt(e.target.value) | 0)} />
                <Input placeholder="To Year" value={toYear === 3000 ? '' : toYear} className="bg-white/10 h-[30px] outline-none border-none focus:outline-none focus:border-none text-white/80 placeholder:text-white/50" onChange={(e) => setToYear(parseInt(e.target.value) | 0)} /> 
              </div>
              <Funnel className="cursor-pointer stroke-white/50 hover:stroke-white/80 transition-colors duration-200" onClick={() => { if (fromYear && toYear && fromYear <= toYear && fromYear > 1900 && toYear < 2100) { updateTimeFilter(setFilters, fromYear, toYear); } else { console.warn('Please enter valid years (1900-2100) with From Year <= To Year'); } }}/>
            </div>     
          </div>
          
          <div className="text-[30px] sm:text-[40px] sm:font-bold font-bold">
            ₹ <animated.span>{animatedTotalExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>
          </div>
          
          <div className="flex flex-col items-center justify-center ">
            <div className={`relative min-w-[225px] sm:min-w-[400px] h-[40px] mt-6 mb-3 text-[${grayText2}] hover:text-white/80 overflow-hidden rounded-[8px] flex`}>
              
              {/* Equity Bar */}
              <Tooltip id="BCTooltip1" float place="top" className='z-40'/>
              <div className="h-full bg-emerald cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out" style={{ width: `${equityPct}%` }} onClick={() => { setHovered(1); filterUpdate(setFilters, 'asset_type', 'Equity', setIsISINTableVisible, isISINTableVisible); }}>
                {equityPct > 30 && <div className = {`${grayText2} `}>₹ <animated.span>{animatedEquityExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span></div>}
              </div>
              {/* Debt Bar */}
              <div className="flex absolute right-0 h-full bg-ruby cursor-pointer  items-center justify-center transition-all duration-500 ease-in-out" style={{ width: `${debtPct}%` }} onClick={() => { setHovered(0); filterUpdate(setFilters, 'asset_type', 'Debt', setIsISINTableVisible, isISINTableVisible); }}>
                {debtPct > 30 && <div className = {`${grayText2} hover:text-white/80`}>₹ <animated.span>{animatedDebtExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span></div>}
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row justify-around items-center w-full ${grayText2} `}>
              <div className="flex sm:flex-col flex-row items-center sm:gap-2 gap-1">
                <div className="w-3 h-3 bg-emerald cursor-pointer" onClick={() => { setHovered(1); filterUpdate(setFilters, 'asset_type', 'Equity', setIsISINTableVisible, isISINTableVisible); }}/>
                <div>Equity</div>
                {(equityPct <= 30 && equityPct!=0) && <div>₹ {formatNumber(equityExpenses)}</div>}
              </div>
              <div className="flex items-center sm:gap-2 gap-1">
                <div className="w-3 h-3 bg-ruby cursor-pointer" onClick={() => { setHovered(1); filterUpdate(setFilters, 'asset_type', 'Debt', setIsISINTableVisible, isISINTableVisible); }}/>
                <div>Debt</div>
                {(debtPct <= 30 && debtPct!=0) && <div>₹ {formatNumber(debtExpenses)}</div>}
              </div>
            </div>
          </div>
          
        </div>
        
        <div className = "flex flex-col flex-wrap items-center justify-around e-0 gap-5 ">
            <div className = "flex flex-col">
            <div className = {`${grayText2} ` }>Stamp Duty</div>
            <div className = " text-[23px] text-emerald">₹ <animated.span>{animatedStampDuty.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>{' '}</div>
            </div> 
            <div className = "flex flex-col">
            <div className = {`${grayText2} ` }>STT Paid</div>
            <div className = " text-[23px] text-emerald">₹ <animated.span>{animatedSttPaid.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>{' '}</div>
            </div> 
            <div className = "flex flex-col">
            <div className = {`${grayText2} ` }>Other Expenses</div>
            <div className = " text-[23px] text-emerald">₹ <animated.span>{animatedOtherExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>{' '}</div>
            </div> 
            
        </div>
      </div>
  );
};



const GainTotal = ({ data, className, filters, setFilters, mode, setMode, setFilteredData, ogData, setIsISINTableVisible, isISINTableVisible }: Props) => {
  // console.log(data)
  const [hovered, setHovered] = useState<0 | 1>(1);
  
  const groupedByAssetType = groupBy(data, 'asset_type');
  const groupAll = groupBy(data, null)
  const equityData = groupedByAssetType.find(item => item.asset_type === 'Equity');
  const debtData = groupedByAssetType.find(item => item.asset_type === 'Debt');
  const totalData = groupAll[0];
  console.log(totalData)
  
  
  const totalUnrealisedGain = totalData ? Number(totalData.sumOfUnrealizedGain || 0) : 0;
  const totalRealizedGain = totalData ? Number(totalData.sumOfRealizedGain || 0) : 0;
  const totalOtherExpenses = totalData ? Number(totalData.sumOfOtherExpenses || 0) : 0;
  const totalSttPaid = totalData ? Number(totalData.sumOfSttPaid || 0) : 0;
  const totalStampDuty = totalData ? Number(totalData.sumOfStampDuty || 0) : 0;
  const totalExpenses = totalOtherExpenses + totalSttPaid + totalStampDuty;
  const equityExpenses = equityData ? Number(equityData.sumOfSttPaid || 0) + Number(equityData.sumOfStampDuty || 0) + Number(equityData.sumOfOtherExpenses || 0) : 0;
  const debtExpenses = debtData ? Number(debtData.sumOfSttPaid || 0) + Number(debtData.sumOfStampDuty || 0) + Number(debtData.sumOfOtherExpenses || 0) : 0;


  const equityPct = (totalExpenses ? (equityExpenses / totalExpenses) * 100 : 0);
  const debtPct = (totalExpenses ? (debtExpenses / totalExpenses) * 100 : 0);
  
  const debtXirr = debtData ? Number(debtData.xirr || 0) : 0;
  
  const { number: animatedEquityExpenses } = useSpring({
    number: equityExpenses,
    from: { number: 0 },
    config: { duration: 500 },

  });

  const { number: animatedDebtExpenses } = useSpring({
    number: debtExpenses,
    from: { number: 0 },
    config: { duration: 500 },

  });

  const { number: animatedOtherExpenses } = useSpring({
    number: totalOtherExpenses,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const { number: animatedStampDuty } = useSpring({
    number: totalStampDuty,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const { number: animatedSttPaid } = useSpring({
    number: totalSttPaid,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const { number: animatedTotalExpenses } = useSpring({
    number: totalExpenses,
    from: { number: 0 },
    config: { duration: 300 },
  });

  const [ugColor, setUgColor] = useState('emerald')
  const [rgColor, setRgColor] = useState('emerald')

  const [isOpen, setIsOpen] = useState(false)

  const [fromYear, setFromYear] = useState<number | ''>('')
  const [toYear, setToYear] = useState<number | ''>('')

  useEffect(() => {
    if(totalUnrealisedGain < 0) setUgColor('ruby')
    else setUgColor('emerald')
    if(totalRealizedGain < 0) setRgColor('ruby')
    else setRgColor('emerald')
  }, [totalUnrealisedGain, totalRealizedGain])
  
  return (
      <div className={`sm:flex flex-wrap items-center justify-around w-full ${className} overflow-hidden gap-5`} >
        <div className = "flex flex-col items-center justify-center gap-3 sm:mb-0 mb-3">
          <div className={`${grayText} flex gap-2 `}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer flex items-center">
                  {mode}
                  <ChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}/>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/80 border border-none outline-none text-white/80" align="start">
                <DropdownMenuItem onClick={() => setMode("Holdings Value")} className=" text-lg">Holdings Value</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Performance")} className=" text-lg">Performance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Expenses")} className=" text-lg">Expenses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("Gain")} className=" text-lg">Gain</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <div className="flex w-[200px] divide-x divide-white/50 overflow-hidden rounded-2xl">
                <Input placeholder="From Year" value={fromYear === 0 ? '' : fromYear} className="bg-white/10 h-[30px] outline-none border-none focus:outline-none focus:border-none text-white/80 placeholder:text-white/50" onChange={(e) => setFromYear(parseInt(e.target.value) | 0)} />
                <Input placeholder="To Year" value={toYear === 3000 ? '' : toYear} className="bg-white/10 h-[30px] outline-none border-none focus:outline-none focus:border-none text-white/80 placeholder:text-white/50" onChange={(e) => setToYear(parseInt(e.target.value) | 0)} /> 
              </div>
              <Funnel className="cursor-pointer stroke-white/50 hover:stroke-white/80 transition-colors duration-200" onClick={() => { if (fromYear && toYear && fromYear <= toYear && fromYear > 1900 && toYear < 2100) { updateTimeFilter(setFilters, fromYear, toYear); } else { console.warn('Please enter valid years (1900-2100) with From Year <= To Year'); } }}/>
            </div>     
          </div>
          
          <div className="text-[30px] sm:text-[40px] sm:font-bold font-bold">
            ₹ <animated.span>{animatedTotalExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>
          </div>
          
          <div className="flex flex-col items-center justify-center ">
            <div className={`hidden sm:block relative w-full min-w-[500] h-[40px] mt-6 mb-3 text-[${grayText2}] hover:text-white/80 overflow-hidden rounded-[8px] flex`}>
              {/* Equity Bar */}
              <Tooltip id="BCTooltip1" float place="top" className='z-40'/>
              <div className="h-full bg-emerald cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out" style={{ width: `${equityPct}%` }} onClick={() => { setHovered(1); filterUpdate(setFilters, 'asset_type', 'Equity', setIsISINTableVisible, isISINTableVisible); }}>
                {equityPct > 30 && <div className = {`${grayText2} `}>₹ <animated.span>{animatedEquityExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span></div>}
              </div>
              {/* Debt Bar */}
              <div className="flex absolute right-0 h-full bg-ruby cursor-pointer  items-center justify-center transition-all duration-500 ease-in-out" style={{ width: `${debtPct}%` }} onClick={() => { setHovered(0); filterUpdate(setFilters, 'asset_type', 'Debt', setIsISINTableVisible, isISINTableVisible); }}>
                {debtPct > 30 && <div className = {`${grayText2} hover:text-white/80`}>₹ <animated.span>{animatedDebtExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span></div>}
              </div>
            </div>
            <div className={`md:flex justify-around w-full ${grayText2} `}>
              <div className="flex sm:flex-col flex-row items-center sm:gap-2 gap-1">
                <div className="w-3 h-3 bg-emerald cursor-pointer" onClick={() => { setHovered(1); filterUpdate(setFilters, 'asset_type', 'Equity', setIsISINTableVisible, isISINTableVisible); }}/>
                <div>Equity</div>
                {(equityPct <= 30 && equityPct!=0) && <div>₹ {formatNumber(equityExpenses)}</div>}
              </div>
              <div className="flex items-center sm:gap-2 gap-1">
                <div className="w-3 h-3 bg-ruby cursor-pointer" onClick={() => { setHovered(1); filterUpdate(setFilters, 'asset_type', 'Debt', setIsISINTableVisible, isISINTableVisible ); }}/>
                <div>Debt</div>
                {(debtPct <= 30 && debtPct!=0) && <div>₹ {formatNumber(debtExpenses)}</div>}
              </div>
            </div>
          </div>
          
        </div>
        
        <div className = "flex flex-col flex-wrap items-center justify-around p-0 gap-5 ">
            <div className = "flex flex-col">
            <div className = {`${grayText2} ` }>Stamp Duty</div>
            <div className = " text-[23px] text-emerald">₹ <animated.span>{animatedStampDuty.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>{' '}</div>
            </div> 
            <div className = "flex flex-col">
            <div className = {`${grayText2} ` }>STT Paid</div>
            <div className = " text-[23px] text-emerald">₹ <animated.span>{animatedSttPaid.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>{' '}</div>
            </div> 
            <div className = "flex flex-col">
            <div className = {`${grayText2} ` }>Other Expenses</div>
            <div className = " text-[23px] text-emerald">₹ <animated.span>{animatedOtherExpenses.to(val => Math.round(val).toLocaleString('en-IN'))}</animated.span>{' '}</div>
            </div> 
            
        </div>
      </div>
  );
};
