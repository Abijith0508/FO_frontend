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
    className : string
}

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
              delay: 8000,
              }),
          ]} className="w-full h-full flex justify-center">
              <CarouselContent className="h-full">
                  {/* <CarouselItem> */}
                  <CarouselItem key={1} className = 'flex justify-center'>
                      <div className="h-full w-100 bg-amber-50/10 flex items-center justify-center">Pie Chart</div>               
                  </CarouselItem>
                  <CarouselItem key={2} className = 'flex justify-center w-full'>   
                      <div className="h-full w-100 bg-amber-50/10 flex items-center justify-center">Bar Chart</div>    
                  </CarouselItem>
              </CarouselContent>
              {/* <CarouselPrevious />
              <CarouselNext /> */}
        </Carousel>
    </div>
  )
}

export default Advisorwise