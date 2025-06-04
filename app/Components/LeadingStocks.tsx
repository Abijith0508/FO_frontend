import React from 'react'
import { glass } from '../styling'

type Props = { 
    top10 : string[]
}
const LeadingStocks = ({top10} : Props) => {
    return (
    <div className={`hidden md:block col-start-10 col-end-13 row-start-2 row-end-7 ${glass} `}>
        Leading Stocks
    </div>
    );
}

export default LeadingStocks