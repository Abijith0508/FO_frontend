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
  { name: "Advisor A", value: 400 },
  { name: "Advisor B", value: 300 },
  { name: "Advisor C", value: 300 },
  { name: "Advisor D", value: 200 },
];


const Advisorwise = ({className} : Props) => {
  return (
    <div className={className}>
        <div className={`${grayText2}`}>Advisor-Wise</div>
        {/* <div className="flex">
            
        </div> */}
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

export default Advisorwise