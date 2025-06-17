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
        return acc;
      },
      {
        sumOfClosingCosts: 0,
        sumOfUnrealizedGain: 0,
        sumOfClosingValue: 0,
        sumOfOpeningCost: 0,
        sumOfRealizedGain: 0,
        sumOfOpeningValue: 0,
      }
    );

    return [
      { 
        sumOfClosingValue: totalSums.sumOfClosingValue,
        sumOfClosingCosts: totalSums.sumOfClosingCosts,
        sumOfUnrealizedGain: totalSums.sumOfUnrealizedGain,
        sumOfOpeningCost: totalSums.sumOfOpeningCost,
        sumOfRealizedGain: totalSums.sumOfRealizedGain,
        sumOfOpeningValue: totalSums.sumOfOpeningValue,
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

    if (!grouped[key]) {
      grouped[key] = {
        sumOfClosingCosts: 0,
        sumOfUnrealizedGain: 0,
        sumOfClosingValue: 0,
        sumOfOpeningCost: 0,
        sumOfRealizedGain: 0,
        sumOfOpeningValue: 0
      };
    }

    grouped[key].sumOfClosingCosts += closingCost;
    grouped[key].sumOfUnrealizedGain += unrealizedGain;
    grouped[key].sumOfClosingValue += closingValue;
    grouped[key].sumOfOpeningCost += openingCost;
    grouped[key].sumOfRealizedGain += realizedGain;
    grouped[key].sumOfOpeningValue += openingValue;
  });

  return Object.entries(grouped).map(([groupValue, values]) => ({
    [criterion]: groupValue,
    sumOfClosingValue: values.sumOfClosingValue,
    sumOfClosingCosts: values.sumOfClosingCosts,
    sumOfUnrealizedGain: values.sumOfUnrealizedGain,
    sumOfOpeningCost: values.sumOfOpeningCost,
    sumOfRealizedGain: values.sumOfRealizedGain,
    sumOfOpeningValue: values.sumOfOpeningValue,
  }));
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
