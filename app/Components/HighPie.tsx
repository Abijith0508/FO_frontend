'use client';

const COLORS = [
  // === Base tones ===
  "#E0B073", // gold base
  "#A31545", // ruby base
  "#45A190", // emerald base

  // === Darker tones ===
  "#D29E5D", // gold dark
  "#8F123D", // ruby dark
  "#3D8D7F", // emerald dark

  // === Mid / Vivid tones ===
  "#C48D48", // strong gold
  "#C42B5F", // vivid ruby
  "#5CB9A4", // bright emerald

  // === Light / Pastel tones ===
  "#FAE2BF", // pastel gold
  "#F1A5B8", // pastel ruby
  "#A0E2D2", // pastel emerald
];

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { filterFunction, groupBy } from './filterFunction';
import { useEffect, useState } from 'react';



type Props = {
  data: any;
  filters : string[];
  className : string;
  groupByField : any;
};

const dummy = [
  { name: "Strategy A", value: 400 },
  { name: "Strategy B", value: 300 },
  { name: "Strategy C", value: 300 },
  { name: "Strategy D", value: 200 },
  { name: "Strategy A", value: 400 },
  { name: "Strategy B", value: 300 },
];

type PiePoint = {
  name: string;
  y: number;
  drilldown?: string;
};
type DrillType = {
  id: string; // should match the 'drilldown' key from the main series
  name: string; // name of the drilldown chart (appears in the tooltip/legend)
  type?: 'pie' | 'column' | 'bar' | string; // optional, override chart type
  data: Array<[string, number]> | Array<{ name: string; y: number }>;
};

const PieChart = ({ data, groupByField , className }: Props) => {
  // Transform data to Highcharts format [{ name: string, y: number }, ...]
  
  const [chartData, setChartData] = useState<PiePoint[]>([]);
  const [drillData, setDrillData] = useState<DrillType[]>([]);

  //first Time setting of stratGrouping
  useEffect(()=>{
    const grouping = groupBy(data, groupByField);
    // alert(groupByField)
    console.log(grouping)
    
    const arr = grouping.map(item => ({
      name: String(item[groupByField]), // dynamic access
      y: Number(item.sumOfClosingCosts),
      // drilldown: ...
    }));
    setChartData(arr);
  }, [])
  
  //   useEffect(()=>{
  //   const arr = chartData.map
  // }, [filters]);


  // const drillData = filterFunction(data, filters)
  // console.log(drillData)

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
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
            // You can access name/y here
            alert(`Clicked slice:, ${this.name}, ${this.y}`);
            // Your custom logic
          },
        },
      },
  },
},
    series: [
      {
        type: 'pie',
        data: chartData,
        colors: COLORS,
      },
    ],
    legend: {
      itemStyle: {
        color: '#555',
        fontWeight: 'bold',
      },
      itemHoverStyle: {
        color: '#000',
      },
    },
    credits: {
      enabled: false,
    },
    // drilldown: {
    //   series: drillData,
    // },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} className={className}/>
  );
};

export default PieChart;
