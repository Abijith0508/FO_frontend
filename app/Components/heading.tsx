import React from 'react'
type Props = { 
    mainGp : string; 
    subGp : string;
    thirdGp : string;
}
const Heading = ({mainGp, subGp, thirdGp} : Props) => {
  return (
    <p className="px-[5px] flex items-center  col-start-2 col-end-13 row-start-1 row-end-2">
        <div className="flex items-baseline">
            {
                mainGp && <div className='text-[40px] '>{mainGp}</div> 
            }
            {
                subGp && <div className='text-[30px] pl-[10px]'>{subGp}</div> 
            }
            {
                thirdGp && <div className='text-[20px] pl-[10px]'>{thirdGp}</div>
            }
        </div>
    </p>
  )
}

export default Heading