'use client'; 

import { glass, grayText2 } from "../styling";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PChart from "./HighPie";
import {Legend, BChart} from "./BarChart";
import { useEffect, useState } from "react";
import { SubTable } from "./DataTable";
import DataItem from "../Utilities/dataItem";
import { Divide } from "react-feather";

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


    if(mode=="Expenses"){           
        return <ExpenseTabView title={title} groupByField={groupByField} data={data} filters={filters} setFilters={setFilters} 
              className={className}
              mode={mode}/>
    }
    if (mode=="Gain") {
        return <GainTabView title={title} groupByField={groupByField} data={data} filters={filters} setFilters={setFilters} 
              className={className}
              mode={mode}/>
    }

    return (
    <div className ={`
        ${className} ${glass} py-6 flex flex-col gap-2 items-center justify-between h-auto overflow-x-auto 
    `}>
        <Tabs 
            defaultValue={selectedTab}
            className="w-full h-full flex flex-col items-center justify-between gap-5 overflow-hidden"
        >   
            <div className="flex flex-col gap-2">
                <div className={`${grayText2}`}>{title}</div>
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
                    {/* {!isLargeScreen && mode != 'Expenses' && <TabsTrigger 
                        value="Legend" 
                        className={` data-[state=active]:bg-white/20 focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Legend
                    </TabsTrigger>} */}
                    
                    <TabsTrigger 
                        value="Table" 
                        className={`px-4 data-[state=active]:bg-white/20 focus:bg-none focus:outline-none focus:ring-0 hover:bg-white/20 h-full border-none ${grayText2}`}
                    >
                        Table
                    </TabsTrigger>
                </TabsList>
            </div>


            <TabsContent value="Bar" key={1} className = 'flex justify-center max-w-full'>   
                <div className="
                    flex items-center justify-center max-w-full">
                    <BChart data={data} groupByField={groupByField} filters={filters} setFilters={setFilters} className=''/>
                </div> 
            </TabsContent>
            
            <TabsContent value="Pie" key={2} className="flex justify-center">
                <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
                    {/* Pie Chart */}
                    <div className="flex justify-center">
                        <PChart
                            data={data}
                            groupByField={groupByField}
                            filters={filters}
                            setFilters={setFilters}
                            className="max-w-full max-h-full"
                        />
                    </div>
                    {/* Legend: below chart on mobile/tablet, right of chart on desktop */}
                    <div className="mt-4 lg:mt-0">
                        {/* Mobile/Tablet: horizontal scroll */}
                        <div className="block lg:hidden w-full overflow-x-auto">
                            <div className="flex flex-row whitespace-nowrap items-center">
                                <Legend
                                    data={data}
                                    groupByField={groupByField}
                                    className=""
                                />
                            </div>
                        </div>
                        {/* Desktop: vertical legend */}
                        <div className="hidden lg:block ml-4">
                            <Legend
                                data={data}
                                groupByField={groupByField}
                                className=""
                            />
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="Table" key={3} className = 'flex justify-center w-full h-full'>
                <ScrollArea className="h-full w-full">
                    <SubTable ogdata={data} groupByField={groupByField} mode={mode} setFilters={setFilters}/> 
                    <ScrollBar orientation="horizontal" />       
                </ScrollArea>
            </TabsContent>
        </Tabs>
    </div>
    );
}

const ExpenseTabView = ({title, groupByField, className, data, filters, setFilters, mode} : Props) => {
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

    // Determine the default tab based on mode and tit

    return (
    <div className ={`
        ${className} ${glass} py-6 flex grow-1 
        flex-col justify-between gap-2 overflow-hidden
    `} >
        <div className={`${grayText2}`}>{title}</div>
        <ScrollArea className="top-10 w-fullh-[400px] overflow-x-auto overflow-y-auto">
            <ScrollArea className="h-full w-full overflow-x-auto overflow-y-auto">
                <SubTable ogdata={data} groupByField={groupByField} mode={mode} setFilters={setFilters}/> 
            </ScrollArea>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
            
    </div>
    );
}

const GainTabView = ({title, groupByField, className, data, filters, setFilters, mode} : Props) => {
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

    // Determine the default tab based on mode and tit

    return (
    <div className ={`
        ${className} ${glass} py-6 flex grow-1 
        flex-col justify-between gap-2 overflow-hidden
    `} >
        <div className={`${grayText2}`}>{title}</div>
        <ScrollArea className="top-10 w-fullh-[400px] overflow-x-auto overflow-y-auto">
            <ScrollArea className="h-full w-full  overflow-x-auto overflow-y-auto">
                <SubTable ogdata={data} groupByField={groupByField} mode={mode} setFilters={setFilters}/> 
            </ScrollArea>
        </ScrollArea>
            
    </div>
    );
}


export default TabView