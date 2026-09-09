import { SystemEventDocument, SystemStatus } from '@whats-down/shared/common';

type ChartDataPoint = {
    time: number;
    status: -1 | 1;
};

export const transformEventsToChartData = (events: SystemEventDocument[], rangeEnd: Date = new Date()): ChartDataPoint[] => {
    if (!events || events.length === 0) {
        return [];
    }

    const sortedEvents = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const points: ChartDataPoint[] = sortedEvents.map((event) => ({
        time: new Date(event.createdAt).getTime(),
        status: event.status === SystemStatus.UP ? 1 : -1,
    }));

    const lastPoint = points[points.length - 1]!;

    if (lastPoint.time < rangeEnd.getTime()) {
        points.push({
            time: rangeEnd.getTime(),
            status: lastPoint.status,
        });
    }

    return points;
};
