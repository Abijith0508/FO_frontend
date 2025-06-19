export default interface DataItem  {
  id: number;
  asset_type: string;
  strategy: string;
  entity: string;
  advisor: string;
  substrategy: string;
  isin: string;
  folio_no: string;
  name: string;

  quantity?: string;
  avg_cost?: string;
  market_price?: string;
  closing_cost?: string;
  closing_value?: string;
  unrealized_gain?: string;
  irr?: string;
  gain_cq?: string | null;
  irr_cq?: string | null;
  
  maingrpnm?: string;
  subgrpnm?: string; 
  thirdgrpnm? : string;
  
  cashflow? : Number[];
  dates? : any[];
  opening_cost? : string;
  opening_value? :string;
  realized_gain? : string;
  total_gain? : string;


  ttype? : string;
  tran_type? : string;
  tran_date?: string;
  currency?: string;
  other_expenses? : string;
  stamp_duty? : string; 
  stt_paid? : string;

  short_realized_gains? : string;
  long_realized_gains? : string;
  costbasis? : string;
  dividends? : string;
  
}
 