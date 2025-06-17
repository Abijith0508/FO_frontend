'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";
import "../globals.css"
import { Download, LoaderCircle } from "lucide-react";
import { download } from "../Utilities/download";
import { glass, sideglass } from "../styling";
import SideBar from "../Components/SideBar";
import Heading from "../Components/Heading";
import Total from "../Components/Total";
import TabView from "../Components/TabView";
import {GroupedDataTable as DataTable} from "../Components/DataTable";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'

import { Menu, X } from "lucide-react";
import { filterFunction } from "../Utilities/filterFunction";
import { motion} from 'framer-motion';

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

type Props = {
    holdingData : any[], 
    performanceData: any[]
}
export default function DashBoardComp({holdingData, performanceData} : Props) {
  const [ogData, setOgData] = useState<any[]>(holdingData);
  const [filteredData, setFilteredData] = useState<any[]>(holdingData);
  const [filters, setFilters] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? X : Menu;

  const [isLoading, setIsLoading] = useState(true);

  const [mode , setMode] = useState("Holding Value");

  

  useEffect(() => {
    if(mode == 'Performance') {
        setOgData(performanceData)
        setFilteredData(performanceData)
    }
    else {
        setOgData(holdingData)
        setFilteredData(holdingData)
    }
  }, [mode]);

  useEffect(()=>{
    const x : any = filterFunction(ogData, filters);
    setFilteredData(x);
  }, [filters]);


//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen gap-5">
//         <p className="text-white/80 text-lg">Fetching data from cloud</p>
//         <LoaderCircle className="animate-spin rounded-full h-12 w-12 stroke-secondary"/>
//       </div>
//     );
//   }

  return (
    <div>
      <div 
        className="text-white text-center bg-transparent p-0 m-0">
        <Tooltip id="BCTooltip" float place="top" className='z-40'/>
        <Icon 
          className = "fixed top-12 right-12 h-8 w-8 z-50 stroke-white/50 hover:stroke-white/80 transition-colors duration-200 border border-none focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          data-tooltip-id="BCTooltip"
          data-tooltip-content={isOpen ? "Close Menu" : "Open Menu"}
          data-tooltip-place="top"
          data-tooltip-float
        />
        <Download
          data-tooltip-id="BCTooltip"
          data-tooltip-content="Download Overview Table"
          data-tooltip-place="top"
          data-tooltip-float
          className="fixed top-24 right-12 h-8 w-8  stroke-white/50 hover:stroke-white/80 z-20 transition-colors duration-200 border border-none focus:outline-none"  onClick={() => download('Total')}
        />
        <SideBar isOpen = {isOpen}/>
        <div className = 'px-10'>
          <div className="flex flex-col gap-5 justify-around py-5">
            <Heading filters = {filters} setFilters = {setFilters} className = "px-20 py-5"/>
            <Total data={filteredData} setFilters={setFilters} className={` ${glass} py-6 px-15`} mode={mode} setMode={setMode}/>
            <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <motion.div layout>
                <DataTable data={filteredData} mode={mode}/>
              </motion.div>
            </motion.div>
          </div>
          {isOpen && <div className={`w-full h-[960px] backdrop:blur-2xl fixed top-0 z-30 bg-gradient-to-r from-black/50 to-black/50 via-black/20 backdrop-blur-lg transition duration-500`}/>}
          <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full bg-transparent text-white justify-around gap-5 
            flex flex-wrap"
          >
            <TabView title='Entity-wise' groupByField="entity" data={filteredData} filters={filters} setFilters={setFilters} 
              className={`
                
              ${glass}  `}
              mode={mode}/>

            <TabView 
              title={filters.some(filter => filter.startsWith('strategy')) ? 'Sub-Strategy' : 'Strategy-wise'}
              groupByField={filters.some(filter => filter.startsWith('strategy')) ? 'substrategy' : 'strategy'}
              data={filteredData} 
              filters={filters} 
              setFilters={setFilters} 
              className={`
                `}
              mode={mode}
            />

            <TabView 
              title='Advisor-Wise' 
              groupByField="advisor" 
              data={filteredData} 
              filters={filters} 
              setFilters={setFilters} 
              className={` `}
              mode={mode}
              />


          </motion.div>
        </div>
          
      </div>
      <footer className='w-full h-[400] bg-primary mt-[15px]'></footer>
    </div>
      
  );
}

