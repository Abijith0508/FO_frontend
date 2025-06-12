'use client';
import React, { useEffect, useState, useCallback } from "react";
import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";

import Exporting from 'highcharts/modules/exporting'

import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import "highcharts/modules/drilldown";
import "highcharts/modules/exporting";
import "highcharts/modules/funnel";
import { COLORS, glass, grayText2 } from "../styling";



type Props = {
  className?: string;
  data: any;
  region?: string | null;
};

type StockData =  {
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
  
  maingrpnm: string;
  subgrpnm : string; 
  thirdgrpnm : string;
};

function getTopStocksByGainPercent(data: StockData[], count = 5, region:string) {
  // console.log(data)
  const stock : string = region + " Direct Equity"
  const result = data
    .filter(item => item.substrategy === stock)
    .map(item => {
      const gain = parseFloat(item.unrealized_gain || '0');
      const cost = parseFloat(item.closing_cost || '1');
      const gainPercent = (gain / cost) * 100;
      return { ...item, gainPercent };
    })
    .sort((a, b) => b.gainPercent - a.gainPercent)
    .slice(0, count);

  console.log(result);

  return data
    .filter(item => item.substrategy === stock)
    .map(item => {
      const gain = parseFloat(item.unrealized_gain || '0');
      const cost = parseFloat(item.closing_cost || '1');
      const gainPercent = (gain / cost) * 100;
      return { ...item, gainPercent };
    })
    .sort((a, b) => b.gainPercent - a.gainPercent)
    .slice(0, count);
}

const Top5FunnelChart = ({ data, className, region }: Props) => {
  const [funnelData, setFunnelData] = useState<any[]>([]);
  
  
  useEffect(() => {
    const top5Stocks = getTopStocksByGainPercent(data, 5, String(region));
    const transformed = top5Stocks.map(item => ({
      name: item.name?.slice(0, -5) || item.name,
      y: parseFloat(((parseFloat(item.unrealized_gain) / parseFloat(item.closing_cost)) * 100).toFixed(2))
    }));
    setFunnelData(transformed);
  }, [data]);

  // if (!funnelLoaded || funnelData.length === 0) return null;

  return (
    <div className={`${className} w-full ${glass}`}>
      
      <div className={`${grayText2}`}>{`Leading ${region} Stocks`}</div>
      <div className="bg-transparent rounded-2xl p-6 animate-fade-in">
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: {
              type: 'funnel',
              height: 400,
              backgroundColor: 'transparent',
            },
            title: {
              text: null,
              align: 'center',
              style: {
                fontSize: '20px',
                fontWeight: 'light',
                color: '#ffffff86',
              },
            },
            tooltip: {
              pointFormat: '{point.y}',
              backgroundColor: '#171717',
              style: {
                color: '#ffffff86',
                fontWeight: 'extra-light',
                fontSize: '18px',
              },
              borderRadius: 8,
              borderWidth: 0,
              shadow: true,
            },
            exporting: {
              enabled: false // hide default export button
            },
            plotOptions: {
              funnel: {
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%',
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  format: '{point.name}<br/>{point.y:.2f}%',
                  style: {
                    fontWeight: '2px',
                    color: '#ffffff86',
                    textOutline: 'none'  
                  },
                  

                },
                center: ['50%', '50%'],
              },
            },
            series: [{
              name: 'Asset',
              type: 'funnel',
              data: funnelData,
              colors: COLORS,
            }],
            credits: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

export default Top5FunnelChart;