'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";

import "./globals.css"
import { glass, sideglass } from "./styling";
import SideBar from "./Components/SideBar";
import Heading from "./Components/Heading";
import Total from "./Components/Total";
import LeadingStocks from "./Components/LeadingStocks";
import Strategies from "./Components/Strategies";
import Advisorwise from "./Components/Advisorwise";
import Entitywise from "./Components/Entitywise";

export default function Home() {
  const [mainGp, setmainGp] = useState('Home', );
  const [subGp, setSubGp] = useState('Entity');
  const [thirdGp, setThirdGp] = useState('Strategy');
  const [fourthGp, setFourthGp] = useState('SubStrat');
  // useEffect(() => {
  //   setmainGp('')
  //   setSubGp('')
  //   setThirdGp('')
  // });
  type Stock = {
    ticker: string;
    name: string;
    sharesOutstanding: number;
  };

  const [total, setTotal] = useState(16412441)
  const [subTotal, setSubTotal] = useState(2342342)
  const [top10, setTop10] = useState<Stock[]>([]);


  const x: Stock[] = [
    { ticker: "AQT", name: "AquaTech Corp", sharesOutstanding: 4_500_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 },
    { ticker: "BLQ", name: "BlueQuantum Ltd", sharesOutstanding: 2_100_000_000 },
    { ticker: "NSC", name: "Novascan Inc", sharesOutstanding: 1_750_000_000 },
    { ticker: "KPT", name: "Krypton Partners", sharesOutstanding: 1_400_000_000 },
    { ticker: "HLC", name: "Helicon Labs", sharesOutstanding: 1_000_000_000 },
    { ticker: "VRD", name: "Veridex Holdings", sharesOutstanding: 800_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 },
    { ticker: "BLQ", name: "BlueQuantum Ltd", sharesOutstanding: 2_100_000_000 },
    { ticker: "NSC", name: "Novascan Inc", sharesOutstanding: 1_750_000_000 },
    { ticker: "KPT", name: "Krypton Partners", sharesOutstanding: 1_400_000_000 },
    { ticker: "HLC", name: "Helicon Labs", sharesOutstanding: 1_000_000_000 },
    { ticker: "VRD", name: "Veridex Holdings", sharesOutstanding: 800_000_000 },
    { ticker: "ZNT", name: "Zenith Technologies", sharesOutstanding: 3_800_000_000 },
    { ticker: "FRX", name: "FerroX Industries", sharesOutstanding: 3_200_000_000 },
    { ticker: "MNV", name: "Minerva Health", sharesOutstanding: 2_900_000_000 },
    { ticker: "TRX", name: "Tronex Energy", sharesOutstanding: 2_500_000_000 }
  ];

  useEffect(() => {
    setTop10(x);
  }, []);
  return (
    <div className="text-white text-center bg-transparent p-0 m-0 ">
      <SideBar/>
      <div
        className="w-full h-[1500px] px-[30px] bg-transparent text-white grid grid-rows-12
       grid-cols-12 gap-[15px]"
      >
        <Heading mainGp = {mainGp} subGp={subGp} thirdGp={thirdGp}/>

        <Total total={total} subTotal={subTotal} className={`col-start-1 md:col-start-2 col-end-13 md:col-end-10 row-start-2 row-span-2 ${glass} px-15`}/>
        <LeadingStocks top10={top10} className={`hidden md:block col-start-10 col-end-13 row-start-2 row-end-7 ${glass} overflow-hidden`}/>
        <Strategies className={`flex flex-col col-start-1 md:col-start-2 col-end-13 md:col-end-10  row-start-4 row-end-7 ${glass}`}/>
        <Advisorwise className={`flex flex-col col-start-1 md:col-start-2 col-end-13 sm: row-start-7 row-end-10 ${glass}`}/>
        <Entitywise className={`flex flex-col col-start-1 md:col-start-2 col-end-13 row-start-10 row-end-13 ${glass}`}/>
      </div>
      <div className='w-full h-[400] bg-primary mt-[15px]'></div>
    </div>
  );
}

