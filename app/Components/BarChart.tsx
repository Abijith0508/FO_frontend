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
  className: string;
};

const BChart = ({ data, className }: Props) => {
  // Extract categories and values for the bar chart
  const categories = data.map(item => item.name);
  const values = data.map(item => item.value);

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: 300,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories,
      title: {
        text: null,
      },
      labels: {
        enabled : false,
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
      backgroundColor: '#E0B073', // gold color
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
        dataLabels: {
          enabled: false,
        //   color: '#555',

        //   style: {
        //     fontWeight: 'normal',
            
        //   },
        },
        point: {
          events: {
            click: function () {
              alert(`Clicked bar: ${this.category}, ${this.y}`);
              // Your custom logic here
            },
          },
        },
      },
    },
    series: [
      {
        type: 'bar',
        data: values,
        color: '#E0B073', // gold color for all bars
      },
    ],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} className={className} />
  );
};

export default BChart;
