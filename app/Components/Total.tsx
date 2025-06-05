import React from 'react'
import { glass, grayText } from '../styling';
import Image from 'next/image';
import tickMark from '../img/tickMark.png'

type Props = { 
    total : number; 
    subTotal : number;
    className : string;
}

const Total = ({ total, subTotal, className }: Props) => {
  const formattedTotal = total.toLocaleString('en-IN');
  const formattedSubTotal = subTotal.toLocaleString('en-IN');
  // const formattedTotal = total ; 
  // const formattedSubTotal = total;
  const percentage : number = 99

  return (
    <div className={className}>
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