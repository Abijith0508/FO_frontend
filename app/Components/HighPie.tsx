'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type DataItem = {
  name: string;
  value: number;
};

type Props = {
  data: DataItem[];
  className : string;
};

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

const PieChart = ({ data, className }: Props) => {
  // Transform data to Highcharts format [{ name: string, y: number }, ...]
  const chartData = data.map(({ name, value }) => ({ name, y: value }));

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
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} className={className}/>
  );
};

export default PieChart;
