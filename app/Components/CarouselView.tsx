'use client'; 

import { glass, grayText2 } from "../styling";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import PChart from "./HighPie";
import {Legend, BChart} from "./BarChart";
import { useEffect, useState } from "react";
import { SubTable } from "./DataTable";

interface DataItem{
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
    title : string, 
    groupByField : string,
    className : string, 
    //have to change
    data : DataItem[],
    filters : string[], 
    setFilters : any
}

const CarouselView = ({title, groupByField, className, data, filters, setFilters} : Props) => {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
        setIsLargeScreen(window.innerWidth >= 1024); // 1024px is usually considered the 'lg' screen size
        };

        // Set initial screen size
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
    <div className ={className} >
        <div className={`${grayText2}`}>{title}</div>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            // plugins={[
            //     Autoplay({
            //     delay: 10000,
            //     }),
            // ]
        // } 
        className="max-w-full h-full flex justify-center gap-0">
            <CarouselContent className="h-full w-full">
                {/* <CarouselItem> */}
                <CarouselItem key={1} className = 'flex justify-center w-full'>   
                    <div className="h-full w-full  flex items-center justify-center">
                        <BChart data={data} groupByField={groupByField} filters={filters} setFilters={setFilters} className=''/>
                    </div>    
                </CarouselItem>
                <CarouselItem key={2} className = 'flex justify-center'>
                    <div className="h-full w-full flex items-center justify-around max-w-[620] ">
                        <PChart data={data} groupByField={groupByField} filters={filters} setFilters={setFilters} className = 'max-w-full max-h-full'/>
                        <div
                        className={`border-none`}
                        style={{
                            display: isLargeScreen ? 'block' : 'none', // Show only on large screens
                        }}
                        >
                            <Legend data={data} groupByField={groupByField} className = ''/>
                        </div>
                    </div>               
                </CarouselItem>
                <CarouselItem key={3} className = 'flex justify-center'>
                    <SubTable ogdata={data} groupByField={groupByField} />             
                </CarouselItem>
                {!isLargeScreen && 
                <CarouselItem key={4} 
                className = 'flex justify-center w-full '
                // style={{
                //     display: isLargeScreen ? 'block' : 'none', // Show only on large screens
                // }}
                >   
                    <div className="h-full w-full  flex items-center justify-center lg:hidden">
                        <Legend data={data} groupByField={groupByField} className = ''/>
                    </div>    
                </CarouselItem>
                }
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
        </Carousel>
    </div>
    );
}

export default CarouselView