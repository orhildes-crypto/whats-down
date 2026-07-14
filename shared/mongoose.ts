/* v8 ignore start */
import mongoose from 'mongoose';
import type { ClientSession } from 'mongoose';

const { connection } = mongoose;

export const transaction = async <T, Func extends (session: ClientSession) => Promise<T>>(func: Func): Promise<T> => {
    let ret: T | undefined;

    await connection.transaction(async (session) => {
        ret = await func(session);
    });

    return ret!;
};
