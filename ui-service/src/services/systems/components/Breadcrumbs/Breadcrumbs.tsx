import { useRtl } from '@/i18n/useRtl';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

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
            separator={<SeparatorIcon fontSize="large" sx={{ color: 'common.white' }}/>} 
            aria-label="breadcrumb"
            sx={{ marginY: 1 , color: 'common.white', fontSize: 'xx-large' }}
        >
            {isAtRoot ? (
               <Typography sx={{ fontSize: 'xx-large' }}>{t('breadcrumbsHome')}</Typography>
            ) : (
                <MuiLink 
                    component={RouterLink} 
                    to="/" 
                    underline="hover" 
                    color="inherit"
                >
                    {t('breadcrumbsHome')}
                </MuiLink>
            )}

            {items.map((item) => (
                <MuiLink
                    key={item.id ?? 'root'}
                    component={RouterLink}
                    to={`/systems/${item.id}`}
                    underline="hover"
                    color="inherit"
                >
                    {item.name}
                </MuiLink>
            ))}

            {currentSystem && (
                <Typography sx={{ fontSize: 'xx-large' }}>
                    {currentSystem.name}
                </Typography>
            )}
        </MuiBreadcrumbs>
    );
};