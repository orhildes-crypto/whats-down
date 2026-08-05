import { useMutation } from '@tanstack/react-query';
import { usersService } from '../../api/usersApi';
import type { CreateLocalUserPayload, SafeUserDocument } from '../../../../shared/types/user-interfaces';

const registerUser = async (payload: CreateLocalUserPayload): Promise<SafeUserDocument> => {
    return await usersService.createUser(payload);
};

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};
