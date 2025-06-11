import React from 'react'
import { glass, grayText, grayText2, glassHead} from '../styling'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from 'react';

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
  
};

type Props = {
    className : string,
    data : any,
    region? :string
}

type StockData = {
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
};

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


function getTop10Stocks(data: StockData[], region?: string){
//   alert('top10')
  const stockName = region + ' Direct Equity'
  return data
    .filter(item => item.substrategy === stockName)
    .map(item => {
      const gain = parseFloat(item.unrealized_gain || '0');
      const cost = parseFloat(item.closing_cost || '1'); // avoid division by 0
      const gainPercent = (gain / cost) * 100;
    //   alert(gainPercent)
      return { ...item, gainPercent };
    })
    .sort((a, b) => b.gainPercent - a.gainPercent)
    .slice(0, 15);
}

const LeadingStocks = ({className, data, region} : Props) => {
    const [top10, setTop10] = useState<StockData[]>([]);
    useEffect(()=>{
        const arr = getTop10Stocks(data, region);
        setTop10(arr);
        // console.log(arr)
    }, [data])

    return (
    <div className={`${className} ${glassHead}`}>
        <div className={`${grayText2} mb-5`}>Leading Stocks</div>
        <ScrollArea className='h-full w-full '>
            <div className={`flex flex-col overflow:hidden gap-5 text-gray-200`} >
                {top10.map((data : StockData, index) => (

                    <div key={index}>
                        {region == 'India' ? data.name.slice(0,-5) : toTitleCase(data.name)}
                    </div>
                ))}
            </div>
        </ScrollArea>
        
    </div>
    );
}

export default LeadingStocks