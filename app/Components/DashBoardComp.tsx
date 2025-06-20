'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";
import "../globals.css"
import { Eye, EyeOff, RefreshCw, Menu, X } from "lucide-react";
import { download } from "../Utilities/download";
import { glass, responsiveIcon, sideglass } from "../styling";
import SideBar from "../Components/SideBar";
import Heading from "../Components/Heading";
import Total from "../Components/Total";
import TabView from "../Components/TabView";
import {GroupedDataTable as DataTable, ISINLevelView} from "../Components/DataTable";
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
  const [isISINTableVisible, setIsISINTableVisible] = useState(false);

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

  const Icon = isISINTableVisible ? EyeOff : Eye;

  const Icon2 = isOpen ? X : Menu;

  return (
    
    (<div className ="">
      <div className="fixed top-7 sm:top-12 right-6 sm:right-12 z-50 flex flex-col gap-3">
        {!isISINTableVisible && <>
        <Icon2 
            className = {`${responsiveIcon}`}
            onClick={() => setIsOpen(!isOpen)}
            data-tooltip-id="BCTooltip"
            data-tooltip-content={isOpen ? "Close Menu" : "Open Menu"}
            data-tooltip-place="top"
            data-tooltip-float
        />
        {!isOpen && <RefreshCw 
          data-tooltip-id="BCTooltip"
          data-tooltip-content="Refresh Data"
          data-tooltip-place="top"
          data-tooltip-float
          className={`${responsiveIcon}`}
          onClick={() => window.location.reload()}
        />}
        </>}
        {!isOpen && <Icon
          data-tooltip-id="BCTooltip"
          data-tooltip-content="Toggle ISIN Table"
          data-tooltip-place="top"
          data-tooltip-float
          className={`${responsiveIcon}`}
          onClick={() => setIsISINTableVisible(!isISINTableVisible)}
        />}
      </div>
      

      {isISINTableVisible ? 
      <div className="w-full min-h-full mt-5 fixed top-0 -translate-y-[20px] left-0 backdrop-blur-3xl z-30">
          <ISINLevelView data={filteredData} mode={mode}/>
      </div> :
      <div 
        className="text-white text-center bg-transparent p-0 m-0">
        <Tooltip id="BCTooltip" float place="top" className='z-50'/>
        
        
        <SideBar isOpen = {isOpen} setIsOpen={setIsOpen}/>
        {!isOpen&&
          <div className="">
            <Heading filters = {filters} setFilters = {setFilters} className = "sm:pl-10 py-5 top-0 sticky z-40 backdrop-blur-3xl"/>
            <div className = 'px-2 sm:px-10 backdrop-blur-3xl'>
              <Total data={filteredData} ogData={ogData} filters={filters} 
              setFilters={setFilters} className={` ${glass} py-6 sm:px-15 mb-5`} 
              mode={mode} setMode={setMode} setFilteredData={setFilteredData} 
              setIsTableVisible={setIsTableVisible} isTableVisible={isTableVisible}
              />

              <div>
                <motion.div layout className=""  transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  
                  {isTableVisible &&
                  <DataTable data={filteredData} mode={mode} className="pb-5"/>
                  }
                </motion.div> 
              
              </div>

              <div 
                className="w-full bg-transparent text-white justify-around gap-5 
                flex flex-wrap"
              >
                <TabView title='Entity-wise' groupByField="entity" data={filteredData} filters={filters} setFilters={setFilters} 
                  className={`grow-1
                  ${glass}`}
                  mode={mode}/>

                <TabView 
                  title={filters.some(filter => filter.startsWith('strategy')) ? 'Sub-Strategy' : 'Strategy-wise'}
                  groupByField={filters.some(filter => filter.startsWith('strategy')) ? 'substrategy' : 'strategy'}
                  data={filteredData} 
                  filters={filters} 
                  setFilters={setFilters} 
                  className={` grow-1
                  ${glass}  `}
                  mode={mode}
                  
                />

                <TabView 
                  title='Advisor-Wise' 
                  groupByField="advisor" 
                  data={filteredData} 
                  filters={filters} 
                  setFilters={setFilters} 
                  className={`
                    grow-1`}
                  mode={mode}
                  />


              </div>
            
            </div>
          </div>
        }
          
      </div>}
      <footer className='w-full h-[100] bg-primary pt-[15px] backdrop-blur-2xl'></footer>
    </div>)   
  );
}
