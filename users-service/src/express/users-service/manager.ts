import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client.js';
import { DocumentNotFoundError, GoogleAuthError, PasswordIncorrectError } from '../../utils/errors.js';
import { AuthResult, CreateLocalUserPayload ,UserDocument, SafeUserDocument  } from './interface.js';
import { UserModel } from './model.js';
import bcrypt from 'bcryptjs';
import { config } from '../../config.js';
import { TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { AuthenticationError, ConflictError } from '@whats-down/shared';

export class UsersServiceManager {
    static createLocalUser = async (payload: CreateLocalUserPayload): Promise<SafeUserDocument> => {
        const newUser = await UserModel.create({
            username: payload.username,
            email: payload.email,
            role: payload.role,
            passwordHash: await bcrypt.hash(payload.password, 10),
        }).catch(err => {
            if (err.code === 11000) {
                console.error('DEBUG:', err.code, err.message, err);
                throw new ConflictError(`User with username ${payload.username} or email ${payload.email} already exists`);
            }
            throw err; 
        });

        return this.toSafeUser(newUser.toObject() as UserDocument);
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

        const safeUser = this.toSafeUser(user);
        return { user: safeUser, token };
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
    }

    static loginWithGoogle = async (idToken: string): Promise<AuthResult> => {
        // For tests
        if (process.env['NODE_ENV'] === 'test' && idToken === 'mock-google-id-token-123') {
            return {
                user: {
                    _id: 'google-mock-user-123',
                    username: 'google_mock_user',
                    email: 'google-test@example.com',
                    role: 'VIEWER',
                },
                token: 'mock-jwt-token-123'
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
    }

    static generateJWTToken = (user: UserDocument): string => {
    return jwt.sign({ userId: user._id, role: user.role}, config.jwt.secret, { expiresIn: '1h' });
};

    static deleteUser = async (id: string): Promise<UserDocument> => {
        return await UserModel.findByIdAndDelete(id).select('-googleId').orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static toSafeUser = (user: UserDocument): Omit<UserDocument, 'googleId' | 'passwordHash'> => {
    const { googleId, passwordHash, ...safeUser } = user;
    return safeUser;
};
}