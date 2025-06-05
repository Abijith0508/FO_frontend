'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Highcharts, { color, Series, theme } from 'highcharts';
import ExportingModule from 'highcharts/modules/exporting'; // Import the exporting module directly
import DrilldownModule from 'highcharts/modules/drilldown'; // Import the drilldown module directly
import { breadcrumbs } from '@nextui-org/react';
import { filledInputClasses } from '@mui/material';
import { Bar, YAxis } from 'recharts';
import { XAxisScrollbarOptions } from 'highcharts';
import 'highcharts/modules/stock';
import { Bold } from 'react-feather';
import Highcharts3D from 'highcharts/highcharts-3d'
import SFTable from './stockfundtable';


const darkColors = [
    '#7cb5ec', // light blue
    '#90ed7d', // light green
    '#f7a35c', // light orange
    '#8085e9', // purple
    '#f15c80', // pink
    '#e4d354', // light yellow
    '#2b908f', // dark green
    '#f45b5b', // dark red
    '#91e8e1', // light teal
    '#434348', // dark gray
];



if (typeof Highcharts === 'object') {
    ExportingModule(Highcharts);
    DrilldownModule(Highcharts); 
    
}

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });
Highcharts3D(Highcharts);

interface DrillType {
    id: string;
    data: number[];
}

const BarChart = ({ chartData }) => {
    const [isClient, setIsClient] = useState(false);
    const [options, setOptions] = useState(null);
    const [fsaoptions,setFSAOptions]=useState(null);
    const [fsoptions,setFSOptions]=useState(null)
    const [totalFundStock, setTotalFundStock] = useState(0);
    const [data,setData]=useState(chartData)
    const [totalFund,setTotalFund]=useState(0)
    const [totalStock,setTotalStock]=useState(0)    

    
    const aggregateData = (data, key, valueField) => {
        const result = data.reduce((accumulator, current) => {
            const keyValue = current[key];
            if (!accumulator[keyValue]) {
                accumulator[keyValue] = { name: keyValue, data: 0 };
            }
            accumulator[keyValue].data += parseFloat(current[valueField]);
            return accumulator;
        }, {});

        return Object.values(result);
    };

    const aggregateStock=(data,key,valueField)=>
        {
            const result = data.reduce((acc,cur)=>{
                const keyValue=cur[key];
                if(!acc[keyValue])
                    {
                        acc[keyValue]={name:keyValue,data1:0,data2:0,data3:0}
                    }
                if(cur.ttype=='mf')
                    {
                        acc[keyValue].data1+= parseFloat(cur[valueField]);
                    }
                else if(cur.ttype=='inst')
                    {
                        acc[keyValue].data2+= parseFloat(cur[valueField]);
                    }
                acc[keyValue].data3+=parseFloat(cur[valueField]);
                return acc;
            },{});
            return Object.values(result);
        }
        

    const generateDrilldownSeries = (data, keyField, valueFields) => {
        return data.map(element => ({
            id: element[keyField],
            data: aggregateData(data.filter((x) => x[keyField] === element[keyField]), ...valueFields).map(item => ([item.name, item.data]))
        }));
    };
    const generateFSDrilldownSeries = (data, utype,keyField, valueFields) => {
        return data.map(element => ({
            name:utype+'-'+element[keyField],
            id: utype+'_'+element[keyField],
            data: aggregateData(data.filter((x) => x[keyField] === element[keyField]), ...valueFields).map(item => ([item.name, item.data]))
        }));
    };

    
    
    //console.log(generateFSDrilldownSeries(data.filter(item => item.utype === 'Fund'), 'entityname', ['fund', 'fundstock']))
    
    //const drilldownSeries = generateDrilldownSeries(chartData, 'entityname', ['fund', 'fundstock']);
    
    useEffect(() => {
        setIsClient(true);
        console.log(generateDrilldownSeries(data,'entityname',['securityname','amount']))
        const total = chartData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const totalfund = chartData.filter(item=>item.utype==='mf').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const totalstock = chartData.filter(item=>item.utype==='inst').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        setTotalFundStock(total);
        setTotalFund(totalfund)
        setTotalStock(totalstock)
        
        setOptions({
            chart: {
                type: 'bar',
                height: 470,
                width: 700,
                marginLeft: 150,
                marginRight: 100,
                marginTop: 20,
                marginBottom: 30,
                borderWidth: 1, // Add a border
                borderColor: '#ccc', // Border color
                borderRadius: 5, // Rounded corners
                backgroundColor: '#f9f9f9', // Light gray background color
                style: {
                    fontFamily: 'Arial, sans-serif',
                    color: '#333', // Default font color
                },
            },
            title: {
                text: 'Entity Wise Fund Holding',
                style: {
                    color: '#333', // Dark title text color
                },
            },
            xAxis: {
                type: 'category',
                labels: {
                    enabled: true,
                    style: {
                        color: 'black',
                        textDecoration: 'none',
                        fontSize: '10px',
                    },
                    inside: true,
                },
            },
            yAxis: {
                title: {
                    text: 'Fund Stock',
                    style: {
                        color: 'black',
                    },
                },
                labels: {
                    style: {
                        color: 'black',
                        textDecoration: 'none',
                    },
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    pointPadding: 0.1,
                    groupPadding: 0.2,
                    dataLabels: {
                        enabled: true,
                        inside: true,
                        style: {
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '8px',
                        },
                    },
                },
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px color:#ccc text-decoration:none">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                style: {
                    color: '#fff',
                },
            },
            series: [{
                name: 'Entity Wise Fund Holding',
                colorByPoint: true,
                data: aggregateData(data.filter((item) => item.utype === 'Fund'), 'entityname', 'fundstock').map(item => ({
                    name: item.name,
                    y: item.data,
                    drilldown: item.name,
                })),
            }],
            drilldown: {
                series: generateDrilldownSeries(data.filter((item) => item.utype === 'Fund'), 'entityname', ['fund', 'fundstock']),
                activeAxisLabelStyle: {
                    color: 'black',
                    textDecoration: 'none',
                },
                activeDataLabelStyle: {
                    color: '#fff',
                    textDecoration: 'none',
                },
                breadcrumbs: {
                    buttonTheme: {
                        style: {
                            color: 'black',
                        },
                    },
                },
            },
        });
        
        setFSAOptions({
            chart: {
                type: 'pie',
                width: 800,
                height: 500,
                marginLeft: 100,
                marginTop: 20,
                marginRight: 20,
                marginBottom: 30,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: '#f9f9f9',
                style: {
                    fontFamily: 'Arial, sans-serif',
                    color: '#333',
                },
            },
            title: {
                text: 'Advisor Wise Holding',
                style: {
                    color: '#333',
                    fontSize: '18px',
                    fontWeight: 'bold',
                },
            },
            legend: {
                enabled: true,
                itemStyle: {
                    color: '#333',
                },
            
           
            },
            dataLabel:{
                enabled:true
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px color:#ccc text-decoration:none">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                style: {
                    color: '#fff',
                },
            },
            series: [{
                name: 'Advisor Holdings',
                colorByPoint: true,
                data: [{
                    name: 'Fund',
                    y: aggregateData(data.filter(item=>item.utype==='Fund'), 'advisor', 'fundstock').reduce((acc, curr) => acc + curr.data, 0),
                    drilldown: 'fund',
                }, {
                    name: 'Stock',
                    y: aggregateData(data.filter(item=>item.utype==="Stock"), 'advisor', 'fundstock').reduce((acc, curr) => acc + curr.data, 0),
                    drilldown: 'stock',
                }],
            }],
            drilldown: {
                series: [{
                    id: 'fund',
                    name: 'Fund',
                    data: aggregateData(data.filter(item => item.utype === 'Fund'), 'advisor', 'fundstock').map(item => ({
                        name: item.name,
                        y: item.data,
                    })),
                }, {
                    id: 'stock',
                    name: 'Stock',
                    data: aggregateData(data.filter(item => item.utype === 'Stock'), 'advisor', 'fundstock').map(item => ({
                        name: item.name,
                        y: item.data,
                    })),
                }],
            },
        });
        
        
        setFSOptions({
            chart: {
                type: 'bar',
                height: 500,
                marginTop: 30,
                marginRight: 20,
                marginBottom: 100,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: '#f9f9f9',
                style: {
                    fontFamily: 'Arial, sans-serif',
                    color: '#333',
                },
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    viewDistance: 25,
                    depth: 40,
                },
                scrollablePlotArea: {
                    minHeight: 300,
                },
            },
            title: {
                text: 'Entity Wise Holding',
                style: {
                    color: '#333',
                    fontSize: '18px',
                    fontWeight: 'bold',
                },
            },
            xAxis: {
                type: 'category',
                labels: {
                    enabled: true,
                    skew3d: true,
                    style: {
                        color: '#333',
                        fontSize: '10px',
                        fontWeight: 'bold',
                    },
                    inside: true,
                },
            },
            yAxis: {
                title: {
                    text: 'Fund Stock',
                    skew3d: true,
                    style: {
                        color: '#333',
                        fontWeight: 'bold',
                    },
                },
                labels: {
                    style: {
                        color: '#333',
                    },
                },
            },
            legend: {
                enabled: true,
                itemStyle: {
                    color: '#333',
                },
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                },
                bar: {
                    borderWidth: 0,
                    depth: 40,
                    dataLabels: {
                        enabled: true,
                        inside: true,
                        style: {
                            color: '#333',
                            textDecoration: 'none',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            backgroundColor: 'transparent',
                        },
                        formatter: function() {
                            return this.y;
                        },
                    },
                },
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px color:#ccc text-decoration:none">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                style: {
                    color: '#fff',
                },
            },
            series: [{
                name: 'Fund',
                colorByPoint: false,
                color: '#FFC300',
                data: aggregateData(data.filter(item => item.utype === 'Fund'), 'entityname', 'fundstock').map(item => ({
                    name: item.name,
                    y: item.data,
                    drilldown: 'Fund_' + item.name,
                })),
            },
            {
                name: 'Stock',
                colorByPoint: false,
                color: '#3498DB',
                data: aggregateData(data.filter(item => item.utype === 'Stock'), 'entityname', 'fundstock').map(item => ({
                    name: item.name,
                    y: item.data,
                    drilldown: 'Stock_' + item.name,
                })),
            }],
            drilldown: {
                series: [
                    ...generateFSDrilldownSeries(data.filter(item => item.utype === 'Fund'), 'Fund', 'entityname', ['fund', 'fundstock']),
                    ...generateFSDrilldownSeries(data.filter(item => item.utype === 'Stock'), 'Stock', 'entityname', ['equity', 'fundstock']),
                ],
                activeAxisLabelStyle: {
                    color: '#333',
                    textDecoration: 'none',
                },
                activeDataLabelStyle: {
                    color: '#333',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '9px',
                    backgroundColor: 'transparent',
                },
                breadcrumbs: {
                    buttonTheme: {
                        style: {
                            color: '#333',
                            marrginTop: 0,
                        },
                    },
                },
            },
        });
        
        
        
        
        
        
        
        
        
        
        
    }, [data]);

    return isClient ? (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', overflow:'auto'}}>
        <div style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            marginBottom: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
            <h3>Total Holding</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{(totalFundStock / 1000000).toFixed(2)}M</div>
        </div>
        <div style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            marginBottom: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
            <h3>Total Fund Holding</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{(totalFund / 1000000).toFixed(2)}M</div>
        </div>
        <div style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            marginBottom: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
            <h3>Total Stock Holding</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{(totalStock / 1000000).toFixed(2)}M</div>
        </div>
    
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' }}>
            {fsoptions && <HighchartsReact highcharts={Highcharts} options={fsoptions} />}
            {fsaoptions && <HighchartsReact highcharts={Highcharts} options={fsaoptions} />}
            
           
        </div>
        <div>
            <SFTable data={aggregateStock(data,'equity','fundstock')}></SFTable>
            </div>
    </div>
    

    ) : null;
};

export default BarChart;
