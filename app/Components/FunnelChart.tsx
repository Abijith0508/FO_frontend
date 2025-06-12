import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Funnel from 'highcharts/modules/funnel';
Funnel(Highcharts); // Initialize the funnel module

const Top5FunnelChart = ({ data }: { data: StockData[] }) => {
  const top5Stocks = getTopStocksByGainPercent(data, 5);
  const funnelData = top5Stocks.map(item => ({
    name: item.name.slice(0, -5), // optional trimming
    y: parseFloat(((parseFloat(item.unrealized_gain) / parseFloat(item.closing_cost)) * 100).toFixed(2))
  }));

  const options: Highcharts.Options = {
    chart: {
      type: 'funnel'
    },
    title: {
      text: 'Top 5 Performing Stocks (by Unrealized Gain %)'
    },
    tooltip: {
      pointFormat: '<b>{point.y:.2f}%</b> Gain'
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b> ({point.y:.2f}%)',
          softConnector: true
        },
        center: ['50%', '50%'],
        neckWidth: '30%',
        neckHeight: '25%',
        width: '80%'
      }
    },
    series: [
      {
        name: 'Gain %',
        type: 'funnel',
        data: funnelData
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Top5FunnelChart;