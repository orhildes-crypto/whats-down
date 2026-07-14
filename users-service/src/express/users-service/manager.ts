import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client.js';
import { DocumentNotFoundError, GoogleAuthError, PasswordIncorrectError } from '../../utils/errors.js';
import { AuthResult, CreateLocalUserPayload ,UserDocument  } from './interface.js';
import { UserModel } from './model.js';
import bcrypt from 'bcryptjs';
import { config } from '../../config.js';
import { TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';

export class UsersServiceManager {
    static createLocalUser = async (payload: CreateLocalUserPayload): Promise<UserDocument> => {
        return UserModel.create({
            username: payload.username,
            email: payload.email,
            role: "VIEWER",
            passwordHash: await bcrypt.hash(payload.password, 10),
        });
    };

    static loginLocalUser = async (username: string, password: string): Promise<AuthResult> => {
        const user = await UserModel.findOne({ username }).lean().exec();
        if (!user) {
            throw new DocumentNotFoundError(username);
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
        return await UserModel.findByIdAndDelete(id).select('-passwordHash -googleId').orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static toSafeUser = (user: UserDocument): Omit<UserDocument, 'passwordHash' | 'googleId'> => {
        const { passwordHash, googleId, ...safeUser } = user;
        return safeUser;
    }; 
}