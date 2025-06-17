type Cashflow = { amount: number; date: Date };

const xnpv = (rate: number, cashflows: Cashflow[]): number => {
  const t0 = cashflows[0].date.getTime();
  return cashflows.reduce((acc, { amount, date }) => {
    const days = (date.getTime() - t0) / (1000 * 60 * 60 * 24);
    return acc + amount / Math.pow(1 + rate, days / 365);
  }, 0);
};

const xirr = (
  cashflows: Cashflow[],
  guess = 0.1,
  maxIter = 200,
  tol = 1e-4
): number => {
  // Validate input
  if (!cashflows || cashflows.length < 2) throw new Error("Need at least 2 cashflows");

  // Sort cashflows by date
  cashflows.sort((a, b) => a.date.getTime() - b.date.getTime());

  const hasPositive = cashflows.some((c) => c.amount > 0);
  const hasNegative = cashflows.some((c) => c.amount < 0);
  if (!hasPositive || !hasNegative) throw new Error("XIRR requires at least one positive and one negative cashflow");

  // Calculate total inflows and outflows
  const totalInflow = cashflows.filter(c => c.amount > 0).reduce((sum, c) => sum + c.amount, 0);
  const totalOutflow = Math.abs(cashflows.filter(c => c.amount < 0).reduce((sum, c) => sum + c.amount, 0));

  // If total outflow is much larger than inflow, adjust initial guess
  if (totalOutflow > totalInflow * 2) {
    guess = 0.2; // Higher guess for larger outflows
  }

  // Dynamic bounds based on behavior
  let low = -0.9999;
  let high = 10;
  let fLow = xnpv(low, cashflows);
  let fHigh = xnpv(high, cashflows);

  if (fLow * fHigh > 0) {
    // Try wider bounds
    low = -0.9999;
    high = 100;
    fLow = xnpv(low, cashflows);
    fHigh = xnpv(high, cashflows);
   
    if (fLow * fHigh > 0) {
      throw new Error("XIRR root is not bracketed — try wider bounds.");
    }
  }

  // Binary search with improved convergence
  let mid = guess;
  let fMid = xnpv(mid, cashflows);
  let lastMid = mid;
  let lastFMid = fMid;

  for (let i = 0; i < maxIter; i++) {
    if (Math.abs(fMid) < tol) {
      return mid;
    }

    if (fLow * fMid < 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }

    lastMid = mid;
    lastFMid = fMid;
    mid = (low + high) / 2;
    fMid = xnpv(mid, cashflows);

    // Check for convergence
    if (Math.abs(mid - lastMid) < tol * 0.1) {
      return mid;
    }
  }

  // If we get here, return the best guess
  if (Math.abs(fMid) < Math.abs(lastFMid)) {
    return mid;
  }
  return lastMid;
};

export { xirr };
export type { Cashflow };