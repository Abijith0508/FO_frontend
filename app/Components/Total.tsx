import React from 'react'
import { glass, grayText } from '../styling';
import Image from 'next/image';
import tickMark from '../img/tickMark.png'

type Props = { 
    total : number; 
    subTotal : number;
}

const Total = ({ total, subTotal }: Props) => {
  const formattedTotal = total.toLocaleString();
  const formattedSubTotal = subTotal.toLocaleString();
  const percentage : number = 99

  return (
    <div className={`col-start-2 col-end-13 md:col-end-10 row-start-2 row-span-2 ${glass} px-15`}>
      <div className="flex flex-col items-center justify-center ">
        <div className = {`${grayText}`}>Wallet</div>
        <div className = ''>
            <div className="text-[40px] font-bold">$ {formattedTotal}</div>
            <div className="relative text-[18px] text-emerald">$ {formattedSubTotal} ({percentage}%)</div>
        </div>
      <div className="w-full bg-emerald h-[28.5] rounded-lg my-6"></div>
      </div>
      {/* <Image src={tickMark} className=''/> */}
    </div>
  );
};


export default Total