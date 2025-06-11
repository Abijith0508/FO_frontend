import React from 'react'
import { glass, grayText, grayText2} from '../styling'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from 'react';

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
  
};

type Props = {
    className : string,
    data : any
}

const LeadingStocks = ({className, data} : Props) => {
    const [top10, setTop10] = useState([]);

    return (
    <div className={`${className} text-gray`}>
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