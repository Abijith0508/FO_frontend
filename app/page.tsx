'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";
import 'react-tooltip/dist/react-tooltip.css'
import "./globals.css"
import { Download, LoaderCircle } from "lucide-react";
import { download } from "./Utilities/download";
import { glass, sideglass } from "./styling";
import SideBar from "./Components/SideBar";
import Heading from "./Components/Heading";
import Total from "./Components/Total";
import TabView from "./Components/TabView";
import {GroupedDataTable as DataTable} from "./Components/DataTable";
import { Tooltip } from 'react-tooltip';

import { Menu, X } from "lucide-react";
import { filterFunction } from "./Utilities/filterFunction";
import { motion} from 'framer-motion';

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

export default function Home() {
  const [ogData, setOgData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? X : Menu;

  const [isLoading, setIsLoading] = useState(true);

  const [mode , setMode] = useState("Holding Value");

  useEffect(() => {
    fetch("http://13.202.119.24/irr/holdings")
      .then((res) => res.json())
      .then((response) => {
        setOgData(response.holdings);
        setFilteredData(response.holdings);
      })
      .catch((err) => console.error("Error fetching holdings:", err));
      setTimeout(() => setIsLoading(false), 2000);
  }, []);

  useEffect(() => {
    const link = (mode=="Performance")? "http://10.0.0.199:8096/irr/perfnew/" : "http://13.202.119.24/irr/holdings";
    fetch(link)
      .then((res) => res.json())
      .then((response) => {
        if((mode=="Performance")){
          setOgData(response.data);
          setFilteredData(response.data);
        }
        else{
          setOgData(response.holdings);
          setFilteredData(response.holdings);
        }
      })
      .catch((err) => console.error("Error fetching holdings:", err));
  }, [mode]);

  useEffect(()=>{
    const x : any = filterFunction(ogData, filters);
    setFilteredData(x);
  }, [filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen gap-5">
        <p className="text-white/80 text-lg">Fetching data from cloud</p>
        <LoaderCircle className="animate-spin rounded-full h-12 w-12 stroke-secondary"/>
      </div>
    );
  }

  return (
    <>
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
            className="w-full h-[960px] bg-transparent text-white grid grid-rows-6
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
        </div>
          
      </div>
      <footer className='w-full h-[400] bg-primary mt-[15px]'></footer>
    </>
      
  );
}

