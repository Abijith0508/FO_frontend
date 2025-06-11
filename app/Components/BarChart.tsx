'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { filterUpdate, groupBy } from './filterFunction';
import { grayText2, COLORS } from '../styling';

type Props = {
  data: any;
  filters: string[];
  setFilters: any;
  className?: string;
  groupByField: any;
};

type BarPoint = {
  name: string;
  y: number;
};

const formatIndianNumber = (value : number) => {
  if (value >= 1e7) return `${(value / 1e7).toFixed(0)} Cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(0)} L`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)} K`;
  return value.toLocaleString('en-IN');
};

const BChart = ({ data, groupByField, filters, setFilters, className }: Props) => {
  const [chartData, setChartData] = useState<BarPoint[]>([]);

  useEffect(() => {
    const grouped = groupBy(data, groupByField);
    const transformed = grouped.map(item => ({
      name: String(item[groupByField]),
      y: Number(item.sumOfClosingValue),
    }));
    setChartData(transformed);
  }, [data, groupByField]);

  const options: any = useMemo(() => ({
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: 300,
      animation: {
        duration: 1000, // Customize the total duration of the animation
        easing: 'easeOutBounce', // Bounce effect for the bars
      },
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: chartData.map(point => point.name),
      title: {
        text: null,
      },
      labels: {
        enabled: true,
        
        style: {
          color: '#ffffff50',
          fontWeight: 'light',
          fontSize: '15px',
        },
      },
      gridLineColor: '#555',
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        align: 'high',
      },
      labels: {
        formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
          return formatIndianNumber(Number(this.value));
        },
        overflow: 'justify',
        style: {
          color: '#555',
          fontWeight: 'bold',
        },
      },
      gridLineColor: '#555',
    },
    tooltip: {
      pointFormat: '{point.y}',
      backgroundColor: '#E0B073',
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
      bar: {
        cursor: 'pointer',
        borderWidth: 0,
        color: COLORS,
        dataLabels: {
          enabled: false,
        },
        animation: {
          duration: 1000, // Custom animation for bars
          easing: 'easeOutBounce',
        },
        point: {
          events: {
            click: function (this: Highcharts.Point) {
              filterUpdate(setFilters, groupByField, this.name);
            },
          },
        },
      },
    },
    series: [{
      type: 'bar',
      data: chartData.map((point, index) => ({
        ...point,
        color: COLORS[index % COLORS.length], // Assign each bar a color
      })),
    }],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  }), [chartData, groupByField, setFilters]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      allowChartUpdate={true}
      updateArgs={[true, true, true]}
      immutable={false}
      className={className}
    />
  );
};

export default BChart;


type LegendItem ={
  name: string;
  color: string;
}


type LegendProps = {
  data: any;
  className?: string;
  groupByField: any;
};

const Legend = ({ data, groupByField, className }: LegendProps) => {
  const [legend, setLegend] = useState<LegendItem[]>([])
  useEffect(() => {
    const grouped = groupBy(data, groupByField);
    const legendArray = grouped.map((item, idx) => ({
      name: String(item[groupByField]),
      color: COLORS[idx % COLORS.length],
    }));
    setLegend(legendArray);
    // console.log(legend)
  }, [data, groupByField]);

  
  return (
      <div className = {`flex flex-col h-full items-right text-left lg:block ${className}`}>
        {legend.map((item, idx) => (
          <div className="flex h-full items-center gap-2" key={idx}>
            <div className={`h-[10] w-[10]`}
            style={{ backgroundColor: item.color }}/>
            <div className = {`${grayText2}`}>{item.name}</div>
          </div>
        ))}
      </div>
  )
}
export {Legend, BChart};

