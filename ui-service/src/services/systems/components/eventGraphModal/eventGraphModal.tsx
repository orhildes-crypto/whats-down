import type { SystemDocument } from '@/shared/types/system-interfaces';
import { getDateRangeFromOption } from '@/shared/utils/dateFromOption';
import { TimeRangeOption } from '@whats-down/shared/common';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Box,
    Typography,
    CircularProgress,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSystemEvents } from '../systemCube/hooks/useSystemEvents';
import * as styles from './eventGraphModal.styles';
import { EventsChart } from '../eventsGraph/eventsGraph';

type EventGraphModalProps = {
    isOpen: boolean;
    onClose: () => void;
    system: SystemDocument;
};

export const EventGraphModal = ({ isOpen, onClose, system }: EventGraphModalProps) => {
    const { t } = useTranslation('eventGraphModal');

    const [selectedRange, setSelectedRange] = useState<TimeRangeOption>(TimeRangeOption.FIVE_MINUTES);

    const dateRange = useMemo(() => {
        if (!isOpen) return null;
        return getDateRangeFromOption(selectedRange);
    }, [selectedRange, isOpen]);

    const enabled = isOpen && Boolean(system?._id) && Boolean(dateRange?.start);

    const {
        data: eventsData,
        isLoading,
        isError,
    } = useSystemEvents(
        {
            systemId: system?._id ?? '',
            start: dateRange?.start ?? '',
            end: dateRange?.end ?? 'now',
        },
        enabled,
    );

    const handleRangeChange = (event: SelectChangeEvent<TimeRangeOption>) => {
        setSelectedRange(event.target.value as TimeRangeOption);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const hasEvents = eventsData && eventsData.length > 0;

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md" onClick={(e) => e.stopPropagation()}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                    {t('systemEvents.title', { systemName: system.name })}
                </Typography>
                <IconButton aria-label="close" onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={styles.dialogContentStyle}>
                <Box sx={styles.controlsWrapperStyle}>
                    <FormControl size="small" sx={styles.selectFormControlStyle}>
                        <InputLabel id="time-range-select-label">{t('systemEvents.selectRangeLabel')}</InputLabel>
                        <Select
                            labelId="time-range-select-label"
                            value={selectedRange}
                            label={t('systemEvents.selectRangeLabel')}
                            onChange={handleRangeChange}
                        >
                            {Object.values(TimeRangeOption).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {t(`systemEvents.ranges.${option}`, option)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={styles.stateContainerStyle}>
                    {isLoading && (
                        <>
                            <CircularProgress size={32} />
                            <Typography color="text.secondary" variant="body2">
                                {t('common.loading')}
                            </Typography>
                        </>
                    )}

                    {isError && <Typography color="error">{t('systemEvents.errorLoading')}</Typography>}

                    {!isLoading && !isError && !hasEvents && <Typography color="text.secondary">{t('systemEvents.noData')}</Typography>}

                    {!isLoading && !isError && hasEvents && eventsData && <EventsChart events={eventsData} rangeEnd={new Date()} />}
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-start', p: 2 }}>
                <Button onClick={handleClose} sx={styles.closeButtonStyle}>
                    {t('common.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
