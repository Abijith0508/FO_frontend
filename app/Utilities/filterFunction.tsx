import { xirr, Cashflow } from './xirr';

interface DataItem {
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
  opening_cost: string;
  realized_gain: string;
  opening_value: string;
  cashflows: string[];
  dates: string[];
  other_expenses: string;
  stamp_duty: string;
  stt_paid: string;
}

function groupBy(
  data: any[],
  criterion: keyof DataItem | null
): {
  [key: string]: string | number;
}[] {
  if (criterion === null) {
    // When criterion is null, return the sums of the entire dataset
    const totalSums = data.reduce(
      (acc, item) => {
        acc.sumOfClosingCosts += parseFloat(item.closing_cost) || 0;
        acc.sumOfUnrealizedGain += parseFloat(item.unrealized_gain) || 0;
        acc.sumOfClosingValue += parseFloat(item.closing_value) || 0;
        acc.sumOfOpeningCost += parseFloat(item.opening_cost) || 0;
        acc.sumOfRealizedGain += parseFloat(item.realized_gain) || 0;
        acc.sumOfOpeningValue += parseFloat(item.opening_value) || 0;
        acc.sumOfOtherExpenses += parseFloat(item.other_expenses) || 0;
        acc.sumOfStampDuty += parseFloat(item.stamp_duty) || 0;
        acc.sumOfSttPaid += parseFloat(item.stt_paid) || 0;
        return acc;
      },
      {
        sumOfClosingCosts: 0,
        sumOfUnrealizedGain: 0,
        sumOfClosingValue: 0,
        sumOfOpeningCost: 0,
        sumOfRealizedGain: 0,
        sumOfOpeningValue: 0,
        sumOfOtherExpenses: 0,
        sumOfStampDuty: 0,
        sumOfSttPaid: 0,
      }
    );

    // Calculate XIRR for all data combined
    let combinedXIRR = 0;
    try {
      const allCashflows: Cashflow[] = [];
      data.forEach(item => {
        if (item.cashflows && item.dates) {
          item.cashflows.forEach((cashflow: string, index: number) => {
            allCashflows.push({
              amount: parseFloat(cashflow),
              date: new Date(item.dates[index])
            });
          });
        }
      });
      if (allCashflows.length > 1) {
        combinedXIRR = xirr(allCashflows) * 100; // Convert to percentage
      }
    } catch (error) {
      console.warn('Error calculating combined XIRR:', error);
      combinedXIRR = 0;
    }

    return [
      { 
        sumOfClosingValue: totalSums.sumOfClosingValue,
        sumOfClosingCosts: totalSums.sumOfClosingCosts,
        sumOfUnrealizedGain: totalSums.sumOfUnrealizedGain,
        sumOfOpeningCost: totalSums.sumOfOpeningCost,
        sumOfRealizedGain: totalSums.sumOfRealizedGain,
        sumOfOpeningValue: totalSums.sumOfOpeningValue,
        sumOfOtherExpenses: totalSums.sumOfOtherExpenses,
        sumOfStampDuty: totalSums.sumOfStampDuty,
        sumOfSttPaid: totalSums.sumOfSttPaid,
        xirr: combinedXIRR,
      },
    ];
  }

  const grouped: { 
    [key: string]: { 
      sumOfClosingCosts: number; 
      sumOfUnrealizedGain: number; 
      sumOfClosingValue: number;
      sumOfOpeningCost: number;
      sumOfRealizedGain: number;
      sumOfOpeningValue: number;
      sumOfOtherExpenses: number;
      sumOfStampDuty: number;
      sumOfSttPaid: number;
      cashflows: string[];
      dates: string[];
    } 
  } = {};

  data.forEach((item) => {
    const key = String(item[criterion]);  // Ensure key is a string
    
    const closingValue = parseFloat(item.closing_value) || 0;
    const closingCost = parseFloat(item.closing_cost) || 0;
    const unrealizedGain = parseFloat(item.unrealized_gain) || 0;
    const openingCost = parseFloat(item.opening_cost) || 0;
    const realizedGain = parseFloat(item.realized_gain) || 0;
    const openingValue = parseFloat(item.opening_value) || 0;
    const otherExpenses = parseFloat(item.other_expenses) || 0;
    const stampDuty = parseFloat(item.stamp_duty) || 0;
    const sttPaid = parseFloat(item.stt_paid) || 0;

    if (!grouped[key]) {
      grouped[key] = {
        sumOfClosingCosts: 0,
        sumOfUnrealizedGain: 0,
        sumOfClosingValue: 0,
        sumOfOpeningCost: 0,
        sumOfRealizedGain: 0,
        sumOfOpeningValue: 0,
        sumOfOtherExpenses: 0,
        sumOfStampDuty: 0,
        sumOfSttPaid: 0,
        cashflows: [],
        dates: []
      };
    }

    grouped[key].sumOfClosingCosts += closingCost;
    grouped[key].sumOfUnrealizedGain += unrealizedGain;
    grouped[key].sumOfClosingValue += closingValue;
    grouped[key].sumOfOpeningCost += openingCost;
    grouped[key].sumOfRealizedGain += realizedGain;
    grouped[key].sumOfOpeningValue += openingValue;
    grouped[key].sumOfOtherExpenses += otherExpenses;
    grouped[key].sumOfStampDuty += stampDuty;
    grouped[key].sumOfSttPaid += sttPaid;

    // Append cashflows and dates
    if (item.cashflows && item.dates) {
      grouped[key].cashflows.push(...item.cashflows);
      grouped[key].dates.push(...item.dates);
    }
  });

  return Object.entries(grouped).map(([groupValue, values]) => {
    // Calculate XIRR for this group
    let groupXIRR = 0;
    try {
      const cashflows: Cashflow[] = [];
      values.cashflows.forEach((cashflow, index) => {
        cashflows.push({
          amount: parseFloat(cashflow),
          date: new Date(values.dates[index])
        });
      });
      if (cashflows.length > 1) {
        groupXIRR = xirr(cashflows) * 100; // Convert to percentage
      }
    } catch (error) {
      console.warn(`Error calculating XIRR for group ${groupValue}:`, error);
      groupXIRR = 0;
    }
    const obj ={
      [criterion]: groupValue,
      sumOfClosingValue: values.sumOfClosingValue,
      sumOfClosingCosts: values.sumOfClosingCosts,
      sumOfUnrealizedGain: values.sumOfUnrealizedGain,
      sumOfOpeningCost: values.sumOfOpeningCost,
      sumOfRealizedGain: values.sumOfRealizedGain,
      sumOfOpeningValue: values.sumOfOpeningValue,
      sumOfOtherExpenses: values.sumOfOtherExpenses,
      sumOfStampDuty: values.sumOfStampDuty,
      sumOfSttPaid: values.sumOfSttPaid,
      xirr: groupXIRR,
    };
    // console.log(obj)
    return obj;
  });
}

const filterUpdate = (
  setFilters: React.Dispatch<React.SetStateAction<string[]>>, 
  groupByField: string, 
  value: string
) => {
  const newFilter = `${groupByField}:${value}`;

  // Add the new filter if it's not already present (to avoid duplicates)
  setFilters((prevFilters: string[]) => {
    if (prevFilters.length == 0) return [newFilter]
    if (prevFilters.includes(newFilter)) {
      return prevFilters; // no change
    }
    return [...prevFilters, newFilter];
  });
};

const filterFunction = (data: DataItem[], filters: string[]): DataItem[] => {
  // alert('filter')
  return data.filter((item) => {
    return filters.every((filter) => {
      const [group, value] = filter.split(':');
      return String(item[group as keyof DataItem]) === value;
    });
  });
};

export { filterFunction, groupBy, filterUpdate };
