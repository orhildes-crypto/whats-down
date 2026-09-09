import { transformEventsToChartData } from '@/shared/utils/eventsToChartData';
import { Box } from '@mui/material';
import type { SystemEventDocument } from '@whats-down/shared/common';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import * as styles from './eventsGraph.styles';

type EventsChartProps = {
    events: SystemEventDocument[];
    rangeEnd: Date;
};

const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    const fill = payload.status === 1 ? styles.chartColors.up : styles.chartColors.down;
    return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill={fill} stroke="none" />;
};

export const EventsChart = ({ events, rangeEnd }: EventsChartProps) => {
    const data = transformEventsToChartData(events, rangeEnd);

    const formatXAxis = (timestamp: number) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formatYAxis = (value: number) => (value === 1 ? 'UP' : value === -1 ? 'DOWN' : '');

    return (
        <Box sx={styles.chartContainerStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: 50, bottom: 0 }}>
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={formatXAxis}
                        tick={styles.axisTickStyle}
                        stroke={styles.chartColors.axis}
                        axisLine={{ stroke: styles.chartColors.grid }}
                        tickLine={{ stroke: styles.chartColors.grid }}
                        tickMargin={10}
                    />

                    <YAxis
                        dataKey="status"
                        ticks={[-1, 1]}
                        domain={[-1.5, 1.5]}
                        tickFormatter={formatYAxis}
                        tick={styles.axisTickStyle}
                        stroke={styles.chartColors.axis}
                        axisLine={{ stroke: styles.chartColors.grid }}
                        tickLine={{ stroke: styles.chartColors.grid }}
                        tickMargin={50}
                        width={60}
                    />

                    <Tooltip
                        contentStyle={styles.tooltipStyle}
                        cursor={false}
                        labelFormatter={(label) => new Date(Number(label)).toLocaleString()}
                        formatter={(value) => [Number(value) === 1 ? 'UP' : 'DOWN', 'Status']}
                        itemStyle={{ color: styles.chartColors.tooltipText }}
                        labelStyle={{ color: styles.chartColors.tooltipText }}
                    />

                    <Line type="monotone" dataKey="status" stroke={styles.chartColors.line} strokeWidth={2} dot={renderDot} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};
