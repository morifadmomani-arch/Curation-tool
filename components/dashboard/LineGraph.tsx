import React from 'react';

interface DataPoint {
    xLabel: string;
    y: number;
}

interface LineGraphProps {
    data: DataPoint[];
    color?: string;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, color = '#8884d8' }) => {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
    }

    const width = 500;
    const height = 200;
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxY = Math.max(...data.map(p => p.y), 0);
    const scaleY = (value: number) => chartHeight - (value / (maxY > 0 ? maxY : 1)) * chartHeight;
    const scaleX = (index: number) => (data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2);

    const pathData = data.map((point, i) => {
        const x = padding + scaleX(i);
        const y = padding + scaleY(point.y);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    const yAxisLabels = () => {
        const labels = [];
        const numLabels = 5;
        const effectiveMaxY = maxY > 0 ? maxY : 1000; // Use a default max if all data is 0

        for (let i = 0; i <= numLabels; i++) {
            const value = (effectiveMaxY / numLabels) * i;
            const y = padding + chartHeight - (value / effectiveMaxY) * chartHeight;
            let label = '0';
            if (value >= 1000000) {
                label = `${(value / 1000000).toFixed(1)}m`;
            } else if (value >= 1000) {
                label = `${Math.round(value / 1000)}k`;
            } else {
                label = `${Math.round(value)}`;
            }
            
            labels.push(
                <g key={`y-label-${i}`}>
                    <text x={padding - 10} y={y} dy="0.3em" textAnchor="end" className="text-xs fill-current text-gray-500">
                        {label}
                    </text>
                    { i > 0 && <line x1={padding} y1={y} x2={width - padding} y2={y} className="stroke-current text-gray-200" strokeWidth="0.5" />}
                </g>
            );
        }
        return labels;
    };

    const xAxisLabels = () => {
        if (data.length === 1) {
            return (
                 <text x={padding + scaleX(0)} y={height - padding + 15} textAnchor="middle" className="text-xs fill-current text-gray-500">
                    {data[0].xLabel}
                </text>
            )
        }
        return data.map((point, i) => {
            if (data.length > 12 && i % Math.floor(data.length / 6) !== 0 && i !== 0 && i !== data.length - 1) {
                return null;
            }
            const x = padding + scaleX(i);
            return (
                <text key={`x-label-${i}`} x={x} y={height - padding + 15} textAnchor="middle" className="text-xs fill-current text-gray-500">
                    {point.xLabel}
                </text>
            );
        });
    };

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Y Axis */}
            {yAxisLabels()}

            {/* X Axis */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-current text-gray-300" />
            {xAxisLabels()}

            {/* Line */}
            {data.length > 1 && <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Data Points */}
            {data.map((point, i) => {
                 const x = padding + scaleX(i);
                 const y = padding + scaleY(point.y);
                 return (
                    <g key={`point-group-${i}`} className="group">
                        <circle cx={x} cy={y} r="3" fill={color} className="transition-opacity opacity-0 group-hover:opacity-100" />
                        <circle cx={x} cy={y} r="8" fill={color} fillOpacity="0.2" className="transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer" />
                         <title>{`${point.xLabel}: ${point.y.toLocaleString()}`}</title>
                    </g>
                 );
            })}
        </svg>
    );
};

export default LineGraph;