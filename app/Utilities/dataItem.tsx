export default interface DataItem  {
  id: number;
  entity: string;
  advisor: string;
  substrategy: string;
  isin: string;
  folio_no: string;
  name: string;
  quantity: string;
  avg_cost: string;
  market_price: string;
  closing_cost: string;
  closing_value: string;
  unrealized_gain: string;
  irr: string;
  gain_cq: string | null;
  irr_cq: string | null;
  asset_type: string;
  strategy: string;
  
  maingrpnm?: string;
  subgrpnm?: string; 
  thirdgrpnm? : string;
  
  cashflow? : any[];
  dates? : any[];
  opening_cost? : string;
  // closing_cost? : string;
  opening_value? :string;
  realized_gain? : string;
  total_gain? : string;

}
 