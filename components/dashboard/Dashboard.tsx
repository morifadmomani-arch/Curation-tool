import React, { useState, useEffect } from 'react';
import DashboardFilters from './DashboardFilters';
import DashboardSection from './DashboardSection';
import MetricCard from './MetricCard';
import GraphCard from './GraphCard';
import LineGraph from './LineGraph';
import { FilterCategory } from './FilterModal';

// Helper to generate mock data
const generateMockData = (points: number, maxVal: number, minVal: number, prefix: string) => {
    return Array.from({ length: points }, (_, i) => ({
        xLabel: `${prefix} ${i + 1}`,
        y: Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal,
    }));
};

// --- Comprehensive Mock Data Source ---
const MOCK_DATA_SOURCE = {
    // Audience Measurement
    'Unique viewers': { Daily: generateMockData(30, 85000, 50000, 'Day'), Weekly: generateMockData(12, 600000, 400000, 'Week'), Monthly: generateMockData(12, 2500000, 1800000, 'Month') },
    'Unique viewers receiving recommendations': { Daily: generateMockData(30, 60000, 30000, 'Day'), Weekly: generateMockData(12, 450000, 250000, 'Week'), Monthly: generateMockData(12, 1800000, 1200000, 'Month') },
    'Unique viewers converting': { Daily: [], Weekly: [], Monthly: [] }, // No data example
    'Unique viewers using search': { Daily: generateMockData(30, 25000, 10000, 'Day'), Weekly: generateMockData(12, 180000, 80000, 'Week'), Monthly: generateMockData(12, 700000, 400000, 'Month') },
    
    // Popular Content
    'Most actioned series by unique viewers': { Daily: generateMockData(30, 5000, 2000, 'Day'), Weekly: generateMockData(12, 35000, 15000, 'Week'), Monthly: generateMockData(12, 150000, 100000, 'Month') },
    'Most Consumed Assets': { Daily: generateMockData(30, 12000, 8000, 'Day'), Weekly: generateMockData(12, 90000, 60000, 'Week'), Monthly: generateMockData(12, 400000, 300000, 'Month') },
    'Top abandoned assets': { Daily: generateMockData(30, 800, 300, 'Day'), Weekly: generateMockData(12, 6000, 2000, 'Week'), Monthly: generateMockData(12, 25000, 10000, 'Month') },
    'Top actioned features': { Daily: generateMockData(30, 2000, 500, 'Day'), Weekly: generateMockData(12, 15000, 8000, 'Week'), Monthly: generateMockData(12, 60000, 40000, 'Month') },

    // Viewer Activity
    'Learn actions pie chart per filters': { Daily: generateMockData(30, 10000, 5000, 'Day'), Weekly: generateMockData(12, 70000, 40000, 'Week'), Monthly: generateMockData(12, 300000, 200000, 'Month') },
    'Learn actions breakdown': { Weekly: generateMockData(12, 50000, 20000, 'Week'), Monthly: generateMockData(12, 200000, 100000, 'Month') },

    // A/B Test Analysis
    'Variant effectiveness': { Daily: generateMockData(30, 1.5, 0.5, 'Day'), Weekly: generateMockData(12, 1.8, 0.8, 'Week'), Monthly: generateMockData(12, 2.2, 1.0, 'Month') },
    'Conversion rate per variant': { Daily: generateMockData(30, 15, 5, 'Day'), Weekly: generateMockData(12, 18, 8, 'Week'), Monthly: generateMockData(12, 22, 10, 'Month') },
    'Conversion per variant': { Daily: generateMockData(30, 500, 100, 'Day'), Weekly: generateMockData(12, 4000, 1000, 'Week'), Monthly: generateMockData(12, 15000, 5000, 'Month') },
    'Recommendation requests per variant': { Daily: generateMockData(30, 10000, 4000, 'Day'), Weekly: generateMockData(12, 70000, 30000, 'Week'), Monthly: generateMockData(12, 300000, 150000, 'Month') },
    'Variant traffic': { Daily: generateMockData(30, 50000, 20000, 'Day'), Weekly: generateMockData(12, 350000, 150000, 'Week'), Monthly: generateMockData(12, 1500000, 800000, 'Month') },
    'Conversions per viewer': { Daily: generateMockData(30, 3, 0.5, 'Day'), Weekly: generateMockData(12, 4, 1, 'Week'), Monthly: generateMockData(12, 5, 1.5, 'Month') },
    'Top converted assets per use case variant': { Daily: generateMockData(30, 100, 20, 'Day'), Weekly: generateMockData(12, 800, 150, 'Week'), Monthly: generateMockData(12, 3000, 500, 'Month') },
    'Top converted series per use case variant': { Daily: generateMockData(30, 80, 10, 'Day'), Weekly: generateMockData(12, 600, 100, 'Week'), Monthly: generateMockData(12, 2500, 400, 'Month') },
    
    // Click Through Conversions & Co-Related Conversions
    'Top converted series title': { Daily: generateMockData(30, 120, 30, 'Day'), Weekly: generateMockData(12, 900, 200, 'Week'), Monthly: generateMockData(12, 4000, 1000, 'Month') },
    'Conversion rate': { Daily: generateMockData(30, 20, 5, 'Day'), Weekly: generateMockData(12, 25, 8, 'Week'), Monthly: generateMockData(12, 30, 12, 'Month') },
    'Top performing use case ID': { Daily: generateMockData(30, 800, 200, 'Day'), Weekly: generateMockData(12, 6000, 1500, 'Week'), Monthly: generateMockData(12, 25000, 8000, 'Month') },
    'Breakdown of conversions': { Daily: generateMockData(30, 1500, 500, 'Day'), Weekly: generateMockData(12, 12000, 4000, 'Week'), Monthly: generateMockData(12, 50000, 20000, 'Month') },
    'Time to conversion pie chart': { Daily: generateMockData(30, 1000, 300, 'Day'), Weekly: generateMockData(12, 8000, 2000, 'Week'), Monthly: generateMockData(12, 35000, 10000, 'Month') },
    'Comparison of use case ID': { Daily: generateMockData(30, 900, 300, 'Day'), Weekly: generateMockData(12, 7000, 2500, 'Week'), Monthly: generateMockData(12, 30000, 12000, 'Month') },
    'Top converted series': { Daily: generateMockData(30, 150, 40, 'Day'), Weekly: generateMockData(12, 1100, 300, 'Week'), Monthly: generateMockData(12, 4500, 1200, 'Month') },
    
    // Recommendation Quality
    'Top recommended series': { Weekly: generateMockData(12, 500, 100, 'Week'), Monthly: generateMockData(12, 2000, 500, 'Month') },
    'Average recommendations per rec type': { Weekly: generateMockData(12, 50, 10, 'Week'), Monthly: generateMockData(12, 60, 15, 'Month') },
    'Recommendation requests (figure)': { Weekly: generateMockData(12, 200000, 80000, 'Week'), Monthly: generateMockData(12, 900000, 400000, 'Month') },
    'Recommendation requests (pie chart %)': { Weekly: generateMockData(12, 100, 20, 'Week'), Monthly: generateMockData(12, 100, 30, 'Month') },

    // Content & Search Analysis
    'Top actioned genre': { Weekly: generateMockData(12, 5000, 1500, 'Week'), Monthly: generateMockData(12, 20000, 6000, 'Month') },
    'Top recommended genre': { Weekly: generateMockData(12, 4000, 1200, 'Week'), Monthly: generateMockData(12, 18000, 5000, 'Month') },
    'Top search terms': { Weekly: generateMockData(12, 10000, 3000, 'Week'), Monthly: generateMockData(12, 45000, 15000, 'Month') },
    'Top search terms returning zero results': { Weekly: generateMockData(12, 500, 100, 'Week'), Monthly: generateMockData(12, 2000, 400, 'Month') },
    'Search requests returning zero results': { Weekly: generateMockData(12, 15, 5, 'Week'), Monthly: generateMockData(12, 20, 8, 'Month') },
    'Top intended search terms': { Weekly: generateMockData(12, 8000, 2500, 'Week'), Monthly: generateMockData(12, 35000, 12000, 'Month') },
    'Top mapped search terms': { Weekly: generateMockData(12, 7000, 2000, 'Week'), Monthly: generateMockData(12, 30000, 10000, 'Month') },
    'Top non mapped search terms': { Weekly: generateMockData(12, 1000, 300, 'Week'), Monthly: generateMockData(12, 4000, 1000, 'Month') },
    'Top search terms resulting in conversion': { Weekly: generateMockData(12, 2000, 500, 'Week'), Monthly: generateMockData(12, 9000, 2500, 'Month') },
    'Search conversion windows': { Weekly: generateMockData(12, 60, 10, 'Week'), Monthly: generateMockData(12, 70, 20, 'Month') },
    'Top converted asset': { Weekly: generateMockData(12, 500, 100, 'Week'), Monthly: generateMockData(12, 2200, 400, 'Month') },
    'Unique viewer converting per search': { Weekly: generateMockData(12, 1500, 400, 'Week'), Monthly: generateMockData(12, 6000, 1500, 'Month') },
};

const GRAPH_COLORS: { [key: string]: string } = {
    'Unique viewers': '#3b82f6',
    'Unique viewers receiving recommendations': '#8b5cf6',
    'Unique viewers converting': '#10b981',
    'Unique viewers using search': '#f59e0b',
    'Most actioned series by unique viewers': '#ef4444',
    'Most Consumed Assets': '#14b8a6',
    'Top abandoned assets': '#6366f1',
    'Top actioned features': '#d946ef',
    'Learn actions pie chart per filters': '#3b82f6',
    'Learn actions breakdown': '#8b5cf6',
    'Variant effectiveness': '#ef4444',
    'Conversion rate per variant': '#10b981',
    'Conversion per variant': '#f59e0b',
    'Recommendation requests per variant': '#14b8a6',
    'Variant traffic': '#6366f1',
    'Conversions per viewer': '#d946ef',
    'Top converted assets per use case variant': '#3b82f6',
    'Top converted series per use case variant': '#8b5cf6',
    'Top converted series title': '#ef4444',
    'Conversion rate': '#10b981',
    'Top performing use case ID': '#f59e0b',
    'Breakdown of conversions': '#14b8a6',
    'Time to conversion pie chart': '#6366f1',
    'Comparison of use case ID': '#d946ef',
    'Top converted series': '#3b82f6',
    'Top recommended series': '#ef4444',
    'Average recommendations per rec type': '#10b981',
    'Recommendation requests (figure)': '#f59e0b',
    'Recommendation requests (pie chart %)': '#14b8a6',
    'Top actioned genre': '#6366f1',
    'Top recommended genre': '#d946ef',
    'Top search terms': '#3b82f6',
    'Top search terms returning zero results': '#8b5cf6',
    'Search requests returning zero results': '#ef4444',
    'Top intended search terms': '#10b981',
    'Top mapped search terms': '#f59e0b',
    'Top non mapped search terms': '#14b8a6',
    'Top search terms resulting in conversion': '#6366f1',
    'Search conversion windows': '#d946ef',
    'Top converted asset': '#3b82f6',
    'Unique viewer converting per search': '#8b5cf6',
};

const ALL_FILTERS: FilterCategory[] = [
    { id: 'userType', name: 'User Type', options: ['Guest', 'Registered', 'Subscriber', 'Premium', 'Basic'] },
    { id: 'region', name: 'Region / Country', options: ['KSA', 'UAE', 'GCC', 'WW', 'USA', 'EGY', 'MENA'] },
    { id: 'page', name: 'Page/Screen', options: ['Home', 'Movies', 'Series', 'Kids', 'Sports'] },
    { id: 'device', name: 'Device', options: ['Web', 'Mobile', 'TV', 'Android', 'iOS', 'Smart TV'] },
    { id: 'useCaseId', name: 'Use Case ID', options: ['uc-101', 'uc-102', 'uc-201', 'uc-202', 'uc-301'] },
    { id: 'genre', name: 'Genre', options: ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Sci-Fi'] },
    { id: 'subGenre', name: 'Sub Genre', options: ['Action Comedy', 'Crime Drama', 'Sci-Fi Thriller', 'Romantic Comedy'] },
    { id: 'series', name: 'Series', options: ['The Crown', 'Stranger Things', 'The Witcher', 'Money Heist'] },
    { id: 'laUseCaseId', name: 'LA Use Case ID', options: ['la-01', 'la-02', 'la-03', 'la-04'] },
    { id: 'title', name: 'Title', options: ['Inception', 'The Dark Knight', 'Interstellar'] },
    { id: 'breakdownType', name: 'Breakdown by Type', options: ['Series', 'Movies', 'Live Ser', 'Channels', 'Clips', 'Episodes'] },
    { id: 'action', name: 'Action', options: ['Click', 'View', 'Play', 'Add to Watchlist'] },
    { id: 'viewerType', name: 'Viewer Type', options: ['New', 'Returning', 'Frequent'] },
];

const findFiltersByIds = (ids: string[]): FilterCategory[] => {
    const filterMap = new Map(ALL_FILTERS.map(f => [f.id, f]));
    return ids.map(id => filterMap.get(id)).filter((f): f is FilterCategory => !!f);
};


const Dashboard = () => {
    const [frequency, setFrequency] = useState('Weekly');
    const [loading, setLoading] = useState(true);
    const [mockData, setMockData] = useState<typeof MOCK_DATA_SOURCE | null>(null);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setMockData(MOCK_DATA_SOURCE);
            setLoading(false);
        }, 1500); 

        return () => clearTimeout(timer);
    }, []);

    const audienceMetrics = [
        { title: 'Unique viewers', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Unique viewers receiving recommendations', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Unique viewers converting', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Unique viewers using search', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
    ];
    const popularContentMetrics = [
        { title: 'Most actioned series by unique viewers', filterIds: ['userType', 'region', 'device', 'genre', 'subGenre'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Most Consumed Assets', filterIds: ['userType', 'region', 'device', 'genre', 'subGenre'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Top abandoned assets', filterIds: ['userType', 'region', 'device', 'genre', 'subGenre'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Top actioned features', filterIds: ['userType', 'region', 'device', 'genre', 'subGenre'], freq: ['Daily', 'Weekly', 'Monthly'] },
    ];
    const viewerActivityMetrics = [
        { isMetric: true, title: 'Learn actions', value: '1.2M', desc: 'Total learn actions', tooltip: 'User type, Region / Country, Page/Screen, Device, LA use case ID' },
        { isMetric: true, title: 'Learn actions per viewer', value: '3.4', desc: 'Average per viewer', tooltip: 'Series, User type, Region / Country, Page/Screen, Device, Use case ID' },
        { isMetric: true, title: 'Session Duration', value: '12m 34s', desc: 'Average session length', tooltip: 'User type, Region / Country, Device' },
        { isMetric: true, title: 'Viewing time per viewer', value: '45m 12s', desc: 'Average per viewer', tooltip: 'User type, Region / Country, Device' },
        { isMetric: true, title: 'Total hrs viewed', value: '8,450', desc: 'Total hours this period', tooltip: 'User type, Region / Country, Device, Genre, Title' },
        { isMetric: true, title: 'Completetion rate per viewer', value: '72%', desc: 'Average completion rate', tooltip: 'User type, Region / Country, Device' },
        { isMetric: true, title: 'Average viewing time per viewer', value: '28m 15s', desc: 'Average view time', tooltip: 'User type, Region / Country, Device' },
        { isMetric: true, title: 'Average assets actioned per viewer', value: '5.1', desc: 'Assets per viewer', tooltip: 'User type, Region / Country, Device' },
        { title: 'Learn actions pie chart per filters', filterIds: ['series', 'userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Learn actions breakdown', filterIds: ['userType', 'region', 'device'], freq: ['Weekly', 'Monthly'] },
    ];
    const abTestMetrics = [
        { title: 'Variant effectiveness', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Conversion rate per variant', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Conversion per variant', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Recommendation requests per variant', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Variant traffic', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Conversions per viewer', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Top converted assets per use case variant', filterIds: ['breakdownType'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Top converted series per use case variant', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
    ];
    const clickThroughConversionsMetrics = [
        { isMetric: true, title: 'Total conversions', value: '45,821', desc: 'Total conversions this period', tooltip: 'Series, User type, Region / Country, Page/Screen, Device, Use case ID' },
        { isMetric: true, title: 'Conversion rate', value: '15.3%', desc: 'Overall conversion rate', tooltip: 'Series, User type, Region / Country, Page/Screen, Device, Use case ID' },
        { title: 'Top converted series title', filterIds: ['userType', 'region', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Conversion rate', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Top performing use case ID', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Breakdown of conversions', filterIds: ['userType', 'region', 'device'], freq: ['Daily', 'Weekly', 'Monthly'] },
    ];
    const coRelatedConversionsMetrics = [
        { isMetric: true, title: 'Total conversions', value: '12,345', desc: 'Co-related conversions', tooltip: 'Series, User type, Region / Country, Page/Screen, Device, Use case ID' },
        { isMetric: true, title: 'Conversion rate', value: '8.1%', desc: 'Co-related conversion rate', tooltip: 'Series, User type, Region / Country, Page/Screen, Device, Use case ID' },
        { isMetric: true, title: 'Viewer base converting', value: '21.5k', desc: 'Unique viewers converting', tooltip: 'User type, Region / Country, Device, Use case ID' },
        { title: 'Conversion rate', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Time to conversion pie chart', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Comparison of use case ID', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Breakdown of conversions', filterIds: ['userType', 'region', 'page', 'device', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
        { title: 'Top converted series', filterIds: ['series', 'userType', 'region', 'page', 'useCaseId'], freq: ['Daily', 'Weekly', 'Monthly'] },
    ];
    const recommendationQualityMetrics = [
        { isMetric: true, title: 'Recommendation Assets', value: '2.1M', desc: 'Total assets recommended', tooltip: 'User type, Region / Country, Page/Screen, Device, Action, Viewer type, Use case ID' },
        { isMetric: true, title: 'Unique recommended series', value: '4,210', desc: 'Unique series recommended', tooltip: 'User type, Region / Country, Page/Screen, Device, Action, Viewer type, Use case ID' },
        { isMetric: true, title: 'Active use cases', value: '18', desc: 'Currently active use cases', tooltip: 'None' },
        { title: 'Top recommended series', filterIds: ['userType', 'region', 'page', 'device', 'action', 'viewerType', 'useCaseId'], freq: ['Weekly', 'Monthly'] },
        { title: 'Average recommendations per rec type', filterIds: ['userType', 'region', 'page', 'device', 'action', 'viewerType', 'useCaseId'], freq: ['Weekly', 'Monthly'] },
        { title: 'Recommendation requests (figure)', filterIds: ['userType', 'region', 'page', 'device', 'action', 'viewerType', 'useCaseId'], freq: ['Weekly', 'Monthly'] },
        { title: 'Recommendation requests (pie chart %)', filterIds: ['userType', 'region', 'page', 'device', 'action', 'viewerType', 'useCaseId'], freq: ['Weekly', 'Monthly'] },
    ];
    const contentAndSearchMetrics = [
        { title: 'Top actioned genre', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top recommended genre', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top actioned features', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top search terms', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top search terms returning zero results', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Search requests returning zero results', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top intended search terms', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top mapped search terms', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top non mapped search terms', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { isMetric: true, title: 'Search conversions', value: '9,876', desc: 'Total conversions from search', tooltip: 'User type, Region / Country, Page/Screen, Device' },
        { isMetric: true, title: 'Search conversion rate', value: '22.1%', desc: 'Conversion rate from search', tooltip: 'User type, Region / Country, Page/Screen, Device' },
        { isMetric: true, title: 'Unique assets converted', value: '1,234', desc: 'Unique assets from search', tooltip: 'User type, Region / Country, Page/Screen, Device' },
        { isMetric: true, title: 'Average time to content', value: '45s', desc: 'Avg. time from search to play', tooltip: 'User type, Region / Country, Page/Screen, Device' },
        { title: 'Top search terms resulting in conversion', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Search conversion windows', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Top converted asset', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
        { title: 'Unique viewer converting per search', filterIds: ['userType', 'region', 'page', 'device'], freq: ['Weekly', 'Monthly'] },
    ];

    const renderGraph = (metric: { title: string, filterIds: string[], freq: string[] }) => (
        <GraphCard
            key={metric.title}
            title={metric.title}
            availableFilters={findFiltersByIds(metric.filterIds)}
            frequencyOptions={metric.freq}
            isLoading={loading}
        >
            {(freq, appliedFilters) => {
                // NOTE: In a real app, appliedFilters would be used to refetch data.
                // Here, we just display the mock data as is.
                const dataKey = metric.title as keyof typeof MOCK_DATA_SOURCE;
                const freqKey = freq as keyof typeof MOCK_DATA_SOURCE[typeof dataKey];
                const data = mockData?.[dataKey]?.[freqKey] ?? [];
                return <LineGraph data={data} color={GRAPH_COLORS[dataKey] || '#8884d8'} />;
            }}
        </GraphCard>
    );
    
    const renderMetricOrGraph = (metric: any) => {
         if (metric.isMetric) {
            return <MetricCard 
                key={metric.title} 
                title={metric.title} 
                value={metric.value} 
                description={metric.desc} 
                tooltip={`Filters: ${metric.tooltip}`}
                isLoading={loading}
            />;
        }
        return renderGraph(metric);
    };

    return (
        <div className="p-0">
            <DashboardFilters frequency={frequency} onFrequencyChange={setFrequency} />

            <DashboardSection title="Audience Measurement">
                {audienceMetrics.map(renderGraph)}
            </DashboardSection>

            <DashboardSection title="Popular Content">
                {popularContentMetrics.map(renderGraph)}
            </DashboardSection>
            
            <DashboardSection title="Viewer Activity">
                {viewerActivityMetrics.map(renderMetricOrGraph)}
            </DashboardSection>
            
            <DashboardSection title="A/B Test Analysis" defaultOpen={false}>
                {abTestMetrics.map(renderGraph)}
            </DashboardSection>
            
            <DashboardSection title="Click Through Conversions" defaultOpen={false}>
                {clickThroughConversionsMetrics.map(renderMetricOrGraph)}
            </DashboardSection>
            
            <DashboardSection title="Co-Related Conversions" defaultOpen={false}>
                {coRelatedConversionsMetrics.map(renderMetricOrGraph)}
            </DashboardSection>

            <DashboardSection title="Recommendation Quality" defaultOpen={false}>
                {recommendationQualityMetrics.map(renderMetricOrGraph)}
            </DashboardSection>
            
            <DashboardSection title="Content & Search Analysis" defaultOpen={false}>
                {contentAndSearchMetrics.map(renderMetricOrGraph)}
            </DashboardSection>

        </div>
    );
};

export default Dashboard;
