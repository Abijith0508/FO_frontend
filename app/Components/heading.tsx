import React from 'react'

type Props = { 
    mainGp : string; 
    subGp : string;
    thirdGp : string;
}
const Heading = ({mainGp, subGp, thirdGp} : Props) => {
  return (
    <div className="px-[5px] flex items-center  col-start-2 col-end-13 row-start-1 row-end-2">
        <div className="flex items-baseline text-gray gap-2">
            {/* BreadCrumbs */}
        </div>
    </div>
  )
}

export default Heading