import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export type BreadcrumbItem = {
    id: string | null;
    name: string;
};
export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    currentSystem?: BreadcrumbItem | null;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, currentSystem }) => {
    const { t, i18n } = useTranslation('systemCube');
    const isRtl = i18n.dir() === 'rtl';

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