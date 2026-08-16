import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@whats-down/shared/common';
import * as styles from './RoleSelect.styles';

interface RoleSelectProps {
    value: UserRole;
    onChange: (role: UserRole) => void;
    disabled?: boolean;
}

const ROLES = Object.values(UserRole);

export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, disabled = false }) => {
    const { t } = useTranslation('manageUsers');

    const handleChange = (event: SelectChangeEvent<UserRole>) => {
        onChange(event.target.value as UserRole);
    };

    return (
        <Select<UserRole>
            value={value}
            onChange={handleChange}
            disabled={disabled}
            size="small"
            sx={styles.selectStyle}
            MenuProps={{
                container: () => document.getElementById('root'),
                disablePortal: false,
            }}
        >
            {ROLES.map(role => (
                <MenuItem key={role} value={role}>
                    {t(`roles.${role}`)}
                </MenuItem>
            ))}
        </Select>
    );
};