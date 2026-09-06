import { TimeRangeOption } from '@whats-down/shared/common';

const RANGE_TO_MS: Record<TimeRangeOption, number> = {
    [TimeRangeOption.FIVE_MINUTES]: 5 * 60 * 1000,
    [TimeRangeOption.HALF_HOUR]: 30 * 60 * 1000,
    [TimeRangeOption.ONE_HOUR]: 60 * 60 * 1000,
    [TimeRangeOption.TWENTY_FOUR_HOURS]: 24 * 60 * 60 * 1000,
};

export const getDateRangeFromOption = (option: TimeRangeOption): { start: string; end: 'now' } => {
    const now = Date.now();
    const msToSubtract = RANGE_TO_MS[option];
    const startDate = new Date(now - msToSubtract);

    return {
        start: startDate.toISOString(),
        end: 'now',
    };
};
