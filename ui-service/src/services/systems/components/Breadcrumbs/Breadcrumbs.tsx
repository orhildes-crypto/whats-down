import { useRtl } from '@/i18n/useRtl';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type BreadcrumbItem = {
    id: string | null;
    name: string;
};
export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    currentSystem?: BreadcrumbItem | null;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, currentSystem }) => {
    const { t } = useTranslation('systemCube');
    const { isRtl } = useRtl();

    const isAtRoot = items.length === 0 && !currentSystem;

    const SeparatorIcon = isRtl ? NavigateBeforeIcon : NavigateNextIcon;

    return (
        <MuiBreadcrumbs
            separator={<SeparatorIcon fontSize="large" sx={{ color: 'common.white' }} />}
            aria-label="breadcrumb"
            sx={{ marginY: 1, color: 'common.white', fontSize: 'xx-large' }}
        >
            {isAtRoot ? (
                <Typography sx={{ fontSize: 'xx-large' }}>{t('breadcrumbsHome')}</Typography>
            ) : (
                <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <MuiLink component="span" underline="hover" color="inherit">
                        {t('breadcrumbsHome')}
                    </MuiLink>
                </RouterLink>
            )}

            {items.map((item) => (
                <RouterLink
                    key={item.id ?? 'root'}
                    to="/systems/$id"
                    params={{ id: item.id ?? '' }}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                >
                    <MuiLink component="span" underline="hover" color="inherit">
                        {item.name}
                    </MuiLink>
                </RouterLink>
            ))}

            {currentSystem && <Typography sx={{ fontSize: 'xx-large' }}>{currentSystem.name}</Typography>}
        </MuiBreadcrumbs>
    );
};
