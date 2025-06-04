import { glass, grayText2 } from "../styling";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

type Props = { 
    top10 : string[]
}
// {top10} : Props
const Strategies = () => {
    return (
    <div className={`flex flex-col col-start-2 col-end-13 md:col-end-10  row-start-4 row-end-7 ${glass}`}>
        <div className={`${grayText2}`}>Strategies</div>
        <div className="flex-1 flex items-center justify-center px-20">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
            plugins={[
                Autoplay({
                delay: 4000,
                }),
            ]} className="w-full h-full flex justify-center">
                <CarouselContent className="h-full">
                    {/* <CarouselItem> */}
                    <CarouselItem key={1} className = 'flex justify-center'>
                        <div className="h-full w-100 bg-amber-50/10 flex items-center justify-center">Pie Chart</div>               
                    </CarouselItem>
                    <CarouselItem key={2} className = 'flex justify-center w-full'>   
                        <div className="h-full w-100 bg-amber-50/10 flex items-center justify-center">Legend</div>    
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
        
            
        <div>
            
        </div>
    </div>
    );
}

export default Strategies