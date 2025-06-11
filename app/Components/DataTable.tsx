import React, { useState, useEffect } from 'react';
import { grayText, grayText2, tableGlass } from '../styling';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Divide } from 'lucide-react';



interface DataRow {
  id: number;
  entity: string;
  advisor: string;
  substrategy: string;
  isin: string;
  folio_no: string;
  name: string;
  quantity: string;
  avg_cost: string;
  market_price: string;
  closing_cost: string;
  closing_value: string;
  unrealized_gain: string;
  irr: string;
  gain_cq: string | null;
  irr_cq: string | null;
  asset_type: string;
  strategy: string;
}
 
type GroupedRow = {
  type: 'group' | 'data'; // 'group' for summary rows, 'data' for individual asset rows
  level: number; // 0: Asset Type, 1: Strategy, 2: Substrategy
  label: string;
  row?: DataRow; // Contains data for 'data' type rows and summary data for 'group' type rows
  key: string;
};
 
// Add new interface for expanded state
interface ExpandedState {
  [key: string]: boolean;
}
 
// Function to group and aggregate data hierarchically
function groupData(data: DataRow[]): GroupedRow[] {
  const grouped: GroupedRow[] = [];
 
  // First, group by asset_type
  const assetTypeGroups = data.reduce((acc, row) => {
    if (!row.asset_type) return acc;
    if (!acc[row.asset_type]) {
      acc[row.asset_type] = [];
    }
    acc[row.asset_type].push(row);
    return acc;
  }, {} as Record<string, DataRow[]>);
 
  // Process each asset type
  Object.entries(assetTypeGroups).forEach(([asset_type, assetRows]) => {
    // Calculate asset type totals
    const assetTotals = assetRows.reduce((acc, row) => {
      acc.closing_cost += parseFloat(row.closing_cost || '0');
      acc.closing_value += parseFloat(row.closing_value || '0');
      acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
      return acc;
    }, { closing_cost: 0, closing_value: 0, unrealized_gain: 0 });
 
    // Add asset type summary row
    grouped.push({
      type: 'group',
      level: 0,
      label: asset_type,
      key: `asset-${asset_type}`,
      row: {
        id: -3, entity: '', advisor: '', isin: '', folio_no: '', name: '', quantity: '',
        avg_cost: '', market_price: '',
        closing_cost: assetTotals.closing_cost.toFixed(2),
        closing_value: assetTotals.closing_value.toFixed(2),
        unrealized_gain: assetTotals.unrealized_gain.toFixed(2),
        irr: '', gain_cq: null, irr_cq: null, asset_type, strategy: '', substrategy: ''
      }
    });
 
    // Group by strategy within asset type
    const strategyGroups = assetRows.reduce((acc, row) => {
      if (!row.strategy) return acc;
      // Remove everything after hyphen in strategy name
      const strategy = row.strategy.split('-')[0];
      if (!acc[strategy]) {
        acc[strategy] = [];
      }
      acc[strategy].push(row);
      return acc;
    }, {} as Record<string, DataRow[]>);
 
    // Process each strategy
    Object.entries(strategyGroups).forEach(([strategy, strategyRows]) => {
      // Calculate strategy totals
      const strategyTotals = strategyRows.reduce((acc, row) => {
        acc.closing_cost += parseFloat(row.closing_cost || '0');
        acc.closing_value += parseFloat(row.closing_value || '0');
        acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
        return acc;
      }, { closing_cost: 0, closing_value: 0, unrealized_gain: 0 });
 
      // Add strategy summary row
      grouped.push({
        type: 'group',
        level: 1,
        label: strategy,
        key: `asset-${asset_type}-strategy-${strategy}`,
        row: {
          id: -2, entity: '', advisor: '', isin: '', folio_no: '', name: '', quantity: '',
          avg_cost: '', market_price: '',
          closing_cost: strategyTotals.closing_cost.toFixed(2),
          closing_value: strategyTotals.closing_value.toFixed(2),
          unrealized_gain: strategyTotals.unrealized_gain.toFixed(2),
          irr: '', gain_cq: null, irr_cq: null, asset_type, strategy, substrategy: ''
        }
      });
 
      // Group by substrategy within strategy
      const substrategyGroups = strategyRows.reduce((acc, row) => {
        // Remove everything after hyphen in substrategy name
        const substrategy = row.substrategy ? row.substrategy.split('-')[0] : 'General';
        if (!acc[substrategy]) {
          acc[substrategy] = [];
        }
        acc[substrategy].push(row);
        return acc;
      }, {} as Record<string, DataRow[]>);
 
      // Process each substrategy
      Object.entries(substrategyGroups).forEach(([substrategy, substrategyRows]) => {
        // Calculate substrategy totals
        const substrategyTotals = substrategyRows.reduce((acc, row) => {
          acc.closing_cost += parseFloat(row.closing_cost || '0');
          acc.closing_value += parseFloat(row.closing_value || '0');
          acc.unrealized_gain += parseFloat(row.unrealized_gain || '0');
          return acc;
        }, { closing_cost: 0, closing_value: 0, unrealized_gain: 0 });
 
        // Add substrategy summary row
        grouped.push({
          type: 'group',
          level: 2,
          label: substrategy,
          key: `asset-${asset_type}-strategy-${strategy}-substrategy-${substrategy}`,
          row: {
            id: -1, entity: '', advisor: '', isin: '', folio_no: '', name: '', quantity: '',
            avg_cost: '', market_price: '',
            closing_cost: substrategyTotals.closing_cost.toFixed(2),
            closing_value: substrategyTotals.closing_value.toFixed(2),
            unrealized_gain: substrategyTotals.unrealized_gain.toFixed(2),
            irr: '', gain_cq: null, irr_cq: null, asset_type, strategy, substrategy
          }
        });
      });
    });
  });
 
  console.log('Generated grouped rows:', grouped.map(row => ({
    level: row.level,
    label: row.label,
    key: row.key,
    type: row.type
  })));
 
  return grouped;
}
 
// Column definitions for the table headers and how to extract cell data
const columns = [
  {
    accessorKey: 'label',
    header: 'Hierarchy',
    // Custom cell rendering to apply padding based on level
    renderCell: (row: GroupedRow) => (
      <span
        style={{ 
            paddingLeft: `${(row.level + 1) * 20}px`,
            minWidth : `600px`
        }}
        className={row.level < 3 ? "font-bold" : ""} // Make summary labels bold
      >
        {row.label}
      </span>
    ),
  },
  {
    accessorKey: 'closing_cost',
    header: 'Closing Cost',
    renderCell: (row: GroupedRow) => row.row?.closing_cost || '',
  },
  {
    accessorKey: 'closing_value',
    header: 'Closing Value',
    renderCell: (row: GroupedRow) => row.row?.closing_value || '',
  },
  {
    accessorKey: 'unrealized_gain',
    header: 'Unrealised Gain',
    renderCell: (row: GroupedRow) => row.row?.unrealized_gain || '',
  },
 
];
 
// Inline Shadcn UI Table components (simplified for direct use without imports)
const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="min-w-full rounded-lg overflow-y-scroll scroll-smooth bg-transparent">
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
  data: DataRow[];
}
 
const GroupedDataTable: React.FC<GroupedDataTableProps> = ({ className, data }) => {
  const [groupedRows, setGroupedRows] = useState<GroupedRow[]>([]);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
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
        // onMouseEnter={e => {
        //   if (!isExpanded) 
        //     e.currentTarget.style.transform = 'rotate(90deg)';
        //   else 
        //     e.currentTarget.style.transform = 'rotate(0deg)';

        // }}

        // onMouseLeave={e => {
        // //   if (!isExpanded) 
        //     e.currentTarget.style.transform = 'rotate(0deg)';
        // //   else e.currentTarget.style.transform = 'rotate(-90deg)';
        // }}
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
 
  // Debug log for grouped rows
  useEffect(() => {
    console.log('Grouped rows:', groupedRows.map(row => ({
      level: row.level,
      label: row.label,
      key: row.key
    })));
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
    <div className={`w-full h-full rounded-lg overflow-y-auto ${className} z-50`}>
        <div className={`w-full rounded-lg border-white overflow-y-auto`}>
        {/* <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
                font-family: 'Inter', sans-serif;
            }
            `}
        </style> */}
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Financial Portfolio Overview
        </h1> */}
    
        <ScrollArea className="max-h-[400]  w-full shadow-lg">
            <Table>
            <TableHeader>
                <TableRow className = " rounded-t-lg">
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
            <ScrollBar
                orientation="vertical"
                className="bg-transparent hover:bg-gray-600 w-3 rounded-full"
            />
        </ScrollArea>
        </div>
    
    </div>
  );
};
 
export default GroupedDataTable;
 
