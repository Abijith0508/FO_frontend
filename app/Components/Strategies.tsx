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
import BChart from "./BarChart";

const chartData = [
  { name: "Strategy A", value: 400 },
  { name: "Strategy B", value: 300 },
  { name: "Strategy C", value: 300 },
  { name: "Strategy D", value: 200 },
  { name: "Strategy A", value: 400 },
  { name: "Strategy B", value: 300 },
];
// {top10} : Props
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
    className : string, 
    //have to change
    data : any,
    filters : string[]
}

const Strategies = ({className, data, filters} : Props) => {
    return (
    <div className ={className} >
        <div className={`${grayText2}`}>Strategies</div>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
        plugins={[
            Autoplay({
            delay: 10000,
            }),
        ]} className="max-w-full h-full flex justify-center">
            <CarouselContent className="h-full">
                {/* <CarouselItem> */}
                <CarouselItem key={1} className = 'flex justify-center'>
                    <div className="h-full w-full flex items-center justify-center">
                        <PChart data={data} groupByField="strategy" filters={filters} className = 'max-w-full max-h-full'/>
                    </div>               
                </CarouselItem>
                <CarouselItem key={2} className = 'flex justify-center w-full'>   
                    <div className="h-full w-full  flex items-center justify-center">
                        <BChart data={chartData} className=''/>
                    </div>    
                </CarouselItem>
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
        </Carousel>
    </div>
    );
}

export default Strategies