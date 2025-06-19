'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";
import "../globals.css"
import { Table2, RefreshCw } from "lucide-react";
import { download } from "../Utilities/download";
import { glass, sideglass } from "../styling";
import SideBar from "../Components/SideBar";
import Heading from "../Components/Heading";
import Total from "../Components/Total";
import TabView from "../Components/TabView";
import {GroupedDataTable as DataTable} from "../Components/DataTable";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'

import { filterFunction } from "../Utilities/filterFunction";
import { motion} from 'framer-motion';

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

type Props = {
  holdingData : any[], 
  performanceData: any[],
  expenseData: any[],
  gainData: any[]
}

export default function DashBoardComp({holdingData, performanceData, expenseData,  gainData} : Props) {
  const [ogData, setOgData] = useState<any[]>(holdingData);
  const [filteredData, setFilteredData] = useState<any[]>(holdingData);
  const [filters, setFilters] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [mode , setMode] = useState("Holding Value");
  const [isTableVisible, setIsTableVisible] = useState(false);

  useEffect(() => {
    if(mode == 'Performance') {
        setOgData(performanceData)
        setFilteredData(performanceData)
    }
    else if(mode == 'Expenses'){
        setOgData(expenseData)
        setFilteredData(expenseData)
    }
    else {
        setOgData(holdingData)
        setFilteredData(holdingData)
    }
    setFilters([]);
  }, [mode]);

  useEffect(()=>{
    const x : any = filterFunction(ogData, filters);
    setFilteredData(x);
  }, [filters]);


  return (
    
    (<div>
      <div 
        className="text-white text-center bg-transparent p-0 m-0">
        <Tooltip id="BCTooltip" float place="top" className='z-50'/>
        <RefreshCw 
          data-tooltip-id="BCTooltip"
          data-tooltip-content="Refresh Data"
          data-tooltip-place="top"
          data-tooltip-float
          className="fixed top-24 right-12 h-8 w-8 z-40 stroke-white/50 hover:stroke-white/80 transition-colors duration-200 border border-none focus:outline-none cursor-pointer"
          onClick={() => window.location.reload()}
        />
        
        <SideBar isOpen = {isOpen} setIsOpen={setIsOpen}/>
        <div className = 'px-10'>
          <div className="flex flex-col gap-5 justify-around pb-5">
            <Heading filters = {filters} setFilters = {setFilters} className = "px-20 pb-5 pt-8"/>
            <Total data={filteredData} ogData={ogData} filters={filters} 
            setFilters={setFilters} className={` ${glass} py-6 px-15`} 
            mode={mode} setMode={setMode} setFilteredData={setFilteredData} 
            setIsTableVisible={setIsTableVisible} isTableVisible={isTableVisible}
            />
            
          </div>

          <div>
            <motion.div layout className="pb-5"  transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              
              {isTableVisible &&
              <DataTable data={filteredData} mode={mode}/>
              
              }
            </motion.div> 
            
          </div>
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
    </div>)   
  );
}
