"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import drilldown from "highcharts/modules/drilldown";

HighchartsMore(Highcharts);
drilldown(Highcharts);

const HoldingsDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);

  // Helper function to format currency with rupee symbol
  const formatCurrency = (value) => {
    const rupeeSymbol = "\u20B9"; // Unicode for Indian Rupee sign
    return `${rupeeSymbol}${parseFloat(value || 0).toLocaleString("en-IN")}`;
  };

  useEffect(() => {
    fetch("http://13.202.119.24/irr/holdings")
      .then((res) => res.json())
      .then((result) => {
        setData(result.holdings);
        setFilteredData(result.holdings);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Enhanced filter handler with history tracking
  const onFilter = (key, value) => {
    if (!key) {
      // Clear all filters (go back to root)
      setFilteredData(data);
      setFilterHistory([]);
      return;
    }

    // Add new filter to history
    const newFilter = { key, value };
    let newHistory = [...filterHistory];

    // If the new filter's key is already in history, we're likely replacing it or refining.
    // For simplicity, we'll allow stacking. If you want to replace, you'd modify this logic.
    newHistory.push(newFilter);

    setFilterHistory(newHistory);

    // Apply all filters in sequence
    let filtered = data;
    for (const filter of newHistory) {
      filtered = filtered.filter((item) => item[filter.key] === filter.value);
    }
    setFilteredData(filtered);
  };

  // Go back one level in filter history
  const goBackOneLevel = () => {
    if (filterHistory.length === 0) return;

    const newHistory = filterHistory.slice(0, -1);
    setFilterHistory(newHistory);

    if (newHistory.length === 0) {
      setFilteredData(data);
    } else {
      let filtered = data;
      for (const filter of newHistory) {
        filtered = filtered.filter((item) => item[filter.key] === filter.value);
      }
      setFilteredData(filtered);
    }
  };

  // Sums closing_value grouped by a key
  const sumBy = (key, groupBy) => {
    return filteredData.reduce((acc, curr) => {
      const groupKey = typeof groupBy === "function" ? groupBy(curr) : curr[groupBy];
      const name = groupKey || "Unknown";
      const value = parseFloat(curr[key]) || 0;
      acc[name] = (acc[name] || 0) + value;
      return acc;
    }, {});
  };

  // Build chart options with enhanced drilldown support
  const buildOptions = (title, chartData, groupBy, chartType = "column", height = 500, onFilterCallback) => {
    const entries = Object.entries(chartData);
    const isPie = chartType === "donut";
    const isBar = chartType === "bar";

    const drilldownSeries = [];
    
    let seriesData = entries.map(([key, val]) => {
      // Logic for strategy drilldown into third_grp
      if (groupBy === "strategy") {
        const children = filteredData.filter((item) => item.strategy === key);
        const uniqueThirdGrps = [...new Set(children.map((i) => i.third_grp))];
        if (uniqueThirdGrps.length > 1) {
          const drillData = children.reduce((acc, curr) => {
            const name = curr.third_grp || "Unknown";
            const value = parseFloat(curr.closing_value) || 0;
            acc[name] = (acc[name] || 0) + value;
            return acc;
          }, {});

          drilldownSeries.push({
            id: key,
            name: `${key} - Third Group Breakdown`,
            data: Object.entries(drillData).map(([k, v]) => [k, v]),
          });
          return { name: key, y: val, drilldown: key };
        }
        return { name: key, y: val };
      }
      // Logic for main_grp drilldown into strategy when asset_type is filtered
      else if (groupBy === "main_grp" && filterHistory.some(f => f.key === "asset_type")) {
          const entityData = filteredData.filter(item => item.main_grp === key);
          const uniqueStrategies = [...new Set(entityData.map(item => item.strategy))];

          // Only create drilldown if there's more than one unique strategy for this entity
          if (uniqueStrategies.length > 1) {
              const strategyBreakdown = entityData.reduce((acc, curr) => {
                  const strategy = curr.strategy || "Unknown";
                  const value = parseFloat(curr.closing_value) || 0;
                  acc[strategy] = (acc[strategy] || 0) + value;
                  return acc;
              }, {});

              drilldownSeries.push({
                  id: key,
                  name: `${key} - Strategy Breakdown`,
                  data: Object.entries(strategyBreakdown).map(([k, v]) => [k, v]),
              });
              return { name: key, y: val, drilldown: key };
          }
          return { name: key, y: val };
      }
      else {
        return { name: key, y: val };
      }
    });

    return {
      chart: {
        type: isPie ? "pie" : chartType,
        height,
        backgroundColor: 'transparent',
        style: {
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        },
        events: {
          drillup: function () {
            // Highcharts drillup event fires after the internal drillup.
            // We use our goBackOneLevel to synchronize our filter history.
            goBackOneLevel();
          },
        },
      },
      title: {
        text: title,
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1f2937',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }
      },
      tooltip: {
        formatter: function() {
          return '<b>' + this.point.name + '</b><br/>' + formatCurrency(this.y);
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: true,
        style: {
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }
      },
      plotOptions: {
        pie: {
          innerSize: "50%",
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter: function() {
              return formatCurrency(this.y);
            },
            style: {
              fontWeight: 'bold',
              color: '#374151',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
            }
          },
          showInLegend: true,
          point: {
            events: {
              click: function () {
                // For pie charts, clicking a slice should trigger our filter
                if (onFilterCallback) onFilterCallback(groupBy, this.name);
              },
            },
          },
        },
        series: {
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            inside: isBar,
            align: isBar ? "right" : "center",
            formatter: function() {
              return formatCurrency(this.y);
            },
            style: {
              fontWeight: "bold",
              color: isBar ? "white" : "#374151",
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
            },
          },
          point: {
            events: {
              click: function () {
                // For column/bar charts, if there's a drilldown, Highcharts handles it.
                // If not, we trigger our custom filter.
                if (!this.drilldown) {
                  if (onFilterCallback) {
                    onFilterCallback(groupBy, this.name);
                  }
                }
              },
            },
          },
        },
      },
      xAxis: !isPie
        ? {
            type: "category",
            title: { text: null },
            gridLineColor: '#f3f4f6',
            lineColor: '#e5e7eb',
            labels: {
              style: {
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
              }
            }
          }
        : undefined,
      yAxis: !isPie
        ? {
            title: {
              text: "Closing Value (\u20B9)", // Rupee symbol here
              style: {
                color: '#6b7280',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
              }
            },
            gridLineColor: '#f3f4f6',
            labels: {
              formatter: function() {
                return formatCurrency(this.value);
              },
              style: {
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
              }
            }
          }
        : undefined,
      series: [
        {
          name: "Closing Value",
          colorByPoint: true,
          data: seriesData,
        },
      ],
      drilldown: {
        series: drilldownSeries,
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1']
    };
  };

  // Summaries for charts
  const entityData = sumBy("closing_value", "main_grp");
  const strategyData = sumBy("closing_value", "strategy");
  const advisorData = sumBy("closing_value", "subgrp");

  // Totals for boxes
  const total = filteredData.reduce((a, b) => a + (parseFloat(b.closing_value) || 0), 0);
  const equity = filteredData
    .filter((item) => item.asset_type === "Equity")
    .reduce((sum, item) => sum + (parseFloat(item.closing_value) || 0), 0);
  const debt = filteredData
    .filter((item) => item.asset_type === "Debt")
    .reduce((sum, item) => sum + (parseFloat(item.closing_value) || 0), 0);

  // Get current filter context for display
  const getCurrentContext = () => {
    if (filterHistory.length === 0) return "All Holdings";
    return filterHistory.map(f => `${f.key}: ${f.value}`).join(" \u2192 "); // Using right arrow for clarity
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6" style={{fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'}}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Holdings Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Real-time portfolio insights and analytics</p>
            <p className="text-sm text-blue-600 mt-2 font-medium">
              Current View: {getCurrentContext()}
            </p>
          </div>
          <div className="flex space-x-3">
            {filterHistory.length > 0 && (
              <button
                onClick={goBackOneLevel}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </span>
              </button>
            )}
            {filterHistory.length > 0 && (
              <button
                onClick={() => onFilter(null, null)}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear All Filters</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            onClick={() => onFilter(null, null)}
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Holdings</p>
                  <p className="text-white text-2xl font-bold mt-2">{formatCurrency(total)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            onClick={() => onFilter("asset_type", "Equity")}
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Equity</p>
                  <p className="text-white text-2xl font-bold mt-2">{formatCurrency(equity)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            onClick={() => onFilter("asset_type", "Debt")}
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Debt</p>
                  <p className="text-white text-2xl font-bold mt-2">{formatCurrency(debt)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts without boxes - full width */}
        {/* Entity Chart */}
        <div className="w-full">
          <HighchartsReact
            highcharts={Highcharts}
            options={buildOptions("Entity-wise Distribution", entityData, "main_grp", "donut", 600, onFilter)}
          />
        </div>

        {/* Strategy and Advisor Charts - side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={buildOptions("Strategy-wise Allocation", strategyData, "strategy", "bar", 700, onFilter)}
            />
          </div>
          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={buildOptions("Advisor-wise Distribution", advisorData, "subgrp", "bar", 700, onFilter)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsDashboard;