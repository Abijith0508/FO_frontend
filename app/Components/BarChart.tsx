'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { filterUpdate, groupBy } from '../Utilities/filterFunction';
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
  xirr?: number;
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
      xirr: Number(item.xirr || 0),
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
          color: '#ffffff99', // white/90
          fontWeight: '300',
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
          color: '#ffffff55',
          fontWeight: 'bold',
        },
      },
      gridLineColor: '#555',
    },
    tooltip: {
      enabled : true,
      formatter: function(this: any) {
        const point = this.point;
        const value = formatIndianNumber(point.y);
        const xirr = point.xirr || 0;
        return `<b>${point.name}</b><br/>
                Value: ₹${value}<br/>
                XIRR: ${xirr.toFixed(2)}%`;
      },
      backgroundColor: '#171717',
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
        bar: {
          cursor: 'pointer',
          pointPadding: 0.1,  // smaller means thicker bars
          groupPadding: 0.0, 
          borderWidth: 0,
          color: COLORS,
          dataLabels: {
            enabled: true,
            formatter: function (this: Highcharts.Point) {
              // Format the label as an Indian number string (using the provided locale)
              return Number(this.y).toLocaleString('en-IN');
            },
            style: {
              color: '#ffffff88',
              fontWeight: '300',
              fontSize: '15px',
              textOutline: 'none', // removes the default white outline around dataLabels for cleaner look
            },
            verticalAlign : 'center'
          },
          animation: {
            duration: 1000,
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
      className={`w-full h-full ${className}`}
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
