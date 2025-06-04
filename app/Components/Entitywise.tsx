import { glass, grayText2 } from "../styling";
type Props = { 
    
}
const Entitywise = ({} : Props) => {
  return (
    <div className={`col-start-2 col-end-13 row-start-10 row-end-13 ${glass}`}>
      <div className={`${grayText2}`}>Entity-Wise</div>
    </div>
  )
}

export default Entitywise