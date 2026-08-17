import { config } from '@/config.js';
import { DocumentNotFoundError, GoogleAuthError, PasswordIncorrectError, SelfDemotionError } from '@/utils/errors.js';
import { AuthenticationError, ConflictError, UserFilters, UserRole, config as sharedConf } from '@whats-down/shared';
import bcrypt from 'bcryptjs';
import { TokenPayload, OAuth2Client } from 'google-auth-library';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthResult, CreateLocalUserPayload, SafeUserDocument, UserDocument } from './interface.js';
import { UserModel } from './model.js';

export class UsersServiceManager {
    static client = new OAuth2Client(config.google.clientId);

    static getMe = async (id: string): Promise<SafeUserDocument> => {
        const user = await UserModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        return this.toSafeUser(user);
    };

    static getByQuery = async (query: UserFilters, step: number, limit?: number): Promise<SafeUserDocument[]> => {
        const users = await UserModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .sort('username')
            .lean()
            .exec();

        return users.map(user => this.toSafeUser(user));
    };

    static createLocalUser = async (payload: CreateLocalUserPayload): Promise<SafeUserDocument> => {
        const newUser = await UserModel.create({
            username: payload.username,
            email: payload.email,
            role: UserRole.VIEWER,
            passwordHash: await bcrypt.hash(payload.password, 10),
        }).catch((err) => {
            if (err.code === 11000) {
                const isUsername = err.keyPattern?.username || err.keyValue?.username || err.message?.includes('username');
                const isEmail = err.keyPattern?.email || err.keyValue?.email || err.message?.includes('email');

                if (isUsername) {
                    throw new ConflictError(`Username ${payload.username} is already taken`);
                }
                if (isEmail) {
                    throw new ConflictError(`User with email ${payload.email} already exists`);
                }

                throw new ConflictError('User with these details already exists');
            }
            throw err;
        });

        return this.toSafeUser(newUser.toObject());
    };

    static loginLocalUser = async (username: string, password: string): Promise<AuthResult> => {
        const user = await UserModel.findOne({ username }).select('+passwordHash').lean().exec();

        if (!user) {
            throw new AuthenticationError();
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            throw new PasswordIncorrectError();
        }

        const token = this.generateJWTToken(user);
        return { user: this.toSafeUser(user), token };
    };

    static loginWithGoogle = async (idToken: string): Promise<AuthResult> => {
        const payload = await this.verifyGoogleToken(idToken);

        const user = await UserModel.findOne({ email: payload.email }).exec();

        if (!user) {
        throw new AuthenticationError('No account found associated with this Google address. Please sign up first.');
    }

        if (!user.googleId) {
            user.googleId = payload.sub;
            await user.save();
        }

        const token = this.generateJWTToken(user);
        return { user: this.toSafeUser(user.toObject()), token };
    };

    static changeUserRole = async (targetId: string, role: UserRole, requestingUserId: string): Promise<SafeUserDocument> => {
        if (targetId.toString() === requestingUserId.toString()) {
            throw new SelfDemotionError();
        }

        const updatedUser = await UserModel.findByIdAndUpdate(targetId, { role }, { new: true })
            .orFail(new DocumentNotFoundError(targetId))
            .lean()
            .exec();

        return this.toSafeUser(updatedUser);
    };

    static deleteUser = async (id: string): Promise<SafeUserDocument> => {
        const user = await UserModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        return this.toSafeUser(user);
    };

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
        return jwt.sign({ userId: user._id, role: user.role, username: user.username }, sharedConf.jwt.secret, { expiresIn: sharedConf.jwt.expiresIn as SignOptions['expiresIn'] });
    };

    static toSafeUser = (user: UserDocument): SafeUserDocument => {
        const { googleId, passwordHash, ...safeUser } = user;
        return safeUser;
    };
}
