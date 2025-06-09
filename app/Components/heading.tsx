import React from 'react'
import { breadCrumbs } from '../styling'
import { useState } from 'react'

type Props = { 
    mainGp : string; 
    subGp : string;
    thirdGp : string;
    setMainGp : (value :  string) => void;
    setSubGp : (value :  string) => void;
    setThirdGp : (value :  string) => void;
    
}
const Heading = ({mainGp, subGp, thirdGp, setMainGp, setSubGp, setThirdGp} : Props) => {
  return (
    <div className="px-[5px] flex items-center  col-start-3 col-end-13 row-start-1 row-end-2 ">
        
            {/* BreadCrumbs */}
            <BreadcrumbsWithDropdown />
        
    </div>
  )
}


import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronRight, ChevronDown } from "lucide-react"



type crumbProps = { 
    title : string;
    values : string[];
    setValue: (value: string) => void;
}

function Crumb({title, values, setValue} : crumbProps){
    return (
        <BreadcrumbItem>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className = {`${breadCrumbs} text-2xl underline`}>
                <span>{title}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {values.map((valueItem) => (
                    <DropdownMenuItem onSelect={() => setValue(valueItem)}>{valueItem}</DropdownMenuItem>
                ))}
                
            </DropdownMenuContent>
            </DropdownMenu>
        </BreadcrumbItem>
    );
}

type BreadCrumbProps = {
  titleArr : string [];
  
}

export function BreadcrumbsWithDropdown() {
  const mainVals : string[] = ['A', 'B', 'C', 'D'];
  const [subGroupVals, setSubGroupVals] = useState(mainVals);
  const [thirdGroupVals, setThirdGroupVals]= useState(subGroupVals);

  return (
    <Breadcrumb className = {`px-[2%] flex items-baseline justify-between text-xl w-[50%]`}>
      <BreadcrumbItem >
        <BreadcrumbLink href="/" className = {`${breadCrumbs} text-3xl`}>Home</BreadcrumbLink>
      </BreadcrumbItem>
      
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className = {`${breadCrumbs} text-2xl`}>
              <span>1stSelection</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => window.location.href = "/projects/design"}>Design</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => window.location.href = "/projects/dev"}>Development</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => window.location.href = "/projects/marketing"}>Marketing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      
      <BreadcrumbItem>
        <BreadcrumbLink href="/projects/dev" className = {`${breadCrumbs} text-xl`}>2ndSelection</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

export default Heading

