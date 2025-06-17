'use client'; 
import Link from "next/link";
import { sideglass, sideTitle } from "../styling";
// import { Menu } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";
import { useRef, useEffect } from "react";

import { Menu, X } from "lucide-react";

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

type Props = {
  isOpen : boolean,
  setIsOpen : any
}

function SideBar({isOpen, setIsOpen} : Props){   
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const Icon = isOpen ? X : Menu;

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

  return (
    <>
      <Icon 
          className = "fixed top-12 right-12 h-8 w-8 z-50 stroke-white/50 hover:stroke-white/80 transition-colors duration-200 border border-none focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          data-tooltip-id="BCTooltip"
          data-tooltip-content={isOpen ? "Close Menu" : "Open Menu"}
          data-tooltip-place="top"
          data-tooltip-float
        />
      <Accordion type="single" collapsible 
          className={` scroll-auto h-screen fixed top-0 
                  w-[20%]
                  min-w-[calc((100%/11.3*2))]
                  ${sideglass} shadow-md 
                  z-40
                  py-5 pt-15
                  justify-around 
                  flex flex-col
                  pl-[10%]
                  lg:pl-[3%] pr-5
                  transition-transform
                  `}

          style = {{
            transition: 'transform 0.3s ease-in-out',
            transform: isOpen ? 'translateX(0)' : 'translateX(-200%)',
          }
          }
      >
      {menuItems.map((item, index) => (
          item.children ? (
              <AccordionItem key={index} value={`item-${index}`} className="flex flex-col gap-[1%] border-white/20">
                  <AccordionTrigger className = {`text-start p-0 m-0 ${sideTitle}`}>{item.title}</AccordionTrigger>
                  <AccordionContent className="flex flex-col h-full text-gray-500  items-start text-lg hover:text-white gap-5 duration-200">
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
      {isOpen && <div className={`w-full h-[960px] backdrop:blur-2xl fixed top-0 z-30 bg-gradient-to-r from-black/50 to-black/50 via-black/20 backdrop-blur-lg transition duration-500`}/>}
    </>
    
  );
}

export default SideBar