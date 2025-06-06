'use client'; 
import Link from "next/link";
import { sideglass } from "../styling";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Home } from "lucide-react";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { glass } from "../styling";

type Props = { 
    // mainGp : string; 
    // subGp : string;
    // thirdGp : string;
    className : string
}

type MenuItem = {
  title: string
  href?: string
  children?: { title: string; href: string }[]
  icon : any
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', href: '/', icon: Home},
  {
    title: 'Transactions',
    children: [
      { title: 'Mutual Funds', href: '/transactions/mutual-funds' },
      { title: 'Stocks', href: '/transactions/stocks' },
      { title: 'PMS', href: '/transactions/pms' },
      { title: 'AIF', href: '/transactions/aif' },
      { title: 'Other', href: '/transactions/other' },
    ], icon: Home
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
    ], icon: Home
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
    ],icon: Home
  },
  { title: 'Account', href: '/account', icon: Home},
]

type props = {
    className : string
}

function SideBar(){   
  return (
    // <ScrollArea className='h-full w-full p-5'>
        <Accordion type="single" collapsible 
            className={`fixed left-0 h-full w-[calc((100%/11.3*2))]  ${sideglass} shadow-md 
                    transition-transform duration-300 ease-in-out z-10
                    py-5 px-auto 
                    justify-around top-1/2 transform-all -translate-y-1/2 
                    flex flex-col`}
        >
        {menuItems.map((item, index) => (
            item.children ? (
                <AccordionItem key={index} value={`item-${index}`} className="flex flex-col  border-none pl-4 pr-5">
                    <AccordionTrigger className = "text-lg p-0 m-0 hover:no-underline no-underline text-gray-100 hover:text-white transition-colors">{item.title}</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-gray-500 justify-around items-start gap-2 text-lg hover:text-white">
                        {item.children.map((child, idx) => (
                        <Link
                            key={idx}
                            href={child.href}
                            className=" hover:no-underline no-underline text-gray-100 text-lg hover:text-white text-gray-300"
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
                className="pl-4 text-lg underline-none text-gray-300 hover:text-white transition-colors text-start border-none"
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