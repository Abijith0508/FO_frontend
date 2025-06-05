import React from 'react'
import { glass, grayText, grayText2} from '../styling'
import { ScrollArea } from "@/components/ui/scroll-area"

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

type Props = {
    top10: Stock[], 
    className : string;
}
const LeadingStocks = ({top10, className} : Props) => {
    return (
    <div className={className}>
        <div className={`${grayText2} mb-5`}>Leading Stocks</div>
        <ScrollArea className='h-full w-full '>
            <div className="flex flex-col overflow:hidden gap-5 text-gray-300">
                {top10.map((stock : Stock, index) => (
                    <div key={index}>
                        {stock.name}
                    </div>

                ))}
            </div>
        </ScrollArea>
        
    </div>
    );
}

export default LeadingStocks