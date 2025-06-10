'use client'; 
import Link from "next/link";
import { sideglass, sideTitle, responsive } from "../styling";
// import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";
import { useRef, useEffect } from "react";
import { glass } from "../styling";

type MenuItem = {
  title: string
  href?: string
  children?: { title: string; href: string }[]
  icon : any
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', href: '/', icon: 'none'},
  {
    title: 'Transactions',
    children: [
      { title: 'Mutual Funds', href: '/transactions/mutual-funds' },
      { title: 'Stocks', href: '/transactions/stocks' },
      { title: 'PMS', href: '/transactions/pms' },
      { title: 'AIF', href: '/transactions/aif' },
      { title: 'Other', href: '/transactions/other' },
    ], icon: 'none'
  },
  {
    title: 'Analytics',
    children: [
      { title: 'Portfolio Performance', href: '/analytics/performance' },
      { title: 'Wealth Register', href: '/analytics/register' },
      { title: 'Gain Report', href: '/analytics/gain' },
      { title: 'US Stocks', href: '/analytics/us-stocks' },
      { title: 'Equity Stocks', href: '/analytics/equity-stocks' },
      { title: 'Equity Mutual Funds', href: '/analytics/equity-mutual-funds' },
    ], icon: 'none'
  },
  {
    title: 'Masters',
    children: [
      { title: 'Mutual Funds', href: '/masters/mutual-funds' },
      { title: 'Stocks', href: '/masters/stocks' },
      { title: 'US Stocks', href: '/masters/us-stocks' },
      { title: 'Other Assets', href: '/masters/other-assets' },
      { title: 'Entities', href: '/masters/entities' },
      { title: 'Advisors', href: '/masters/advisors' },
      { title: 'Currency', href: '/masters/currency' },
      { title: 'Custom Tags', href: '/masters/tags' },
      { title: 'Dmat Accounts', href: '/masters/dmat-accounts' },
      { title: 'Dmat Wise Stocks', href: '/masters/dmat-wise-stocks' },
    ],icon: 'none'
  },
  { title: 'Account', href: '/account', icon: 'none'},
]

function SideBar(){   
  return (
    // <ScrollArea className='h-full w-full p-5'>
        <Accordion type="single" collapsible 
            className={` scroll-auto fixed left-0 h-full 
                    w-[calc((100%/11.3*2))]
                    
                    ${sideglass} shadow-md 
                    z-50
                    py-5 px-auto 
                    justify-around top-1/2 transform-all -translate-y-1/2 
                    flex flex-col
                    pl-[10%]
                    lg:pl-[3%] pr-5
                    `}
        >
        {menuItems.map((item, index) => (
            item.children ? (
                <AccordionItem key={index} value={`item-${index}`} className="flex flex-col gap-[1%] border-white/20">
                    <AccordionTrigger className = {`text-start p-0 m-0 ${sideTitle}`}>{item.title}</AccordionTrigger>
                    <AccordionContent className="flex flex-col h-full text-gray-500  items-start text-lg hover:text-white gap-5">
                        {item.children.map((child, idx) => (
                        <Link
                            key={idx}
                            href={child.href}
                            className= {`${sideTitle} text-gray-400 hover:text-gray-300`}
                        >
                            {child.title}
                        </Link>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ) : (
                <Link
                key={index}
                href={item.href ?? "#"}
                className= {`${sideTitle}`}
                // onClick = {handleClick}
                >
                    {item.title}
                </Link>
            )
            ))}

        </Accordion>
    // </ScrollArea>
  );
}

export default SideBar