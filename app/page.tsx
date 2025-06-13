'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";
import 'react-tooltip/dist/react-tooltip.css'
import { Data } from "./Data";
import "./globals.css"

import { glass, sideglass } from "./styling";
import SideBar from "./Components/SideBar";
import Heading from "./Components/Heading";
import Total from "./Components/Total";
import LeadingStocks from "./Components/LeadingStocks";
import CarouselView from "./Components/CarouselView";
import {GroupedDataTable as DataTable} from "./Components/DataTable";
import Top5FunnelChart from "./Components/LeadingStocks";


import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import "highcharts/highcharts-more";
// import "highcharts/modules/drilldown";
// import "highcharts/modules/exporting";
// import "highcharts/modules/funnel";
import { filterFunction } from "./Components/filterFunction";

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

export default function Home() {
  const [mainGp, setMainGp] = useState('Home', );
  const [subGp, setSubGp] = useState('Entity');
  const [thirdGp, setThirdGp] = useState('Strategy');
  
  const [top10, setTop10] = useState<Stock[]>([]);

  const [ogData, setOgData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState([]);
  
  useEffect(() => {
    fetch("http://13.202.119.24/irr/holdings")
      .then((res) => res.json())
      .then((response) => {
        setOgData(response.holdings);
        setFilteredData(response.holdings);
      })
      .catch((err) => console.error("Error fetching holdings:", err));
  }, []);

  useEffect(()=>{
    const x : any = filterFunction(ogData, filters);
    setFilteredData(x);
  }, [filters]);

  
    // console.log(strategyGrouping)

  return (
    <div className="text-white text-center bg-transparent p-0 m-0 ">
      <SideBar/>
        
      <div className="flex flex-col gap-5 justify-around w-[calc((100%_/_11.3_*_9))] pr-[11px] top-0 translate-x-[calc((100%_/_12_*_2.8))] py-5">
        <Heading filters = {filters} setFilters = {setFilters} className = "px-20 py-5"/>
        <Total data={filteredData} filters={filters} setFilters={setFilters} className={` ${glass} py-6 px-15`}/>
        <DataTable data={filteredData} className={`
          
        `}/>
        
      </div>

      <div
        className="w-full h-[2000px] px-[30px] bg-transparent text-white grid grid-rows-12
       grid-cols-12 gap-[15px]"
      >
        
        <CarouselView title='Entity-wise' groupByField="entity" data={filteredData} filters={filters} setFilters={setFilters} className={`flex flex-col 
          
          col-start-1 lg:col-start-3 col-end-13 row-start-1 row-end-4
          ${glass} py-6`}/>

        <CarouselView title='Strategy' groupByField="strategy" data={filteredData} filters={filters} setFilters={setFilters} className={`flex flex-col 
          col-start-1 lg:col-start-3 col-end-13   row-start-4 row-end-7 
          ${glass} py-6`}/>

        <CarouselView title='Advisor-Wise' groupByField="advisor" data={filteredData} filters={filters} setFilters={setFilters} className={`flex flex-col 
          col-start-1 lg:col-start-3 col-end-13 row-start-7 row-end-10
          ${glass} py-6`}/>

        {/* <ScrollArea className="w-[100%] col-start-1 lg:col-start-3  col-end-13 row-start-10 row-end-14 flex gap-5 justify-between">
          <div className="flex gap-5 justify-between"> */}

        <Top5FunnelChart 
            data = {filteredData}
            region = "India"
            className="col-start-1 lg:col-start-3  col-end-8 row-start-10 row-end-13"
        />
        <Top5FunnelChart 
            data = {filteredData}
            region = "US"
            className="col-start-1 lg:col-start-8  col-end-13 row-start-10 row-end-13"
        />

          </div>
          {/* <ScrollBar orientation="horizontal" />
        </ScrollArea> */}

      {/* </div> */}
      
      
      
      <div className='w-full h-[400] bg-primary mt-[15px]'></div>
    </div>
  );
}

