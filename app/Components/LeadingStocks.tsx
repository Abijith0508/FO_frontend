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
    <div className={`${className} w-full max-w-2xl mx-auto mb-8`}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 animate-fade-in">
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
              align: 'left',
              style: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
              },
            },
            plotOptions: {
              funnel: {
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b><br/>{point.y:.2f}%',
                  style: {
                    fontWeight: 'bold',
                    color: '#374151',
                  },
                },
                center: ['50%', '50%'],
              },
            },
            series: [{
              name: 'Asset',
              type: 'funnel',
              data: funnelData,
              colors: [
                '#10b981',
                '#3b82f6',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
              ],
            }],
            credits: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

export default Top5FunnelChart;