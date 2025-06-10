'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { filterUpdate, groupBy } from './filterFunction';

const COLORS = [
  "#E0B073", "#A31545", "#45A190",
  "#D29E5D", "#8F123D", "#3D8D7F",
  "#C48D48", "#C42B5F", "#5CB9A4",
  "#FAE2BF", "#F1A5B8", "#A0E2D2",
];

type Props = {
  data: any;
  filters: string[];
  setFilters: any;
  className: string;
  groupByField: any;
};

type BarPoint = {
  name: string;
  y: number;
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
        duration: 500,
        easing: 'easeOutBounce',
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
        enabled: false,
        style: {
          color: '#555',
          fontWeight: 'bold',
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
        color: '#E0B073',
        dataLabels: {
          enabled: false,
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
      data: chartData,
      colors: '#E0B073',
      
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
      updateArgs={[true, true, true]} // redraw, oneToOne, animate
      immutable={false}
      className={className}
    />
  );
};

export default BChart;

