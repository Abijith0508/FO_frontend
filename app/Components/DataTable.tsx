import React, { useState, useEffect } from 'react';
import { grayText2, tableGlass } from '../styling';
import { ScrollArea , ScrollBar} from "@/components/ui/scroll-area"
import DataItem from "../Utilities/DataItem"
 
type GroupedRow = {
  type: 'group' | 'data';
  level: number;
  label: string;
  key: string;
  row?: DataItem;
  percentages?: {
    closing_cost?: number;
    closing_value?: number;
    unrealized_gain?: number;
    opening_cost?: number; 
    realized_gain?:number;
    opening_value? : number; 
    total_gain?: number
  };
};

// Add new interface for expanded state
interface ExpandedState {
  [key: string]: boolean;
}

// Function to group and aggregate data hierarchically
function groupData(data: DataItem[]): GroupedRow[] {
  const grouped: GroupedRow[] = [];

  const grandTotals = data.reduce((acc, row) => {
    acc.closing_cost += parseFloat(row.closing_cost || '0');
    acc.closing_value += parseFloat(row.closing_value || '0');
    acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
    acc.opening_cost += parseFloat(row.opening_cost || '0');
    acc.opening_value += parseFloat(row.opening_value || '0');
    acc.realized_gain += parseFloat(row.realized_gain || '0');
    acc.total_gain = acc.unrealized_gain + acc.realized_gain;
    return acc;
  }, { 
    closing_cost: 0, 
    closing_value: 0, 
    unrealized_gain: 0,
    opening_cost: 0,
    opening_value: 0,
    realized_gain: 0,
    total_gain: 0
  });

  const computePercent = (value: number, total: number) =>
    total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(2));

  // First, group by asset_type
  const assetTypeGroups = data.reduce((acc, row) => {
    if (!row.asset_type) return acc;
    if (!acc[row.asset_type]) acc[row.asset_type] = [];
    acc[row.asset_type].push(row);
    return acc;
  }, {} as Record<string, DataItem[]>);

  // Process each asset type
  Object.entries(assetTypeGroups).forEach(([asset_type, assetRows]) => {
    const assetTotals = assetRows.reduce((acc, row) => {
      acc.closing_cost += parseFloat(row.closing_cost || '0');
      acc.closing_value += parseFloat(row.closing_value || '0');
      acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
      acc.opening_cost += parseFloat(row.opening_cost || '0');
      acc.opening_value += parseFloat(row.opening_value || '0');
      acc.realized_gain += parseFloat(row.realized_gain || '0');
      acc.total_gain = acc.unrealized_gain + acc.realized_gain;
      return acc;
    }, { 
      closing_cost: 0, 
      closing_value: 0, 
      unrealized_gain: 0,
      opening_cost: 0,
      opening_value: 0,
      realized_gain: 0,
      total_gain: 0
    });

    grouped.push({
      type: 'group',
      level: 0,
      label: asset_type,
      key: `asset-${asset_type}`,
      row: {
        id: -3, entity: '', advisor: '', isin: '', folio_no: '', name: '', quantity: '',
        avg_cost: '', market_price: '',
        closing_cost: assetTotals.closing_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        closing_value: assetTotals.closing_value.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        unrealized_gain: assetTotals.unrealized_gain.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        opening_cost: assetTotals.opening_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        opening_value: assetTotals.opening_value.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        realized_gain: assetTotals.realized_gain.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        total_gain: assetTotals.total_gain.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        irr: '', gain_cq: null, irr_cq: null, asset_type, strategy: '', substrategy: ''
      },
      percentages: {
        closing_cost: computePercent(assetTotals.closing_cost, grandTotals.closing_cost),
        closing_value: computePercent(assetTotals.closing_value, grandTotals.closing_value),
        unrealized_gain: computePercent(assetTotals.unrealized_gain, grandTotals.unrealized_gain),
        opening_cost: computePercent(assetTotals.opening_cost, grandTotals.opening_cost),
        opening_value: computePercent(assetTotals.opening_value, grandTotals.opening_value),
        realized_gain: computePercent(assetTotals.realized_gain, grandTotals.realized_gain),
        total_gain: computePercent(assetTotals.total_gain, grandTotals.total_gain)
      }
    });

    // Group by strategy within asset type
    const strategyGroups = assetRows.reduce((acc, row) => {
      if (!row.strategy) return acc;
      const strategy = row.strategy.split('-')[0];
      if (!acc[strategy]) acc[strategy] = [];
      acc[strategy].push(row);
      return acc;
    }, {} as Record<string, DataItem[]>);

    Object.entries(strategyGroups).forEach(([strategy, strategyRows]) => {
      const strategyTotals = strategyRows.reduce((acc, row) => {
        acc.closing_cost += parseFloat(row.closing_cost || '0');
        acc.closing_value += parseFloat(row.closing_value || '0');
        acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
        acc.opening_cost += parseFloat(row.opening_cost || '0');
        acc.opening_value += parseFloat(row.opening_value || '0');
        acc.realized_gain += parseFloat(row.realized_gain || '0');
        acc.total_gain = acc.unrealized_gain + acc.realized_gain;
        return acc;
      }, { 
        closing_cost: 0, 
        closing_value: 0, 
        unrealized_gain: 0,
        opening_cost: 0,
        opening_value: 0,
        realized_gain: 0,
        total_gain: 0
      });

      grouped.push({
        type: 'group',
        level: 1,
        label: strategy,
        key: `asset-${asset_type}-strategy-${strategy}`,
        row: {
          id: -2, entity: '', advisor: '', isin: '', folio_no: '', name: '', quantity: '',
          avg_cost: '', market_price: '',
          closing_cost: strategyTotals.closing_cost.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          closing_value: strategyTotals.closing_value.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          unrealized_gain: strategyTotals.unrealized_gain.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          opening_cost: strategyTotals.opening_cost.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          opening_value: strategyTotals.opening_value.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          realized_gain: strategyTotals.realized_gain.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          total_gain: strategyTotals.total_gain.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          irr: '', gain_cq: null, irr_cq: null, asset_type, strategy, substrategy: ''
        },
        percentages: {
          closing_cost: computePercent(strategyTotals.closing_cost, grandTotals.closing_cost),
          closing_value: computePercent(strategyTotals.closing_value, grandTotals.closing_value),
          unrealized_gain: computePercent(strategyTotals.unrealized_gain, grandTotals.unrealized_gain),
          opening_cost: computePercent(strategyTotals.opening_cost, grandTotals.opening_cost),
          opening_value: computePercent(strategyTotals.opening_value, grandTotals.opening_value),
          realized_gain: computePercent(strategyTotals.realized_gain, grandTotals.realized_gain),
          total_gain: computePercent(strategyTotals.total_gain, grandTotals.total_gain)
        }
      });

      // Group by substrategy
      const substrategyGroups = strategyRows.reduce((acc, row) => {
        const substrategy = row.substrategy ? row.substrategy.split('-')[0] : 'General';
        if (!acc[substrategy]) acc[substrategy] = [];
        acc[substrategy].push(row);
        return acc;
      }, {} as Record<string, DataItem[]>);

      Object.entries(substrategyGroups).forEach(([substrategy, substrategyRows]) => {
        const substrategyTotals = substrategyRows.reduce((acc, row) => {
          acc.closing_cost += parseFloat(row.closing_cost || '0');
          acc.closing_value += parseFloat(row.closing_value || '0');
          acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
          acc.opening_cost += parseFloat(row.opening_cost || '0');
          acc.opening_value += parseFloat(row.opening_value || '0');
          acc.realized_gain += parseFloat(row.realized_gain || '0');
          acc.total_gain = acc.unrealized_gain + acc.realized_gain;
          return acc;
        }, { 
          closing_cost: 0, 
          closing_value: 0, 
          unrealized_gain: 0,
          opening_cost: 0,
          opening_value: 0,
          realized_gain: 0,
          total_gain: 0
        });

        grouped.push({
          type: 'group',
          level: 2,
          label: substrategy,
          key: `asset-${asset_type}-strategy-${strategy}-substrategy-${substrategy}`,
          row: {
            id: -1, entity: '', advisor: '', isin: '', folio_no: '', name: '', quantity: '',
            avg_cost: '', market_price: '',
            closing_cost: substrategyTotals.closing_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            closing_value: substrategyTotals.closing_value.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            unrealized_gain: substrategyTotals.unrealized_gain.toFixed(2),
            opening_cost: substrategyTotals.opening_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            opening_value: substrategyTotals.opening_value.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            realized_gain: substrategyTotals.realized_gain.toFixed(2),
            total_gain: substrategyTotals.total_gain.toFixed(2),
            irr: '', gain_cq: null, irr_cq: null, asset_type, strategy, substrategy
          },
          percentages: {
            closing_cost: computePercent(substrategyTotals.closing_cost, grandTotals.closing_cost),
            closing_value: computePercent(substrategyTotals.closing_value, grandTotals.closing_value),
            unrealized_gain: computePercent(substrategyTotals.unrealized_gain, grandTotals.unrealized_gain),
            opening_cost: computePercent(substrategyTotals.opening_cost, grandTotals.opening_cost),
            opening_value: computePercent(substrategyTotals.opening_value, grandTotals.opening_value),
            realized_gain: computePercent(substrategyTotals.realized_gain, grandTotals.realized_gain),
            total_gain: computePercent(substrategyTotals.total_gain, grandTotals.total_gain)
          }
        });
      });
    });
  });

  return grouped;
}

// Column definitions for the table headers and how to extract cell data
const performanceColumns = [
  {
    accessorKey: 'label',
    header: 'Hierarchy',
    // Custom cell rendering to apply padding based on level
    renderCell: (row: GroupedRow) => (
      <span
        style={{ 
            paddingLeft: `${(row.level + 1) * 20}px`,
            
        }}
        className={row.level < 3 ? "font-bold" : ""} // Make summary labels bold
      >
        {row.label}
      </span>
    ),
  },
  {
    accessorKey: 'opening_cost',
    header: 'Opening Cost',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.opening_cost;
      const pct = row.percentages?.opening_cost;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'closing_cost',
    header: 'Invested Amount ',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.closing_cost;
      const pct = row.percentages?.closing_cost;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'opening_value',
    header: 'Opening Value',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.opening_value;
      const pct = row.percentages?.opening_value;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'closing_value',
    header: 'Holding Value',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.closing_value;
      const pct = row.percentages?.closing_value;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'unrealized_gain',
    header: 'Unrealised Gain',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.unrealized_gain;
      const pct = row.percentages?.unrealized_gain;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'realized_gain',
    header: 'Realised Gain',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.realized_gain;
      const pct = row.percentages?.realized_gain;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'total_gain',
    header: 'Total Gain',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.total_gain;
      const pct = row.percentages?.total_gain;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
];

const holdingsColumns = [
  {
    accessorKey: 'label',
    header: 'Hierarchy',
    // Custom cell rendering to apply padding based on level
    renderCell: (row: GroupedRow) => (
      <span
        style={{ 
            paddingLeft: `${(row.level + 1) * 20}px`,
            
        }}
        className={row.level < 3 ? "font-bold" : ""} // Make summary labels bold
      >
        {row.label}
      </span>
    ),
  },
  {
    accessorKey: 'closing_cost',
    header: 'Invested Amount ',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.closing_cost;
      const pct = row.percentages?.closing_cost;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'closing_value',
    header: 'Holding Value',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.closing_value;
      const pct = row.percentages?.closing_value;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'unrealized_gain',
    header: 'Unrealised Gain',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.unrealized_gain;
      const pct = row.percentages?.unrealized_gain;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
];

// Inline Shadcn UI Table components (simplified for direct use without imports)
const Table = ({ children }: { children: React.ReactNode }) => (
  <table id="Total" className="min-w-full rounded-lg overflow-y-scroll scroll-smooth bg-transparent">
    {children}
  </table>
);
const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-emerald text-white">{children}</thead>
);
const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className=" divide-white/10 bg-transparent">{children}</tbody>
);
const TableRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <tr className={`${className} ${grayText2}`}>{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className={`px-6 py-3 text-center text-sm font-medium ${grayText2} `}>
    {children}
  </th>
);
const TableCell = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-white/40 ${className} ${tableGlass} bg-transparent`}>{children}</td>
);
 
// Add new interface for props
interface GroupedDataTableProps {
  className?: string;
  data: DataItem[];
  mode: string;
}
 
const GroupedDataTable: React.FC<GroupedDataTableProps> = ({ className, data, mode }) => {
  const [groupedRows, setGroupedRows] = useState<GroupedRow[]>([]);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Select columns based on mode
  const columns = mode === "Performance" ? performanceColumns : holdingsColumns;

  // Process data when it changes
  useEffect(() => {
    try {
      setIsLoading(true);
      const processedData = groupData(data);
      setGroupedRows(processedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing data');
    } finally {
      setIsLoading(false);
    }
  }, [data]);
 
  // Function to toggle expanded state
  const toggleExpanded = (key: string) => {
    setExpandedState(prev => {
      const newState = { ...prev };
      newState[key] = !prev[key];
      return newState;
    });
  };
 
  // Function to check if a row should be visible
  const isRowVisible = (row: GroupedRow, index: number) => {
    if (row.level === 0) return true; // Always show asset type rows
   
    // For strategy rows (level 1), check if parent asset type is expanded
    if (row.level === 1) {
      const assetTypeKey = `asset-${row.key.split('-')[1]}`;
      return expandedState[assetTypeKey] === true;
    }
   
    // For substrategy rows (level 2), check if both asset type and strategy are expanded
    if (row.level === 2) {
      const parts = row.key.split('-');
      const assetTypeKey = `asset-${parts[1]}`;
      const strategyKey = `asset-${parts[1]}-strategy-${parts[3]}`;
      return expandedState[assetTypeKey] === true && expandedState[strategyKey] === true;
    }
 
    return true;
  };
 
  // Function to render expand/collapse icon
  type iconProps = {
    row : GroupedRow,
    className? : string
  }
  const RenderExpandIcon = ({row, className} : iconProps) => {
    
    if (row.level >= 2) return null; // Don't show icon for substrategy rows
   
    // For strategy rows (level 1), check if it has multiple substrategies
    if (row.level === 1) {
      const strategy = row.label;
      const substrategyCount = groupedRows.filter(r =>
        r.level === 2 &&
        r.key.includes(`strategy-${strategy}`)
      ).length;
     
      if (substrategyCount <= 1){
        return (
        <div className={`
            inline-flex items-center justify-center w-6 h-6 mr-2 text-gray-500 
            focus:outline-none ${className}
        `}>
            <svg className="w-4 h-4" fill="none" stroke="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
        );
      }// Don't show icon if only one or no substrategies
    }
   
    const isExpanded = expandedState[row.key] === true;

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleExpanded(row.key);
        }}
        className={`
            inline-flex items-center justify-center w-6 h-6 mr-2 text-gray-500 
            focus:outline-none ${className} cursor-pointer
        `}
        style = {{
            // transform: isExpanded ? 'rotate(30deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out',
        }}
      >
        {isExpanded ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    );
  };
 
  // Initialize expanded state with all levels collapsed
  useEffect(() => {
    const initialExpandedState: ExpandedState = {};
    groupedRows.forEach(row => {
      if (row.level < 2) { // Only for asset type and strategy rows
        initialExpandedState[row.key] = false;
      }
      else initialExpandedState[row.key] = true;
    });
    setExpandedState(initialExpandedState);
  }, [groupedRows]);
 
 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`w-full h-full rounded-2xl overflow-y-auto ${className}`}>
        <div className={`w-full border-white overflow-y-auto`}>
          
        <ScrollArea className=" w-full shadow-lg">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                    <TableRow className = "rounded-t-lg">
                    {columns.map((column, index) => (
                        <TableHead key={index}>{column.header}</TableHead>
                    ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {groupedRows.map((row, index) => {
                    if (!isRowVisible(row, index)) return null;
                    
                    return (
                        <TableRow
                        key={row.key}
                        className={`
                            ${row.level === 0 ? 'bg-white/10 hover:bg-white/20' :
                            row.level === 1 ? 'bg-white/5 hover:bg-white/20' :
                            row.level === 2 ? 'bg-white/0 hover:bg-white/20' :
                            'bg-gray-50 hover:bg-gray-100'}
                            transition-colors duration-500 backdrop-blur-md shadow-none ${grayText2}
                            ${tableGlass}
                        `}
                        >
                        <TableCell>
                            <div className="flex items-center text-left"
                                // onClick={(e) => {
                                // e.stopPropagation();
                                // toggleExpanded(row.key);
                                // }}
                            >
                            <RenderExpandIcon row={row}/>
                            <span
                                style={{ 
                                    paddingLeft: `${row.level * row.level * 20}px` ,
                                    minWidth: `250px`
                                }}
                            >
                                {row.label}
                            </span>
                            </div>
                        </TableCell>

                        {columns.slice(1).map((column, colIndex) => (
                            <TableCell key={colIndex}>
                            {column.renderCell(row)}
                            </TableCell>
                        ))}
                        </TableRow>
                    );
                    })}
                </TableBody>
              </Table>
            </ScrollArea>
            
            <ScrollBar orientation="horizontal" className="bg-white/50"/>
        </ScrollArea>
        </div>
    
    </div>
  );
};
 
// components/ui/data-table.tsx
import { Download } from 'lucide-react';
import { download } from '../Utilities/download';
import { groupBy } from '../Utilities/filterFunction';

interface DataTableProps{
  ogdata: DataItem[];
  groupByField: any;
}

type GroupedDataItem = {
  [key: string]: string | number;
  sumOfClosingCosts: number;
  sumOfClosingValue: number;
  sumOfUnrealizedGain: number;
};

function SubTable({ogdata, groupByField}: DataTableProps) {
  const data = groupBy(ogdata, groupByField) as GroupedDataItem[];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
      <Download 
      className="fixed right-10 top-10 stroke-white/50 hover:stroke-white/80 z-20 transition-colors duration-200" 
      onClick={() => download(groupByField)}/>
        <table id={groupByField} className="w-full border-collapse text-gray">
          <thead>
            <tr className="bg-white/5 backdrop-blur-md">
              <th className="px-6 py-3 text-left text-sm font-medium ">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium ">Invested Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium ">Holding Value</th>
              <th className="px-6 py-3 text-left text-sm font-medium ">Unrealized Gain</th>
              <th className="px-6 py-3 text-left text-sm font-medium ">Gain %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item, index) => {
              const closingCosts = Number(item.sumOfClosingCosts);
              const closingValue = Number(item.sumOfClosingValue);
              const unrealizedGain = Number(item.sumOfUnrealizedGain);
              const gainPercentage = closingCosts !== 0 
                ? (unrealizedGain / closingCosts) * 100 
                : 0;

              return (
                <tr 
                  key={index}
                  className="bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm text-left text-white/80">
                    {String(item[groupByField])}
                  </td>
                  <td className="px-6 py-4 text-sm text-left text-white/80">
                    {formatCurrency(closingValue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-left text-white/80">
                    {formatCurrency(closingCosts)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-left font-medium`}>
                    {formatCurrency(unrealizedGain)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-left font-medium`}>
                    {gainPercentage.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
}

export {GroupedDataTable, SubTable};
 
