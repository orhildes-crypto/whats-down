import { config } from '@/config.js';
import { InvalidOrExpiredTokenError, ReuseTokenAttackDetected } from '@/utils/errors.js';
import crypto, { randomUUID } from 'crypto';
import { RefreshTokenDocument, RevocationReason } from './interface.js';
import { RefreshTokenModel } from './model.js';


export const hashToken = (rawToken: string): string => {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export const generateRawToken = (): string => {
    return crypto.randomBytes(64).toString('hex');
};

export const createInitialRefreshToken = async (userId: string, username: string): Promise<{ rawToken: string; record: RefreshTokenDocument }> => {
    const rawToken = generateRawToken();
    const now = new Date();

    const record = await RefreshTokenModel.create({
        userId,
        username,
        tokenHash: hashToken(rawToken),
        familyId: randomUUID(),
        generation: 0,
        isRevoked: false,
        expiresAt: new Date(now.getTime() + config.refreshToken.refreshTokenTtl),
        deleteAt: new Date(now.getTime() + config.refreshToken.refreshTokenTtl + config.refreshToken.auditRetention),
    });

    return { rawToken, record };
};

export const rotateRefreshToken = async (rawToken: string): Promise<{rawToken: string, record: RefreshTokenDocument}> => {
    const currentTokenHash = hashToken(rawToken);
    const now = new Date();

    const updatedOldToken = await RefreshTokenModel.findOneAndUpdate(
        {
            tokenHash: currentTokenHash,
            usedAt: { $exists: false },
            isRevoked: false,
            expiresAt: { $gt: now },
        },
        {
            $set: { usedAt: now }, 
        },
        {
            new: false, 
        },
    )
        .lean()
        .exec();

    if (!updatedOldToken) {
        const oldToken = await RefreshTokenModel.findOne({ tokenHash: currentTokenHash }).lean().exec();

        if (!oldToken || oldToken.isRevoked || oldToken.expiresAt < now) {
            throw new InvalidOrExpiredTokenError();
        }

        if (oldToken.usedAt) {
            await reuseAttackDetected(oldToken);
            throw new ReuseTokenAttackDetected(oldToken.userId);
        }

        throw new InvalidOrExpiredTokenError();
    }

    const newRawToken = generateRawToken();
    const nextTokenHash = hashToken(newRawToken);

    const deleteAt = new Date(updatedOldToken.expiresAt.getTime() + config.refreshToken.auditRetention);

    const nextTokenRecord = await RefreshTokenModel.create({
        userId: updatedOldToken.userId,
        username: updatedOldToken.username,
        tokenHash: nextTokenHash, 
        familyId: updatedOldToken.familyId, 
        generation: updatedOldToken.generation + 1, 
        createdAt: now,
        expiresAt: updatedOldToken.expiresAt, 
        deleteAt: deleteAt,
    });

    return {rawToken: newRawToken, record: nextTokenRecord};
};

export const reuseAttackDetected = async (existingToken: RefreshTokenDocument): Promise<void> => {
    await RefreshTokenModel.updateMany(
        { familyId: existingToken.familyId},
        { $set: { isRevoked: true, revocationReason: RevocationReason.FAMILY_COMPROMISED } },
    ).exec();
};
