import { xirr, Cashflow } from './xirr';
import DataItem from './dataItem';

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
        acc.sumOfRealizedGain += parseFloat(item.realized_gains) || 0;
        acc.sumOfOpeningValue += parseFloat(item.opening_value) || 0;
        acc.sumOfOtherExpenses += parseFloat(item.other_expenses) || 0;
        acc.sumOfStampDuty += parseFloat(item.stamp_duty) || 0;
        acc.sumOfSttPaid += parseFloat(item.stt_paid) || 0;
        acc.sumOfDividends += parseFloat(item.dividends) || 0;
        acc.sumOfCostBasis += parseFloat(item.costbasis) || 0;
        acc.sumOfLongRealizedGains += parseFloat(item.long_realized_gains) || 0;
        acc.sumOfShortRealizedGains += parseFloat(item.short_realized_gains) || 0;
        acc.sumOfStt += parseFloat(item.stt) || 0;
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
        sumOfDividends: 0,
        sumOfCostBasis: 0,
        sumOfLongRealizedGains: 0,
        sumOfShortRealizedGains: 0,
        sumOfStt: 0,
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
        sumOfDividends: totalSums.sumOfDividends,
        sumOfCostBasis: totalSums.sumOfCostBasis,
        sumOfLongRealizedGains: totalSums.sumOfLongRealizedGains,
        sumOfShortRealizedGains: totalSums.sumOfShortRealizedGains,
        sumOfStt: totalSums.sumOfStt,
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
      sumOfDividends: number;
      cashflows: string[];
      dates: string[];
      sumOfCostBasis: number;
      sumOfLongRealizedGains: number;
      sumOfShortRealizedGains: number;
      sumOfStt: number;
    } 
  } = {};

  data.forEach((item) => {
    const key = String(item[criterion]);  // Ensure key is a string
    
    const closingValue = parseFloat(item.closing_value) || 0;
    const closingCost = parseFloat(item.closing_cost) || 0;
    const unrealizedGain = parseFloat(item.unrealized_gain) || 0;
    const openingCost = parseFloat(item.opening_cost) || 0;
    const realizedGain = parseFloat(item.realized_gains) || 0;
    const openingValue = parseFloat(item.opening_value) || 0;
    const otherExpenses = parseFloat(item.other_expenses) || 0;
    const stampDuty = parseFloat(item.stamp_duty) || 0;
    const sttPaid = parseFloat(item.stt_paid) || 0;
    const costBasis = parseFloat(item.costbasis) || 0;
    const longRealizedGains = parseFloat(item.long_realized_gains) || 0;
    const shortRealizedGains = parseFloat(item.short_realized_gains) || 0;
    const stt = parseFloat(item.stt) || 0;
    const dividends = parseFloat(item.dividends) || 0;

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
        sumOfDividends: 0,
        cashflows: [],
        dates: [],
        sumOfCostBasis: 0,
        sumOfLongRealizedGains: 0,
        sumOfShortRealizedGains: 0,
        sumOfStt: 0,
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
    grouped[key].sumOfDividends += dividends;
    grouped[key].sumOfCostBasis += costBasis;
    grouped[key].sumOfLongRealizedGains += longRealizedGains;
    grouped[key].sumOfShortRealizedGains += shortRealizedGains;
    grouped[key].sumOfStt += stt;

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
      sumOfDividends: values.sumOfDividends,
      xirr: groupXIRR,
      sumOfCostBasis: values.sumOfCostBasis,
      sumOfLongRealizedGains: values.sumOfLongRealizedGains,
      sumOfShortRealizedGains: values.sumOfShortRealizedGains,
      sumOfStt: values.sumOfStt,
    };
    // console.log(obj)
    return obj;
  });
}


const filterUpdate = (
  setFilters: React.Dispatch<React.SetStateAction<string[]>>, 
  groupByField: string, 
  value: string,
  setisISINTableVisible: any,
  isISINTableVisible: boolean
) => {
  const newFilter = `${groupByField}:${value}`;

  setFilters((prevFilters: string[]) => {
    const alreadyGrouped = prevFilters.some(filter => filter.startsWith(`${groupByField}:`));
    if (alreadyGrouped) {
      setisISINTableVisible(!isISINTableVisible); 
      return prevFilters;
    }
    return [...prevFilters, newFilter];
  });
};

/**
 * Creates a time filter in the format "Time:fromYear-toYear"
 * @param fromYear - Starting year of the financial year
 * @param toYear - Ending year of the financial year
 * @returns Time filter string
 */
const createTimeFilter = (fromYear: number, toYear: number): string => {
  return `Time:${fromYear}-${toYear}`;
};

/**
 * Updates filters with a time filter, replacing any existing time filter
 * @param setFilters - Function to update filters
 * @param fromYear - Starting year of the financial year
 * @param toYear - Ending year of the financial year
 */
const updateTimeFilter = (
  setFilters: React.Dispatch<React.SetStateAction<string[]>>,
  fromYear: number,
  toYear: number
) => {
  const newTimeFilter = createTimeFilter(fromYear, toYear);
  
  setFilters((prevFilters: string[]) => {
    // Remove any existing time filter
    const filtersWithoutTime = prevFilters.filter(filter => !filter.startsWith('Time:'));
    // Add the new time filter
    return [...filtersWithoutTime, newTimeFilter];
  });
};

const filterFunction = (data: DataItem[], filters: string[]): DataItem[] => {
  return data.filter((item) => {
    return filters.every((filter) => {
      const [group, value] = filter.split(':');
      
      // Handle time-based filtering
      if (group === 'Time') {
        const [fromYear, toYear] = value.split('-').map(Number);
        if (!fromYear || !toYear || !item.tran_date) return false;
        
        try {
          // Create date range for financial year (April 1st fromYear to March 31st toYear)
          const startDate = new Date(fromYear, 3, 1); // April 1st (month is 0-indexed, so 3 = April)
          const endDate = new Date(toYear, 2, 31, 23, 59, 59, 999); // March 31st (month is 0-indexed, so 2 = March)
          
          const transactionDate = new Date(item.tran_date);
          return transactionDate >= startDate && transactionDate <= endDate;
        } catch (error) {
          console.warn('Invalid transaction date format:', item.tran_date);
          return false;
        }
      }
      
      // Handle regular field filtering
      return String(item[group as keyof DataItem]) === value;
    });
  });
};


const filterExpenseByFinancialYear = (expenseData: DataItem[],filters: string[] , fromYear: number, toYear: number): DataItem[] => {
  // Create date range for financial year (April 1st fromYear to March 31st toYear)
  const startDate = new Date(fromYear, 3, 1); // April 1st (month is 0-indexed, so 3 = April)
  const endDate = new Date(toYear, 2, 31, 23, 59, 59, 999); // March 31st (month is 0-indexed, so 2 = March)

  return expenseData.filter((item) => {
    if (!item.tran_date) return false;
    
    try {
      const transactionDate = new Date(item.tran_date);
      return transactionDate >= startDate && transactionDate <= endDate;
    } catch (error) {
      console.warn('Invalid transaction date format:', item.tran_date);
      return false;
    }
  });
};

const filterExpenseByDateRange = (expenseData: DataItem[], startDate: Date, endDate: Date): DataItem[] => {
  return expenseData.filter((item) => {
    if (!item.tran_date) return false;
    
    try {
      const transactionDate = new Date(item.tran_date);
      
      // Check if the transaction date falls within the specified range
      return transactionDate >= startDate && transactionDate <= endDate;
    } catch (error) {
      console.warn('Invalid transaction date format:', item.tran_date);
      return false;
    }
  });
};

const getCurrentFinancialYear = (): { fromYear: number; toYear: number } => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed
  
  // If current month is January to March, financial year is previous year to current year
  // If current month is April to December, financial year is current year to next year
  if (currentMonth < 3) { // January (0), February (1), March (2)
    return {
      fromYear: currentYear - 1,
      toYear: currentYear
    };
  } else { // April (3) to December (11)
    return {
      fromYear: currentYear,
      toYear: currentYear + 1
    };
  }
};

export { filterFunction, groupBy, filterUpdate, filterExpenseByFinancialYear, filterExpenseByDateRange, getCurrentFinancialYear, createTimeFilter, updateTimeFilter };
