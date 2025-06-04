import { glass } from "../styling";
type Props = { 
    mainGp : string; 
    subGp : string;
    thirdGp : string;
}

function SideBar()
{
    return (
        <div className={`w-[50px] h-[400px] fixed left-0 top-1/2 transform -translate-y-1/2 ${glass}`}>
            
        </div>
    );
}
export default SideBar