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

type Props = { 
    className : string
}

const chartData = [
  { name: "Entity A", value: 400 },
  { name: "Entity B", value: 300 },
  { name: "Entity C", value: 300 },
  { name: "Entity D", value: 200 },
];

const Entitywise = ({className} : Props) => {
  return (
    <div className={className}>
      <div className={`${grayText2}`}>Entity-Wise</div>
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
                        <PChart data={chartData} className = 'max-w-full max-h-full'/>
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
  )
}

export default Entitywise