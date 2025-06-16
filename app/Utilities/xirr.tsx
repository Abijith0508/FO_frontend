function xirr(cashflows: number[], dates: Date[]): number {
  const tol = 1e-6;
  const maxIter = 1000;

  // Function to calculate NPV based on a given rate
  function npv(rate: number): number {
    return cashflows.reduce((acc, cf, i) => {
      const days = (dates[i].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
      return acc + cf / Math.pow(1 + rate, days / 365);
    }, 0);
  }

  // Newton-Raphson method to find the root
  function newtonRaphson(f: (r: number) => number, guess: number): number {
    let rate = guess;
    for (let i = 0; i < maxIter; i++) {
      const fValue = f(rate);
      const fDerivative = (f(rate + tol) - fValue) / tol;

      if (Math.abs(fValue) < tol) {
        return rate;
      }

      rate -= fValue / fDerivative;
    }
    throw new Error("Newton-Raphson method did not converge");
  }

  try {
    return newtonRaphson(npv, 0.1);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export default xirr;