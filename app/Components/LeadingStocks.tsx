import React from 'react'
import { glass, grayText, grayText2} from '../styling'
import { ScrollArea } from "@/components/ui/scroll-area"

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

type Props = {
    top10: Stock[]
}
const LeadingStocks = ({top10} : Props) => {
    return (
    <div className={`hidden md:block col-start-10 col-end-13 row-start-2 row-end-7 ${glass} overflow-hidden`}>
        <div className={`${grayText2} mb-5`}>Leading Stocks</div>
        <ScrollArea className='h-full w-full '>
            <div className="flex flex-col overflow:hidden gap-5 text-gray-300">
                {top10.map((stock : Stock) => (
                    <div key={stock.ticker}>
                        {stock.name}
                    </div>

                ))}
            </div>
        </ScrollArea>
        
    </div>
    );
}

export default LeadingStocks