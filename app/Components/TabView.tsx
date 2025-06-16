'use client'; 

import { glass, grayText2 } from "../styling";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area";
import PChart from "./HighPie";
import {Legend, BChart} from "./BarChart";
import { useEffect, useState } from "react";
import { SubTable } from "./DataTable";

interface DataItem{
  id: number;
  entity: string;
  advisor: string;
  substrategy: string;
  isin: string;
  folio_no: string;
  name: string;
  quantity: string;
  avg_cost: string;
  market_price: string;
  closing_cost: string;
  closing_value: string;
  unrealized_gain: string;
  irr: string;
  gain_cq: string | null;
  irr_cq: string | null;
  asset_type: string;
  strategy: string;
}

type Props = { 
    title : string, 
    groupByField : string,
    className : string, 
    //have to change
    data : DataItem[],
    filters : string[], 
    setFilters : any
}

const TabView = ({title, groupByField, className, data, filters, setFilters} : Props) => {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
        setIsLargeScreen(window.innerWidth >= 1024); // 1024px is usually considered the 'lg' screen size
        };

        // Set initial screen size
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [selectedTab, setSelectedTab] = useState("Bar");
    const [mountedTab, setMountedTab] = useState("Bar");


    return (
    <div className ={`${className} flex flex-col justify-between gap-2 overflow-hidden`} >
        <div className={`${grayText2}`}>{title}</div>
        <ScrollArea className="w-full h-full">
            <Tabs onValueChange={setSelectedTab}
             defaultValue = {(title == "Strategy-wise" || title == "Sub-Strategy" ) ? "Pie" : "Bar"} 
             className="w-full h-full flex flex-col items-center justify-between gap-5 "
            >
                <TabsList className={`${glass} overflow-hidden p-0 flex gap-0 ${grayText2}`}>
                    <TabsTrigger 
                        value="Bar" 
                        className={`px-4 data-[state=active]:bg-white/20 focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Bar
                    </TabsTrigger>
                    <TabsTrigger 
                        value="Pie" 
                        className={`px-4 data-[state=active]:bg-white/20 tab-trigger bg-none focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Pie
                    </TabsTrigger>
                    {!isLargeScreen && <TabsTrigger 
                        value="Legend" 
                        className={` data-[state=active]:bg-white/20 focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Legend
                    </TabsTrigger>}
                    <TabsTrigger 
                        value="Table" 
                        className={`px-4 data-[state=active]:bg-white/20 focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Table
                    </TabsTrigger>
                </TabsList>


                <TabsContent value="Bar" key={1} className = 'flex justify-center w-full'>   
                    <div className="h-full w-full  flex items-center justify-center">
                        <BChart data={data} groupByField={groupByField} filters={filters} setFilters={setFilters} className=''/>
                    </div>    
                </TabsContent>
                
                <TabsContent value="Pie" key={2} className = 'flex justify-center'>
                    <div className="h-full w-full flex items-center justify-around max-w-[620] ">
                        <PChart data={data} groupByField={groupByField} filters={filters} setFilters={setFilters} className = 'max-w-full max-h-full'/>
                        <div
                        className={`border-none`}
                        style={{
                            display: isLargeScreen ? 'block' : 'none', // Show only on large screens
                        }}
                        >
                            <Legend data={data} groupByField={groupByField} className = ''/>
                        </div>
                    </div>      
                </TabsContent>
                {!isLargeScreen && 
                <TabsContent value="legend" key={4} 
                className = 'flex justify-center w-full '
                // style={{
                //     display: isLargeScreen ? 'block' : 'none', // Show only on large screens
                // }}
                >   
                    <div className="h-full w-full  flex items-center justify-center lg:hidden">
                        <Legend data={data} groupByField={groupByField} className = ''/>
                    </div>    
                </TabsContent>
                }
                <TabsContent value="Table" key={3} className = 'flex justify-center'>
                    <SubTable ogdata={data} groupByField={groupByField} />             
                </TabsContent>

            </Tabs>
        </ScrollArea>
            
    </div>
    );
}

export default TabView