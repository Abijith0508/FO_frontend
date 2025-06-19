import DashBoardComp from "../Components/DashBoardComp";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

// Module-level cache to prevent multiple fetches
let cachedData: { holdData: any; perfData: any, expData: any, gainData: any } | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to clear cache and force refresh
export function clearCache() {
    cachedData = null;
    cacheTimestamp = 0;
    console.log('Cache cleared');
}

// Function to check cache status (for debugging)
export function checkCacheStatus() {
    const now = Date.now();
    const timeSinceCache = now - cacheTimestamp;
    const remainingTime = CACHE_DURATION - timeSinceCache;
    
    console.log('Cache Status:', {
        hasCachedData: !!cachedData,
        cacheTimestamp: new Date(cacheTimestamp).toLocaleTimeString(),
        timeSinceCache: Math.round(timeSinceCache / 1000) + 's',
        remainingTime: Math.round(remainingTime / 1000) + 's',
        isExpired: remainingTime <= 0,
        nextRefresh: new Date(cacheTimestamp + CACHE_DURATION).toLocaleTimeString()
    });
    
    return {
        hasCachedData: !!cachedData,
        isExpired: remainingTime <= 0,
        remainingTime: Math.round(remainingTime / 1000)
    };
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
    (window as any).clearDashboardCache = clearCache;
    (window as any).checkDashboardCache = checkCacheStatus;
}

// Simple cached fetch function
async function getDashboardData() {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        const remainingTime = Math.round((CACHE_DURATION - (now - cacheTimestamp)) / 1000);
        console.log(`Returning cached dashboard data (${remainingTime}s remaining in cache)`);
        return cachedData;
    }
    
    const timestamp = Date.now(); // Cache busting parameter
    const holdingslink = `http://13.202.119.24/irr/holdingsnew/?t=${timestamp}`;
    const performancelink = `http://13.202.119.24/irr/perfnew/?t=${timestamp}`;
    const expenselink = `http://13.202.119.24/irr/expenses/?t=${timestamp}`;
    const gainLink= `http://10.0.0.199:8096/irr/dashgain/?t=${timestamp}`

    console.log('Cache expired or no cache found. Fetching fresh dashboard data...');
    console.log('Fetch URLs:', { holdingslink, performancelink, expenselink });
    
    try {
        // Fetch both endpoints in parallel
        const [holdingsResponse, performanceResponse, expenseResponse, gainResponse] = await Promise.all([
            fetch(holdingslink, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-cache' // Allow fresh requests but respect cache headers
            }),
            fetch(performancelink, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-cache' // Allow fresh requests but respect cache headers
            }),
            fetch(expenselink, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-cache' // Allow fresh requests but respect cache headers
            }),
            fetch(gainLink, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-cache' // Allow fresh requests but respect cache headers
            })
        ]);
        
        if (!holdingsResponse.ok) {
            throw new Error(`Holdings fetch failed: ${holdingsResponse.status}`);
        }
        
        if (!performanceResponse.ok) {
            throw new Error(`Performance fetch failed: ${performanceResponse.status}`);
        }
        if (!expenseResponse.ok) {
            throw new Error(`Performance fetch failed: ${expenseResponse.status}`);
        }
        if (!gainResponse.ok) {
            throw new Error(`Performance fetch failed: ${gainResponse.status}`);
        }

        const [holdData, perfData, expData, gainData] = await Promise.all([
            holdingsResponse.json(),
            performanceResponse.json(),
            expenseResponse.json(),
            gainResponse.json()
        ]);
        
        // Cache the results
        cachedData = { holdData, perfData, expData, gainData };
        cacheTimestamp = now;
        
        console.log('Dashboard data fetched and cached successfully at:', new Date(now).toLocaleTimeString());
        console.log('Next cache refresh will be at:', new Date(now + CACHE_DURATION).toLocaleTimeString());
        return cachedData;
        
    } catch (error) {
        console.error('Fetch error in getDashboardData:', error);
        throw error;
    }
}

// Loading component
function LoadingComponent() {
    return (
        <div className="flex items-center justify-center h-screen gap-5">
            <p className="text-white/80 text-lg">Fetching data from cloud</p>
            <LoaderCircle className="animate-spin rounded-full h-12 w-12 stroke-secondary"/>
        </div>
    );
}

// Main dashboard component
async function DashboardContent() {
    try {
        console.log('Starting to fetch dashboard data...');
        
        const { holdData, perfData, expData ,  gainData } = await getDashboardData();
        
        // console.log('Fetched data:', { holdData, perfData, expData });
        
        // Check if data exists and has the expected structure
        const hasHoldingsData = holdData && holdData.data && Array.isArray(holdData.data) && holdData.data.length > 0;
        const hasPerformanceData = perfData && perfData.data && Array.isArray(perfData.data) && perfData.data.length > 0;
        const hasExpenseData = expData && expData.data && Array.isArray(expData.data) && expData.data.length > 0;
         
        console.log('Data checks:', { hasHoldingsData, hasPerformanceData, hasExpenseData });
        
            return (        
                <DashBoardComp 
                holdingData={holdData.data} 
                performanceData={perfData.data} 
                expenseData={expData.data} 
                gainData={gainData.data}/>
            );
        // else{
        //     return (
        //         <div className="flex items-center justify-center h-screen gap-5">
        //             <p className="text-white/80 text-lg">No data available</p>
        //         </div>
        //     );
        // }
    } catch (error) {
        console.error('Fetch error:', error);
        
        // Handle abort errors specifically
        if (error instanceof Error && error.name === 'AbortError') {
            return (
                <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>Request Timeout</h2>
                    <p>The server is taking too long to respond. This might be due to:</p>
                    <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                        <li>High server load</li>
                        <li>Network connectivity issues</li>
                        <li>API endpoint maintenance</li>
                    </ul>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{ 
                            padding: '10px 20px', 
                            marginTop: '15px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        
        // Return error state or fallback UI
        return (
            <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Unable to load dashboard data</h2>
                <p>Please try again later or contact support if the problem persists.</p>
                <p style={{ color: 'red', fontSize: '14px' }}>
                    Error: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <button 
                    onClick={() => window.location.reload()} 
                    style={{ 
                        padding: '10px 20px', 
                        marginTop: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }
}

export default function DashBoard() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <DashboardContent />
        </Suspense>
    );
}

