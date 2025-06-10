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
}

function groupBy(
  data: DataItem[],
  criterion: keyof DataItem,
): {
  [key: string]: string | number;
}[] {
  const grouped: { [key: string]: { sumOfClosingCosts: number; sumOfUnrealizedGain: number, sumOfClosingValue: number } } = {};

  data.forEach((item) => {
    const key = String(item[criterion]);  // 🔧 Fix: Ensure key is a stringc
    
    const closingValue = parseFloat(item.closing_value) || 0;
    const closingCost = parseFloat(item.closing_cost) || 0;
    const unrealizedGain = parseFloat(item.unrealized_gain) || 0;

    if (!grouped[key]) {
      grouped[key] = {
        sumOfClosingCosts: 0,
        sumOfUnrealizedGain: 0,
        sumOfClosingValue: 0
      };
    }

    grouped[key].sumOfClosingCosts += closingCost;
    grouped[key].sumOfUnrealizedGain += unrealizedGain;
    grouped[key].sumOfClosingValue += closingValue;

  });

  return Object.entries(grouped).map(([groupValue, values]) => ({
    [criterion]: groupValue,
    sumOfClosingValue: values.sumOfClosingValue,
    sumOfClosingCosts: values.sumOfClosingCosts,
    sumOfUnrealizedGain: values.sumOfUnrealizedGain,
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
