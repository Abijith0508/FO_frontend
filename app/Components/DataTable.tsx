import React, { useState, useEffect } from 'react';
import { glass, grayText2, responsiveIcon, tableGlass } from '../styling';
import { ScrollArea , ScrollBar} from "@/components/ui/scroll-area"
import DataItem from "../Utilities/dataItem"
import { xirr } from '../Utilities/xirr';
import { groupBy, filterUpdate } from '../Utilities/filterFunction';
import { Download, EllipsisVerticalIcon, X } from 'lucide-react';
import { download } from '../Utilities/download';
const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    
type Cashflow = {
  amount: number;
  date: Date;
};

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
    total_gain?: number;
    stamp_duty?: number;
    stt_paid?: number;
    other_expenses?: number;
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
    acc.stamp_duty += parseFloat(row.stamp_duty || '0');
    acc.stt_paid += parseFloat(row.stt_paid || '0');
    acc.other_expenses += parseFloat(row.other_expenses || '0');
    return acc;
  }, { 
    closing_cost: 0, 
    closing_value: 0, 
    unrealized_gain: 0,
    opening_cost: 0,
    opening_value: 0,
    realized_gain: 0,
    total_gain: 0,
    stamp_duty: 0,
    stt_paid: 0,
    other_expenses: 0
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
      acc.stamp_duty += parseFloat(row.stamp_duty || '0');
      acc.stt_paid += parseFloat(row.stt_paid || '0');
      acc.other_expenses += parseFloat(row.other_expenses || '0');
      return acc;
    }, { 
      closing_cost: 0, 
      closing_value: 0, 
      unrealized_gain: 0,
      opening_cost: 0,
      opening_value: 0,
      realized_gain: 0,
      total_gain: 0,
      stamp_duty: 0,
      stt_paid: 0,
      other_expenses: 0
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
        stamp_duty: assetTotals.stamp_duty.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        stt_paid: assetTotals.stt_paid.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        other_expenses: assetTotals.other_expenses.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        irr: '0.00', gain_cq: null, irr_cq: null, asset_type, strategy: '', substrategy: ''
      },
      percentages: {
        closing_cost: computePercent(assetTotals.closing_cost, grandTotals.closing_cost),
        closing_value: computePercent(assetTotals.closing_value, grandTotals.closing_value),
        unrealized_gain: computePercent(assetTotals.unrealized_gain, grandTotals.unrealized_gain),
        opening_cost: computePercent(assetTotals.opening_cost, grandTotals.opening_cost),
        opening_value: computePercent(assetTotals.opening_value, grandTotals.opening_value),
        realized_gain: computePercent(assetTotals.realized_gain, grandTotals.realized_gain),
        total_gain: computePercent(assetTotals.total_gain, grandTotals.total_gain),
        stamp_duty: computePercent(assetTotals.stamp_duty, grandTotals.stamp_duty),
        stt_paid: computePercent(assetTotals.stt_paid, grandTotals.stt_paid),
        other_expenses: computePercent(assetTotals.other_expenses, grandTotals.other_expenses)
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
        acc.stamp_duty += parseFloat(row.stamp_duty || '0');
        acc.stt_paid += parseFloat(row.stt_paid || '0');
        acc.other_expenses += parseFloat(row.other_expenses || '0');
        return acc;
      }, { 
        closing_cost: 0, 
        closing_value: 0, 
        unrealized_gain: 0,
        opening_cost: 0,
        opening_value: 0,
        realized_gain: 0,
        total_gain: 0,
        stamp_duty: 0,
        stt_paid: 0,
        other_expenses: 0
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
          stamp_duty: strategyTotals.stamp_duty.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          stt_paid: strategyTotals.stt_paid.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          other_expenses: strategyTotals.other_expenses.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
          irr: '0.00', gain_cq: null, irr_cq: null, asset_type, strategy, substrategy: ''
        },
        percentages: {
          closing_cost: computePercent(strategyTotals.closing_cost, grandTotals.closing_cost),
          closing_value: computePercent(strategyTotals.closing_value, grandTotals.closing_value),
          unrealized_gain: computePercent(strategyTotals.unrealized_gain, grandTotals.unrealized_gain),
          opening_cost: computePercent(strategyTotals.opening_cost, grandTotals.opening_cost),
          opening_value: computePercent(strategyTotals.opening_value, grandTotals.opening_value),
          realized_gain: computePercent(strategyTotals.realized_gain, grandTotals.realized_gain),
          total_gain: computePercent(strategyTotals.total_gain, grandTotals.total_gain),
          stamp_duty: computePercent(strategyTotals.stamp_duty, grandTotals.stamp_duty),
          stt_paid: computePercent(strategyTotals.stt_paid, grandTotals.stt_paid),
          other_expenses: computePercent(strategyTotals.other_expenses, grandTotals.other_expenses)
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
          acc.stamp_duty += parseFloat(row.stamp_duty || '0');
          acc.stt_paid += parseFloat(row.stt_paid || '0');
          acc.other_expenses += parseFloat(row.other_expenses || '0');
          return acc;
        }, { 
          closing_cost: 0, 
          closing_value: 0, 
          unrealized_gain: 0,
          opening_cost: 0,
          opening_value: 0,
          realized_gain: 0,
          total_gain: 0,
          stamp_duty: 0,
          stt_paid: 0,
          other_expenses: 0
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
            stamp_duty: substrategyTotals.stamp_duty.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            stt_paid: substrategyTotals.stt_paid.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            other_expenses: substrategyTotals.other_expenses.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
            irr: '0.00', gain_cq: null, irr_cq: null, asset_type, strategy, substrategy
          },
          percentages: {
            closing_cost: computePercent(substrategyTotals.closing_cost, grandTotals.closing_cost),
            closing_value: computePercent(substrategyTotals.closing_value, grandTotals.closing_value),
            unrealized_gain: computePercent(substrategyTotals.unrealized_gain, grandTotals.unrealized_gain),
            opening_cost: computePercent(substrategyTotals.opening_cost, grandTotals.opening_cost),
            opening_value: computePercent(substrategyTotals.opening_value, grandTotals.opening_value),
            realized_gain: computePercent(substrategyTotals.realized_gain, grandTotals.realized_gain),
            total_gain: computePercent(substrategyTotals.total_gain, grandTotals.total_gain),
            stamp_duty: computePercent(substrategyTotals.stamp_duty, grandTotals.stamp_duty),
            stt_paid: computePercent(substrategyTotals.stt_paid, grandTotals.stt_paid),
            other_expenses: computePercent(substrategyTotals.other_expenses, grandTotals.other_expenses)
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
    header: 'Opening Cost as on April 1',
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
    header: 'Opening Value as on April 1',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.opening_value;
      const pct = row.percentages?.opening_value;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'closing_value',
    header: 'Holding Value as on ' + date,
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
  {
    accessorKey: 'irr',
    header: 'XIRR',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.irr;
      return val ? `${val}%` : '0.00%';
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
    header: 'Holding Value as on ' + date,
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
    accessorKey: 'irr',
    header: 'XIRR',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.irr;
      return val ? `${val}%` : '0.00%';
    }
  },
];

const expensesColumns = [
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
    accessorKey: 'stamp_duty',
    header: 'Stamp Duty',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.stamp_duty || '0';
      const pct = row.percentages?.stamp_duty;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'stt_paid',
    header: 'STT Paid',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.stt_paid || '0';
      const pct = row.percentages?.stt_paid;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
  {
    accessorKey: 'other_expenses',
    header: 'Other Expenses',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.other_expenses || '0';
      const pct = row.percentages?.other_expenses;
      return pct ? `${val} (${pct.toFixed(2)}%)` : val;
    }
  },
];

const gainColumns = [
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
  {
    accessorKey: 'irr',
    header: 'XIRR',
    renderCell: (row: GroupedRow) => {
      const val = row.row?.irr;
      return val ? `${val}%` : '0.00%';
    }
  },
];

// Inline Shadcn UI Table components (simplified for direct use without imports)
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className = "relative">
    <EllipsisVerticalIcon
        data-tooltip-id="BCTooltip"
        data-tooltip-content="Download Overview Table"
        data-tooltip-place="top"
        data-tooltip-float
        className="absolute top-1 sm:top-3 left-1 sm:left-3 h-5 w-5  stroke-white/50 hover:stroke-white/80 z-20 transition-colors duration-200 border border-none focus:outline-none"  
        onClick={() => download('Total')}
      />
    <table id="Total" className="min-w-full rounded-lg overflow-y-scroll scroll-smooth bg-transparent backdrop-blur-md ">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className={`bg-white/5 text-white/50 text-sm`}>{children}</thead>
);
const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className=" divide-y divide-white/10">{children}</tbody>
);
const TableRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <tr className={`${className} ${grayText2}`}>{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className={`px-6 py-3 text-center text-sm text-white/60 font-medium ${grayText2} `}>
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
  var columns : any  = holdingsColumns;
  if(mode === "Performance")columns = performanceColumns
  else if (mode===  "Expenses") columns = expensesColumns 
  else if (mode ===  "Gain") columns = gainColumns
  // Process data when it changes
  useEffect(() => {
    try {
      setIsLoading(true);
      console.log('GroupedDataTable - Mode:', mode);
      console.log('GroupedDataTable - Data:', data);
      const processedData = groupData(data);
      console.log('GroupedDataTable - Processed Data:', processedData);
      
      // Get XIRR values using the same method as charts and SubTable
      const assetTypeXIRR = groupBy(data, 'asset_type');
      const strategyXIRR = groupBy(data, 'strategy');
      const substrategyXIRR = groupBy(data, 'substrategy');
      
      // Update XIRR values in the processed data
      processedData.forEach(row => {
        if (row.level === 0) {
          // Asset type level
          const xirrData = assetTypeXIRR.find(item => item.asset_type === row.label);
          if (xirrData && row.row) {
            row.row.irr = Number(xirrData.xirr || 0).toFixed(2);
          }
        } else if (row.level === 1) {
          // Strategy level
          const xirrData = strategyXIRR.find(item => item.strategy === row.label);
          if (xirrData && row.row) {
            row.row.irr = Number(xirrData.xirr || 0).toFixed(2);
          }
        } else if (row.level === 2) {
          // Substrategy level
          const xirrData = substrategyXIRR.find(item => item.substrategy === row.label);
          if (xirrData && row.row) {
            row.row.irr = Number(xirrData.xirr || 0).toFixed(2);
          }
        }
      });
      
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
                    {columns.map((column : any, index : any) => (
                        <TableHead key={index}>{column.header}</TableHead>
                    ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {groupedRows.map((row, index) => {
                    if (!isRowVisible(row, index)) return null;
                    
                    console.log('Rendering row:', row.label, 'Mode:', mode, 'Level:', row.level);
                    
                    return (
                        <TableRow
                        key={row.key}
                        className={`
                            ${row.level === 0 ? 'bg-white/10 hover:bg-white/20' :
                            row.level === 1 ? 'bg-white/5 hover:bg-white/20' :
                            row.level === 2 ? 'bg-white/0 hover:bg-white/20' :
                            'bg-gray-50 hover:bg-gray-100'}
                            transition-colors duration-500 shadow-none ${grayText2}
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

                        {columns.slice(1).map((column : any, colIndex : any) => (
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
            
            <ScrollBar orientation="horizontal" className="bg-black/50 first:bg-gray-500"/>
        </ScrollArea>
        </div>
    
    </div>
  );
};
 
// components/ui/data-table.tsx
// import { groupBy } from '../Utilities/filterFunction';

interface DataTableProps{
  ogdata: DataItem[];
  groupByField: any;
  mode?: string;
  setFilters?: any;
  setIsISINTableVisible: any;
  isISINTableVisible: boolean;
}

type GroupedDataItem = {
  [key: string]: string | number;
  sumOfClosingCosts: number;
  sumOfClosingValue: number;
  sumOfUnrealizedGain: number;
  sumOfOpeningCost: number;
  sumOfRealizedGain: number;
  sumOfOpeningValue: number;
  sumOfOtherExpenses: number;
  sumOfStampDuty: number;
  sumOfSttPaid: number;
};

function SubTable({ogdata, groupByField, mode = "Holding Value", setFilters, setIsISINTableVisible, isISINTableVisible}: DataTableProps) {
  
  const data = groupBy(ogdata, groupByField) as GroupedDataItem[];
  // console.log(data)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Define headers based on mode
  const getHeaders = () => {
    if (mode === "Performance") {
      return [
        "Name",
        "Opening Cost as on April 1",
        "Invested Amount" + " as on " + date,
        "Opening Value as on April 1",
        "Holding Value" + " as on " + date,
        "Unrealized Gain",
        "Realized Gain",
        "Total Gain",
        "Gain %",
        "XIRR"
      ];
    } else if (mode === "Expenses") {
      return [
        "Name",
        "Stamp Duty",
        "STT Paid",
        "Other Expenses"
      ];
    } else if (mode === "Gain") {
      return [
        "Name",
        "Realised Gain",
        "Short Realised Gains",
        "Long Realised Gains",
        "Total Gain",
        "Cost Basis",
        "Dividends"
      ];
    } else {
      return [
        "Name",
        "Invested Amount" + " as on " + date ,
        "Holding Value" + " as on " + date,
        "Unrealized Gain",
        "Gain %",
        "XIRR"
      ];
    }
  };

  const headers = getHeaders();

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
      <EllipsisVerticalIcon 
        data-tooltip-id="BCTooltip"
        data-tooltip-content="Download Table"
        data-tooltip-place="top"
        data-tooltip-float
      className="fixed left-10 top-10 stroke-white/50 hover:stroke-white/80 z-20 transition-colors duration-200" 
      onClick={() => download(groupByField)}/>
        <table id={groupByField} className="w-full border-collapse text-gray">
          <thead>
            <tr className="bg-white/5 backdrop-blur-md">
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-center text-sm text-white/80 font-medium ">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item, index) => {
              const closingCosts = Number(item.sumOfClosingCosts);
              const closingValue = Number(item.sumOfClosingValue);
              const unrealizedGain = Number(item.sumOfUnrealizedGain);
              const openingCost = Number(item.sumOfOpeningCost || 0);
              const openingValue = Number(item.sumOfOpeningValue || 0);
              const realizedGain = Number(item.sumOfRealizedGain || 0);
              const totalGain = unrealizedGain + realizedGain;
              const gainPercentage = closingCosts !== 0 
                ? (unrealizedGain / closingCosts) * 100 
                : 0;
              const stampDuty = Number(item.sumOfStampDuty || 0);
              const sttPaid = Number(item.sumOfSttPaid || 0);
              const otherExpenses = Number(item.sumOfOtherExpenses || 0);

              // GAIN MODE
              if (mode === "Gain") {
                return (
                  <tr 
                    key={index}
                    className="bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-left text-white/60 cursor-pointer hover:underline"
                        onClick={() => setFilters && filterUpdate(setFilters, groupByField, String(item[groupByField]) , setIsISINTableVisible, isISINTableVisible )}
                    >
                      {String(item[groupByField])}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {realizedGain.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {Number(item.sumOfShortRealizedGains || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {Number(item.sumOfLongRealizedGains || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {totalGain.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {Number(item.sumOfCostBasis || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {Number(item.sumOfDividends || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              }

              if (mode === "Performance") {
                return (
                  <tr 
                    key={index}
                    className="bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-200"
                  >
                    <td 
                      className="px-6 py-4 text-sm text-left text-white/60 cursor-pointer hover:underline"
                      onClick={() => setFilters && filterUpdate(setFilters, groupByField, String(item[groupByField]) , setIsISINTableVisible, isISINTableVisible)}
                    >
                      {String(item[groupByField])}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(openingCost)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(closingCosts)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(openingValue)} {/* Opening Value - using opening cost as placeholder */}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(closingValue)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60 font-medium`}>
                      {formatCurrency(unrealizedGain)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60 font-medium`}>
                      {formatCurrency(realizedGain)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60 font-medium`}>
                      {formatCurrency(totalGain)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60 font-medium`}>
                      {gainPercentage.toFixed(2)}%
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60 font-medium`}>
                      {Number(item.xirr || 0).toFixed(2)}%
                    </td>
                  </tr>
                );
              } 
              
              else if (mode === "Expenses") {
                return (
                  <tr 
                    key={index}
                    className="bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-200"
                  >
                    <td 
                      className="px-6 py-4 text-sm text-left text-white/60 cursor-pointer hover:underline"
                      onClick={() => setFilters && filterUpdate(setFilters, groupByField, String(item[groupByField]) , setIsISINTableVisible, isISINTableVisible    )}
                    >
                      {String(item[groupByField])}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(stampDuty)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(sttPaid)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(otherExpenses)}
                    </td>
                  </tr>
                );
              } 
              
              else {
                return (
                  <tr 
                    key={index}
                    className="bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-200"
                  >
                    <td 
                      className="px-6 py-4 text-sm text-left text-white/60 cursor-pointer hover:underline"
                      onClick={() => setFilters && filterUpdate(setFilters, groupByField, String(item[groupByField]) , setIsISINTableVisible, isISINTableVisible)}
                    >
                      {String(item[groupByField])}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(closingCosts)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60">
                      {formatCurrency(closingValue)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60 `}>
                      {formatCurrency(unrealizedGain)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60`}>
                      {gainPercentage.toFixed(2)}%
                    </td>
                    <td className={`px-6 py-4 text-sm text-center text-white/60`}>
                      {Number(item.xirr || 0).toFixed(2)}%
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
    </div>
  );
}

export {GroupedDataTable, SubTable}


const ISINLevelView = ({ data, mode = "Holdings Value", setIsISINTableVisible, isISINTableVisible }: { data: DataItem[], mode?: string, setIsISINTableVisible: any, isISINTableVisible: boolean }) => {
    const formatNumber = (value: string | number | null | undefined) => {
        if (value === null || value === undefined) return '';
        const num = Number(value);
        if (isNaN(num)) return value?.toString() || '';
        return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    };
    const formatCurrency = (value: string | number | null | undefined) => {
        return "₹" + formatNumber(value);
    };
    
    const modeConfig: Record<string, {
        headers: string[],
        renderRow: (item: any) => React.ReactNode
    }> = {
        "Holdings Value": {
            headers: ["Name", "Market Price", "Closing Cost as on " + date, "Closing Value as on " + date , "Unrealised Gain", "IRR"],
            renderRow: (item) => (
                <>
                    <td className="px-6 py-4 text-sm text-left text-white/60 bg-white/5 border-b border-white/10">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.market_price)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.closing_cost)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.closing_value)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.unrealized_gain)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatNumber(item.irr)}</td>
                </>
            )
        },
        "Expenses": {
            headers: ["Name", "Stamp Duty", "STT Paid", "Other Expenses"],
            renderRow: (item) => (
                <>
                    <td className="px-6 py-4 text-sm text-left text-white/60 bg-white/5 border-b border-white/10">
                        {item.securityname || item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">
                        {formatCurrency(item.stamp_duty)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">
                        {formatCurrency(item.stt_paid)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">
                        {formatCurrency(item.other_expenses)}
                    </td>
                </>
            )
        },
        "Performance": {
            headers: [
                "Name", "Opening Cost as on April 1", "Closing Cost as on " + date, "Opening Value as on April 1", "Closing Value as on " + date,
                "Market Price", "Current Price", "Realised Gain", "Unrealised Gain", "Total Gain", "IRR"
            ],
            renderRow: (item) => (
                <>
                    <td className="px-6 py-4 text-sm text-left text-white/60 bg-white/5 border-b border-white/10">{item.securityname || item.name}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.opening_cost)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.closing_cost)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.opening_value)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.closing_value)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.market_price)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.current_price)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.realized_gain)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.unrealized_gain)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.total_gain)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatNumber(item.irr)}</td>
                </>
            )
        },
        "Gain": {
            headers: [
                "Name", "Realized Gains", "Realized Gains (L)", "Realized Gains (S)", "STT", "Cost Basis", "Dividends"
            ],
            renderRow: (item) => (
                <>
                    <td className="px-6 py-4 text-sm text-left text-white/60 bg-white/5 border-b border-white/10">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.realized_gains)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.long_realized_gains)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.short_realized_gains)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.stt)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.costbasis)}</td>
                    <td className="px-6 py-4 text-sm text-center text-white/60 bg-white/5 border-b border-white/10">{formatCurrency(item.dividends)}</td>
                </>
            )
        }
    };

    // const config = modeConfig[mode] || modeConfig["Holdings Value"];

    // const [config, setConfigs] = useState(modeConfig[mode] || modeConfig["Holdings Value"]);
    const config = modeConfig[mode] || modeConfig["Holdings Value"];
    // console.log("Isin", mode);

    // useEffect(() => {
    //   setConfigs(modeConfig[mode] || modeConfig["Holdings Value"]);
    // }, [mode]);

    return (
        <div className={`w-full h-full shadow-md p-2 ${glass}`}>
            <div className={`flex justify-between items-center py-2 rounded-2xl `}>
                <div onClick={() => download("all_data")} className='cursor-pointer p-2 rounded-md'>
                    <EllipsisVerticalIcon size={20} 
                    data-tooltip-id="BCTooltip"
                    data-tooltip-content="Download Table"
                    data-tooltip-place="top"
                    data-tooltip-float
                    className  ="stroke-white/50 hover:stroke-white/80"
                    />
                </div>
                <X
                  data-tooltip-id="BCTooltip"
                  data-tooltip-content="Close ISIN Table"
                  data-tooltip-place="top"
                  data-tooltip-float
                  className={`${responsiveIcon} z-50`}
                  onClick={() => setIsISINTableVisible(!isISINTableVisible)}
                />
            </div>
            <ScrollArea className="z-50 w-full h-[600px] pb-2">
                <table className="w-full border-collapse text-gray backdrop-blur-lg rounded-lg" id="all_data">
                    <thead>
                        <tr className="bg-emerald transition-colors duration-200 sticky top-0"
                        >
                            {config.headers.map((header) => (
                                <th
                                    key={header}
                                    className={`px-6 py-2 text-sm text-center border-b border-white/10`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={mode + '-' + String(item.isin || item.name || index) + index}
                                className="hover:bg-white/10 transition-colors text-center border-b border-white/10"
                            >
                                {config.renderRow(item)}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export { ISINLevelView };
 
