'use client'; 

import { glass, grayText2 } from "../styling";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area";
import PChart from "./HighPie";
import {Legend, BChart} from "./BarChart";
import { useEffect, useState } from "react";
import { SubTable } from "./DataTable";
import DataItem from "../Utilities/dataItem";

type Props = { 
    title : string, 
    groupByField : string,
    className : string, 
    //have to change
    data : DataItem[],
    filters : string[], 
    setFilters : any,
    mode?: string
}

const TabView = ({title, groupByField, className, data, filters, setFilters, mode} : Props) => {
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

    // Determine the default tab based on mode and title
    const getDefaultTab = () => {
        if (mode === "Expenses") {
            return "Table";
        }
        if (title === "Strategy-wise" || title === "Sub-Strategy") {
            return "Pie";
        }
        return "Bar";
    };

    const [selectedTab, setSelectedTab] = useState(getDefaultTab());

    // Update selected tab when mode changes
    useEffect(() => {
        setSelectedTab(getDefaultTab());
    }, [mode, title]);

    return (
    <div className ={`
        ${className} ${glass} py-6 flex grow-1 
        flex-col justify-between gap-2 overflow-hidden
    `} >
        <div className={`${grayText2}`}>{title}</div>
        <ScrollArea className="w-full h-[400px]">
            <Tabs 
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full h-full flex flex-col items-center justify-between gap-5 "
            >
                <TabsList className={`${glass} overflow-hidden p-0 flex gap-0 ${grayText2}`}>
                    {mode != 'Expenses' && 
                    <TabsTrigger 
                        value="Bar" 
                        className={`px-4 data-[state=active]:bg-white/20 focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Bar
                    </TabsTrigger>}
                    {mode != 'Expenses' && 
                    <TabsTrigger 
                        value="Pie" 
                        className={`px-4 data-[state=active]:bg-white/20 tab-trigger bg-none focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Pie
                    </TabsTrigger>}
                    {!isLargeScreen && mode != 'Expenses' && <TabsTrigger 
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


                {mode != 'Expenses' &&  <TabsContent value="Bar" key={1} className = 'flex justify-center w-full'>   
                    <div className="h-full w-full  flex items-center justify-center">
                        <BChart data={data} groupByField={groupByField} filters={filters} setFilters={setFilters} className=''/>
                    </div>    
                </TabsContent>}
                
                {mode != 'Expenses' &&  <TabsContent value="Pie" key={2} className = 'flex justify-center'>
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
                </TabsContent>}

                {!isLargeScreen && mode != 'Expenses' &&  
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
                    <ScrollArea className="h-full w-full">
                        <SubTable ogdata={data} groupByField={groupByField} mode={mode} setFilters={setFilters}/> 
                    </ScrollArea>
                </TabsContent>

            </Tabs>
        </ScrollArea>
            
    </div>
    );
}

export default TabView