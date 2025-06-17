import DashBoardComp from "../Components/DashBoardComp";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

type Stock = {
  ticker: string;
  name: string;
  sharesOutstanding: number;
};

// Module-level cache to prevent multiple fetches
let cachedData: { holdData: any; perfData: any } | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Simple cached fetch function
async function getDashboardData() {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('Returning cached dashboard data');
        return cachedData;
    }
    
    const holdingslink = "http://13.202.119.24/irr/holdingsnew/";
    const performancelink = "http://13.202.119.24/irr/perfnew/";
    
    console.log('Fetching dashboard data (fresh)...');
    
    try {
        // Fetch both endpoints in parallel
        const [holdingsResponse, performanceResponse] = await Promise.all([
            fetch(holdingslink, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'force-cache'
            }),
            fetch(performancelink, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'force-cache'
            })
        ]);
        
        if (!holdingsResponse.ok) {
            throw new Error(`Holdings fetch failed: ${holdingsResponse.status}`);
        }
        
        if (!performanceResponse.ok) {
            throw new Error(`Performance fetch failed: ${performanceResponse.status}`);
        }
        
        const [holdData, perfData] = await Promise.all([
            holdingsResponse.json(),
            performanceResponse.json()
        ]);
        
        // Cache the results
        cachedData = { holdData, perfData };
        cacheTimestamp = now;
        
        console.log('Dashboard data fetched and cached successfully');
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
        
        const { holdData, perfData } = await getDashboardData();
        
        console.log('Fetched data:', { holdData, perfData });
        
        // Check if data exists and has the expected structure
        const hasHoldingsData = holdData && holdData.data && Array.isArray(holdData.data) && holdData.data.length > 0;
        const hasPerformanceData = perfData && perfData.data && Array.isArray(perfData.data) && perfData.data.length > 0;
        
        console.log('Data checks:', { hasHoldingsData, hasPerformanceData });
        
        if(hasHoldingsData && hasPerformanceData){
            return (        
                <DashBoardComp holdingData={holdData.data} performanceData={perfData.data}/>
            );
        }
        else{
            return (
                <div className="flex items-center justify-center h-screen gap-5">
                    <p className="text-white/80 text-lg">No data available</p>
                </div>
            );
        }
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

export default function DummyDashboard() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <DashboardContent />
        </Suspense>
    );
}

