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
import TabView from "./Components/TabView";
import {GroupedDataTable as DataTable} from "./Components/DataTable";
import Top5FunnelChart from "./Components/LeadingStocks";


import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import { filterFunction } from "./Utilities/filterFunction";
import { Skeleton } from "@/components/ui/skeleton";
import { motion , AnimatePresence} from 'framer-motion';

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [ogData, setOgData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState<string[]>([]);
  const Icon = isOpen ? X : Menu;

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
    console.log(filters)
  }, [filters]);

  
    // console.log(strategyGrouping)

  return (
    <div 
      className="text-white text-center bg-transparent p-0 m-0">
      <Icon 
        className = "fixed top-12 right-10 z-50 stroke-white/50 hover:stroke-white/80 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      />
      <SideBar isOpen = {isOpen}/>
      <div className = 'px-10'>
        <div className="flex flex-col gap-5 justify-around py-5">
          <Heading filters = {filters} setFilters = {setFilters} className = "px-20 py-5"/>
          <Total data={filteredData} filters={filters} setFilters={setFilters} className={` ${glass} py-6 px-15`}/>
          <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <motion.div layout>
              <DataTable data={filteredData}/>
            </motion.div>
          </motion.div>
        </div>
        {isOpen && <div className={`w-full h-[1000px] backdrop:blur-2xl fixed top-0 z-30 bg-gradient-to-r from-black/20 to-black/20 via-white/0 backdrop-blur-lg transition duration-500`}/>}
        <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full h-[1200px] bg-transparent text-white grid grid-rows-7
        grid-cols-12 gap-[15px]"
        >
          <TabView title='Entity-wise' groupByField="entity" data={filteredData} filters={filters} setFilters={setFilters} className={`flex flex-col 
            
            col-start-1 col-end-7 row-start-1 row-end-4
            ${glass} py-6 flex place-content-center`}/>

          <TabView 
            title={filters.some(filter => filter.startsWith('strategy')) ? 'Sub-Strategy' : 'Strategy-wise'}
            groupByField={filters.some(filter => filter.startsWith('strategy')) ? 'substrategy' : 'strategy'}
            data={filteredData} 
            filters={filters} 
            setFilters={setFilters} 
            className={`flex flex-col 
              col-start-7 col-end-13 row-start-1 row-end-4 
              ${glass} py-6`}
          />

          <TabView 
            title='Advisor-Wise' 
            groupByField="advisor" 
            data={filteredData} 
            filters={filters} 
            setFilters={setFilters} 
            className={`flex flex-col 
            col-start-1 col-end-13 row-start-4 row-end-7
            ${glass} py-6`}/>


        </motion.div>
        
        
        <div className='w-full h-[400] bg-primary mt-[15px]'></div>
      </div>
        
    </div>
  );
}

