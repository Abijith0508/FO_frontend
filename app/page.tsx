'use client'; 
import Image from "next/image";
import { useState , useEffect } from "react";

import "./globals.css"
import { glass } from "./styling";

import SideBar from "./Components/SideBar";
import Heading from "./Components/Heading";
import Total from "./Components/Total";
import LeadingStocks from "./Components/LeadingStocks";

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
  const [total, setTotal] = useState(16412441)
  const [subTotal, setSubTotal] = useState(2342342)
  const [top10, setTop10] = useState([])

  return (
    <div className="text-white text-center bg-white w-full p-0 m-0 bg-[url('./img/mountains.jpg')] ">
      <SideBar/>
      <div
        className="w-full min-h-[1400px] px-[30px] bg-transparent text-white grid grid-rows-12
       grid-cols-12 gap-[15px]"
      >
        <Heading mainGp = {mainGp} subGp={subGp} thirdGp={thirdGp}/>

        <Total total={total} subTotal={subTotal}/>
        <LeadingStocks top10={top10}/>
        <div className={`col-start-2  col-end-13 md:col-end-10  row-start-4 row-end-7 ${glass}`}>
          Strategies
        </div>
        <div className={`col-start-2 col-end-13 row-start-7 row-end-10 ${glass}`}>
          Advisor-Wise
        </div>
        <div className={`col-start-2 col-end-13 row-start-10 row-end-13 ${glass}`}>
          Entity-Wise
        </div>
      </div>
      <div className='w-full h-[400] bg-primary mt-[15px]'></div>
    </div>
  );
}

