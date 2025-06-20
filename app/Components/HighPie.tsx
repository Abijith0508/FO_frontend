'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { filterUpdate, groupBy } from '../Utilities/filterFunction';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { COLORS } from '../styling'

type Props = {
  data: any;
  filters : string[];
  setFilters : any;
  className : string;
  groupByField : any;
  setIsISINTableVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isISINTableVisible: boolean;
};

type PiePoint = {
  name: string;
  y: number;
  xirr?: number;
  drilldown?: string;
};

const PieChart = ({ data, groupByField , filters, setFilters, className, setIsISINTableVisible, isISINTableVisible }: Props) => {
  
  const [chartData, setChartData] = useState<PiePoint[]>([]);
  
  useEffect(() => {
    const grouped = groupBy(data, groupByField);
    const transformed = grouped.map(item => ({
      name: String(item[groupByField]), // dynamic access
      y: Number(item.sumOfClosingValue),
      xirr: Number(item.xirr || 0),
    }));
    setChartData(transformed);
  }, [data]);

  useEffect(()=>{
    const grouping = groupBy(data, groupByField);
    const arr = grouping.map(item => ({
      name: String(item[groupByField]), // dynamic access
      y: Number(item.sumOfClosingValue),
      xirr: Number(item.xirr || 0),
      // drilldown: ...
    }));
    setChartData(arr);
  }, [])
  
  // const drillData = filterFunction(data, filters)
  // console.log(drillData)

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      animation: {
        duration: 500,
        easing: 'easeOutBounce', // Optional easing function
      },
      backgroundColor: 'transparent',
      height: 300,
    },
    title: {
      text: undefined,
    },
    tooltip: {
      formatter: function(this: any) {
        const point = this.point;
        const value = point.y.toLocaleString('en-IN');
        const percentage = point.percentage.toFixed(1);
        const xirr = point.xirr || 0;
        return `<b>${point.name}</b><br/>
                Value: ₹${value} (${percentage}%)<br/>
                XIRR: ${xirr.toFixed(2)}%`;
      },
      backgroundColor: '#171717', // your gold color
      style: {
        color: '#ffffffcc',
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
      pie: {
      cursor: 'pointer',
      borderWidth: 0,
      innerSize: '50%',
      dataLabels: {
        enabled: false,
      },
      point: {
        events: {
          click: function () {
            filterUpdate(setFilters, groupByField, this.name, setIsISINTableVisible, isISINTableVisible);
            // console.log(filters)
          },
        },
      },
  },
},
    series: [
      {
        type: 'pie',
        data: chartData.map((point, index) => ({
          ...point,
          color: COLORS[index % COLORS.length], 
          
        })),
        animation: {
          duration: 1000,
          easing: 'easeOutCubic',
        },
      },
    ],
    // legend: {
    //   itemStyle: {
    //     color: '#555',
    //     fontWeight: 'bold',
    //   },
    //   itemHoverStyle: {
    //     color: '#000',
    //   },
    // },
    // legend: {
    //   layout: 'horizontal',       // place items side by side
    //   align: 'center',           // center horizontally
    //   verticalAlign: 'bottom',   // position at bottom
    //   width: undefined,          // allow full container width
    //   itemDistance: 30,          // spacing between items
    //   itemStyle: {
    //     whiteSpace: 'nowrap'     // prevent wrapping
    //   },
    // },
    credits: {
      enabled: false,
    },
    // drilldown: {
    //   series: drillData,
    // },
  };

  const memoOptions = useMemo(() => options, [chartData])

  return (
    <div className="w-[300] h-[300]">
        <HighchartsReact 
      highcharts={Highcharts} 
      options={memoOptions} 
      allowChartUpdate={true}
      updateArgs={[true, true, true]} // [redraw, oneToOne, animate]
      immutable={false}
      className={className}
      />
    </div>
    
  );
};

export default PieChart;
