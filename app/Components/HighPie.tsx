

'use client';


import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { filterUpdate, groupBy } from './filterFunction';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { COLORS } from '../styling'

type Props = {
  data: any;
  filters : string[];
  setFilters : any;
  className : string;
  groupByField : any;
};

type PiePoint = {
  name: string;
  y: number;
  drilldown?: string;
};

const PieChart = ({ data, groupByField , filters, setFilters, className }: Props) => {
  
  const [chartData, setChartData] = useState<PiePoint[]>([]);
  
  useEffect(() => {
    const grouped = groupBy(data, groupByField);
    const transformed = grouped.map(item => ({
      name: String(item[groupByField]), // dynamic access
      y: Number(item.sumOfClosingValue),
    }));
    setChartData(transformed);
  }, [data]);

  useEffect(()=>{
    const grouping = groupBy(data, groupByField);
    const arr = grouping.map(item => ({
      name: String(item[groupByField]), // dynamic access
      y: Number(item.sumOfClosingValue),
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
      pointFormat:
        '{point.y} ({point.percentage:.1f}%)',
      backgroundColor: '#E0B073', // your gold color
      style: {
        color: '#ffffff86',
        fontWeight: 'extra-light',
        fontSize: '18px',
      },
      borderRadius: 8,
      borderWidth: 0,
      shadow: true,
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
            filterUpdate(setFilters, groupByField, this.name);
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
    <HighchartsReact 
    highcharts={Highcharts} 
    options={memoOptions} 
    allowChartUpdate={true}
    updateArgs={[true, true, true]} // [redraw, oneToOne, animate]
    immutable={false}
    className={className}
    />
  );
};

export default PieChart;
