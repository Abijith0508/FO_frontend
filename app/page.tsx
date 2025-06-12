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
import DataTable from "./Components/DataTable";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import "highcharts/modules/drilldown";
import "highcharts/modules/exporting";
import "highcharts/modules/funnel";
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

  const [ogData, setOgData] = useState(Data);
  const [filteredData, setFilteredData] = useState(Data);
  const [filters, setFilters] = useState([])

  const x: Stock[] = [
    { ticker: "AQT", name: "AquaTech Corp", sharesOutstanding: 4_500_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 },
    { ticker: "BLQ", name: "BlueQuantum Ltd", sharesOutstanding: 2_100_000_000 },
    { ticker: "NSC", name: "Novascan Inc", sharesOutstanding: 1_750_000_000 },
    { ticker: "KPT", name: "Krypton Partners", sharesOutstanding: 1_400_000_000 },
    { ticker: "HLC", name: "Helicon Labs", sharesOutstanding: 1_000_000_000 },
    { ticker: "VRD", name: "Veridex Holdings", sharesOutstanding: 800_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 },
    { ticker: "BLQ", name: "BlueQuantum Ltd", sharesOutstanding: 2_100_000_000 },
    { ticker: "NSC", name: "Novascan Inc", sharesOutstanding: 1_750_000_000 },
    { ticker: "KPT", name: "Krypton Partners", sharesOutstanding: 1_400_000_000 },
    { ticker: "HLC", name: "Helicon Labs", sharesOutstanding: 1_000_000_000 },
    { ticker: "VRD", name: "Veridex Holdings", sharesOutstanding: 800_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 }
  ];

  
  
  useEffect(() => {
    setTop10(x);
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
        className="w-full h-[1900px] px-[30px] bg-transparent text-white grid grid-rows-14
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

        <div className="col-start-1  col-end-13 row-start-10 row-end-14 flex  gap-5 justify-between w-[calc((100%_/_11.3_*_9))] pr-[11px] top-0 translate-x-[calc((100%_/_12_*_2.8))] py-5">
          <LeadingStocks 
              data = {filteredData}
              region = "India"
          />
          <LeadingStocks 
              data = {filteredData}
              region = "US"
          />
        </div>
      </div>
      
      
      
      <div className='w-full h-[400] bg-primary mt-[15px]'></div>
    </div>
  );
}

