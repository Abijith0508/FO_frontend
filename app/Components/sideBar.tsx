'use client'; 

import { sideglass } from "../styling";

type Props = { 
    // mainGp : string; 
    // subGp : string;
    // thirdGp : string;
    className : string
}

function SideBar({className} : Props)
{
    return (
        <div className={`hidden md:block w-[50px] lg:w-[75px] h-[400px] fixed left-0 top-1/2 transform -translate-y-1/2 ${sideglass}`}>
            
        </div>
    );
}
export default SideBar