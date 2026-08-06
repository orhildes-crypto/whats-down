import { config } from '@/config.js';
import { DocumentNotFoundError, GoogleAuthError, PasswordIncorrectError, SelfDemotionError } from '@/utils/errors.js';
import { AuthenticationError, ConflictError, UserRole } from '@whats-down/shared';
import bcrypt from 'bcryptjs';
import { TokenPayload } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client.js';
import jwt from 'jsonwebtoken';
import { AuthResult, CreateLocalUserPayload, SafeUserDocument, UserDocument } from './interface.js';
import { UserModel } from './model.js';

export class UsersServiceManager {
    static getMe = async (id: string): Promise<SafeUserDocument> => {
        const user = await UserModel.findById(id).orFail(new DocumentNotFoundError(id)).exec();

        const plainUser = user.toObject() as UserDocument;
        const safeUser = this.toSafeUser(plainUser);

        return safeUser;
    };

    static createLocalUser = async (payload: CreateLocalUserPayload): Promise<SafeUserDocument> => {
        const newUser = await UserModel.create({
            username: payload.username,
            email: payload.email,
            role: UserRole.VIEWER,
            passwordHash: await bcrypt.hash(payload.password, 10),
        }).catch((err) => {
            if (err.code === 11000) {
                console.error('DEBUG:', err.code, err.message, err);
                throw new ConflictError(`User with username ${payload.username} or email ${payload.email} already exists`);
            }
            throw err;
        });

        return this.toSafeUser(newUser.toObject() as UserDocument);
    };

    static loginLocalUser = async (username: string, password: string): Promise<AuthResult> => {
        const user = await UserModel.findOne({ username }).select('+passwordHash').exec();
        if (!user) {
            throw new AuthenticationError();
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            throw new PasswordIncorrectError();
        }

        const token = this.generateJWTToken(user);

        const plainUser = user.toObject() as UserDocument;
        const safeUser = this.toSafeUser(plainUser);
        return { user: safeUser, token };
    };

    static loginWithGoogle = async (idToken: string): Promise<AuthResult> => {
        // For tests
        if (process.env['NODE_ENV'] === 'test' && idToken === 'mock-google-id-token-123') {
            const mockUser = await UserModel.findOneAndUpdate(
                { email: 'google-test@example.com' },
                {
                    $setOnInsert: {
                        username: 'google_mock_user',
                        email: 'google-test@example.com',
                        role: UserRole.VIEWER,
                        googleId: 'mock-google-id-123',
                    },
                },
                { upsert: true, new: true },
            )
                .lean()
                .exec();

            return {
                user: {
                    _id: mockUser._id.toString(),
                    username: mockUser.username,
                    email: mockUser.email,
                    role: mockUser.role,
                },
                token: this.generateJWTToken(mockUser as UserDocument),
            };
        }

        const payload = await this.verifyGoogleToken(idToken);

        const user = await UserModel.findOne({ email: payload.email }).exec();

        if (!user) throw new DocumentNotFoundError(payload.email ?? 'unknown user');

        if (!user.googleId) {
            user.googleId = payload.sub;
            await user.save();
        }

        const token = this.generateJWTToken(user);

        const plainUser = user.toObject() as UserDocument;
        const safeUser = this.toSafeUser(plainUser);
        return { user: safeUser, token };
    };

    static changeUserRole = async (targetId: string, role: UserRole, requestingUserId: string): Promise<SafeUserDocument> => {
        if (targetId === requestingUserId) {
            throw new SelfDemotionError();
        }

        const updatedUser = await UserModel.findByIdAndUpdate(targetId, { role }, { new: true })
            .select('-googleId')
            .orFail(new DocumentNotFoundError(targetId))
            .lean()
            .exec();

        return this.toSafeUser(updatedUser);
    };

    static deleteUser = async (id: string): Promise<SafeUserDocument> => {
        const user = await UserModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        return this.toSafeUser(user);
    };

    static client = new OAuth2Client(config.google.clientId);

    static verifyGoogleToken = async (idToken: string): Promise<TokenPayload> => {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new GoogleAuthError();
        }

        return payload;
    };

    static generateJWTToken = (user: UserDocument): string => {
        return jwt.sign({ userId: user._id, role: user.role, username: user.username }, config.jwt.secret, { expiresIn: '1h' });
    };

    static toSafeUser = (user: UserDocument): SafeUserDocument => {
        const { googleId, passwordHash, ...safeUser } = user;
        return safeUser;
    };

    static generateTokenForUserId = async (userId: string): Promise<string> => {
        const user = await UserModel.findById(userId).select('-passwordHash').lean().exec();

        if (!user) {
            throw new DocumentNotFoundError(userId);
        }

        return this.generateJWTToken(user as UserDocument);
    };
}
