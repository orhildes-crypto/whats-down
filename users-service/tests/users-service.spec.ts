/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import { Express } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { config } from '../src/config.js';
import { Server } from '../src/express/server.js';
import { COOKIE_NAME } from '@whats-down/shared';
import { RefreshTokenModel } from '../src/express/users-service/refresh-token/model.js';
import { REFRESH_COOKIE_NAME } from '../src/utils/express/cookie.js';

const { mongo, jwt: jwtConfig } = config;

const fakeObjectId = '111111111111111111111111';
const BASE_ROUTE = '/api/users-services';

const generateTestToken = (role: 'ADMIN' | 'EDITOR' | 'VIEWER' = 'ADMIN') => {
    return jwt.sign({ userId: 'test-admin-id', role }, jwtConfig.secret);
};

const adminToken = generateTestToken('ADMIN');
const editorToken = generateTestToken('EDITOR');

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection!.deleteMany({});
    }
};

const exampleUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'SecurePassword123!',
    role: 'EDITOR',
};

describe('e2e users-service api testing', () => {
    let app: Express;

    beforeAll(async () => {
        await mongoose.connect(mongo.uri);
        app = Server.createExpressApp();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await removeAllCollections();
    });

    describe('/isAlive', () => {
        it('should return alive', async () => {
            const response = await request(app).get('/isAlive').expect(200);
            expect(response.text).toBe('alive');
        });
    });

    describe('POST /api/users (Registration)', () => {
        it('should successfully register a new user without authentication', async () => {
            const { body } = await request(app).post(BASE_ROUTE).send(exampleUser).expect(200);

            expect(body).toEqual(
                expect.objectContaining({
                    username: exampleUser.username,
                    email: exampleUser.email,
                    role: 'EDITOR',
                }),
            );
            expect(body.passwordHash).toBeUndefined();
            expect(body._id).toBeDefined();
        });

        it('should fail validation when username is missing', async () => {
            const invalidUser = { ...exampleUser };
            delete (invalidUser as any).username;

            return request(app).post(BASE_ROUTE).send(invalidUser).expect(400);
        });

        it('should fail validation when email is invalid', async () => {
            return request(app)
                .post(BASE_ROUTE)
                .send({ ...exampleUser, email: 'not-an-email' })
                .expect(400);
        });

        it('should fail validation when role is invalid', async () => {
            return request(app)
                .post(BASE_ROUTE)
                .send({ ...exampleUser, role: 'INVALID_ROLE' })
                .expect(400);
        });

        it('should fail to register when username already exists', async () => {
            await request(app).post(BASE_ROUTE).send(exampleUser).expect(200);

            return request(app)
                .post(BASE_ROUTE)
                .send({ ...exampleUser, email: 'another@example.com' })
                .expect(409);
        });
    });

    describe('POST /api/users/login (Local Login)', () => {
        beforeEach(async () => {
            await request(app).post(BASE_ROUTE).send(exampleUser).expect(200);
        });

        it('should successfully login and return a JWT token', async () => {
            const response = await request(app)
                .post(`${BASE_ROUTE}/login`)
                .send({
                    username: exampleUser.username,
                    password: exampleUser.password,
                })
                .expect(200);

            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();

            const authCookie = (cookies as unknown as string[]).find((c) => c.startsWith(`${COOKIE_NAME}=`));
            expect(authCookie).toBeDefined();

            const token = authCookie!.split(';')[0]!.split('=')[1];

            const decoded = jwt.verify(token!, jwtConfig.secret) as { userId: string; role: string };
            expect(decoded.role).toEqual(exampleUser.role);
        });

        it('should fail login with incorrect password', async () => {
            return request(app)
                .post(`${BASE_ROUTE}/login`)
                .send({
                    username: exampleUser.username,
                    password: 'WrongPassword!',
                })
                .expect(401);
        });

        it('should fail login for non-existing user', async () => {
            return request(app)
                .post(`${BASE_ROUTE}/login`)
                .send({
                    username: 'ghost_user',
                    password: exampleUser.password,
                })
                .expect(401);
        });
    });

    describe('POST /api/users/login/google (OAuth Login)', () => {
        it('should successfully authenticate with a valid Google Token', async () => {
            const mockGoogleToken = 'mock-google-id-token-123';

            const response = await request(app).post(`${BASE_ROUTE}/login/google`).send({ idToken: mockGoogleToken }).expect(200);

            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
        });

        it('should fail validation when idToken is missing', async () => {
            return request(app).post(`${BASE_ROUTE}/login/google`).send({}).expect(400);
        });
    });

    describe('DELETE /api/users/:id (RBAC Control)', () => {
        let userIdToDelete: string;

        beforeEach(async () => {
            const { body } = await request(app).post(BASE_ROUTE).send(exampleUser).expect(200);
            userIdToDelete = body._id;
        });

        it('should allow ADMIN to delete a user', async () => {
            return request(app).delete(`${BASE_ROUTE}/${userIdToDelete}`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).expect(200);
        });

        it('should block EDITOR from deleting a user', async () => {
            return request(app).delete(`${BASE_ROUTE}/${userIdToDelete}`).set('Cookie', `${COOKIE_NAME}=${editorToken}`).expect(403); // Forbidden
        });

        it('should return 401 when deleting without a token', async () => {
            return request(app).delete(`${BASE_ROUTE}/${userIdToDelete}`).expect(401);
        });

        it('should return 404 when trying to delete a non-existing user (with Admin token)', async () => {
            return request(app).delete(`${BASE_ROUTE}/${fakeObjectId}`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).expect(404);
        });
    });

    describe('POST /api/users/logout', () => {
        it('should clear the auth cookie and return 200', async () => {
            const response = await request(app).post(`${BASE_ROUTE}/logout`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).expect(200);

            const cookies = response.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();

            const clearedCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
            expect(clearedCookie).toBeDefined();
            // ערך ריק, ו-Expires בעבר (או Max-Age=0) הם הסימנים שהעוגייה נמחקת
            expect(clearedCookie).toMatch(new RegExp(`${COOKIE_NAME}=;`));
        });

        it('should succeed even without an existing auth cookie', async () => {
            return request(app).post(`${BASE_ROUTE}/logout`).expect(200);
        });
    });

    describe('POST /api/users-services/auth/refresh', () => {
        const mockGoogleToken = 'mock-google-id-token-123';
        let validRefreshTokenCookie: string;

        beforeEach(async () => {
        await RefreshTokenModel.deleteMany({});

        const response = await request(app)
            .post(`${BASE_ROUTE}/login/google`) 
            .send({ idToken: mockGoogleToken })
            .expect(200);

        const cookies = response.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();

        // הדפסה זמנית לדיבאג - בוא נראה מה השרת באמת מחזיר ב-set-cookie!
        console.log('DEBUG COOKIES RETURNED FROM LOGIN:', cookies);

        const refreshCookie = cookies.find(c => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
        
        // זה ימנע את ה-404 ויגיד לנו מיד אם הבעיה היא שהקוקי בכלל לא קיים ב-Response!
        expect(refreshCookie).toBeDefined();

        const rawCookieValue = refreshCookie!.split(';')[0]; 
        validRefreshTokenCookie = rawCookieValue;
    });

        it('1. Happy Path - should rotate tokens successfully and return new cookies', async () => {
            const response = await request(app)
                .post(`${BASE_ROUTE}/auth/refresh`)
                .set('Cookie', [validRefreshTokenCookie]) // נשלח נקי ללא מגבלות ה-path ש-supertest מסנן
                .expect(200);

            expect(response.body.success).toBe(true);

            const cookies = response.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();

            const hasRefreshToken = cookies.some((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
            expect(hasRefreshToken).toBe(true);
        });

        it('2. Invalid Token - should fail with 401 and clear cookies if token is fake/expired', async () => {
            const fakeCookie = `${REFRESH_COOKIE_NAME}=this-is-a-fake-unhashed-token-123`;

            const response = await request(app).post(`${BASE_ROUTE}/auth/refresh`).set('Cookie', [fakeCookie]).expect(401);

            expect(response.body.type).toBe('InvalidOrExpiredTokenError');

            const setCookies = response.headers['set-cookie'] as unknown as string[];
            expect(setCookies).toBeDefined();

            const clearedRefresh = setCookies.some((c) => c.includes(`${REFRESH_COOKIE_NAME}=`));
            expect(clearedRefresh).toBe(true);
        });

        it('3. Security - should detect reuse attack, revoke family, clear cookies and return 401', async () => {
            const firstRefreshResponse = await request(app).post(`${BASE_ROUTE}/auth/refresh`).set('Cookie', [validRefreshTokenCookie]).expect(200);

            // מחלצים את ה-cookie החדש שנוצר כדי לבדוק את הניקוי שלו בהתקפה
            const newCookies = firstRefreshResponse.headers['set-cookie'] as unknown as string[];
            const newRefreshCookie = newCookies.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`))!.split(';')[0];

            const attackResponse = await request(app)
                .post(`${BASE_ROUTE}/auth/refresh`)
                .set('Cookie', [validRefreshTokenCookie]) // שימוש חוזר בטוקן הישן!
                .expect(401);

            expect(attackResponse.body.type).toBe('ReuseTokenAttackDetected');

            const setCookies = attackResponse.headers['set-cookie'] as unknown as string[];
            expect(setCookies).toBeDefined();

            const clearedRefresh = setCookies.some((c) => c.includes(`${REFRESH_COOKIE_NAME}=`));
            expect(clearedRefresh).toBe(true);

            const dbTokens = await RefreshTokenModel.find({}).exec();
            expect(dbTokens.length).toBeGreaterThan(0);

            for (const tokenDoc of dbTokens) {
                expect(tokenDoc.isRevoked).toBe(true);
                expect(tokenDoc.revocationReason).toBe('FAMILY_COMPROMISED');
            }
        });
    });
    describe('PATCH /api/users/:id/role', () => {
        let targetUserId: string;

        beforeEach(async () => {
            const { body } = await request(app)
                .post(BASE_ROUTE)
                .send({ ...exampleUser, username: 'target_user', email: 'target@example.com' })
                .expect(200);
            targetUserId = body._id;
        });

        it("should allow ADMIN to change another user's role", async () => {
            const { body } = await request(app)
                .patch(`${BASE_ROUTE}/${targetUserId}/role`)
                .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                .send({ role: 'ADMIN' })
                .expect(200);

            expect(body.role).toEqual('ADMIN');
        });

        it('should block EDITOR from changing a role', async () => {
            return request(app)
                .patch(`${BASE_ROUTE}/${targetUserId}/role`)
                .set('Cookie', `${COOKIE_NAME}=${editorToken}`)
                .send({ role: 'ADMIN' })
                .expect(403);
        });

        it('should return 401 when changing a role without a token', async () => {
            return request(app).patch(`${BASE_ROUTE}/${targetUserId}/role`).send({ role: 'ADMIN' }).expect(401);
        });

        it('should return 404 for a non-existing user', async () => {
            return request(app)
                .patch(`${BASE_ROUTE}/${fakeObjectId}/role`)
                .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                .send({ role: 'ADMIN' })
                .expect(404);
        });

        it('should fail validation for an invalid role value', async () => {
            return request(app)
                .patch(`${BASE_ROUTE}/${targetUserId}/role`)
                .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                .send({ role: 'SUPER_ADMIN' })
                .expect(400);
        });

        it('should block an ADMIN from changing their own role (self-demotion protection)', async () => {
            // יוצרים משתמש רגיל, ואז מעדכנים אותו ידנית ל-ADMIN ב-DB
            const { body: newUser } = await request(app)
                .post(BASE_ROUTE)
                .send({ ...exampleUser, username: 'self_admin', email: 'self_admin@example.com' })
                .expect(200);

            await mongoose.connection.collection('users').updateOne({ _id: new mongoose.Types.ObjectId(newUser._id) }, { $set: { role: 'ADMIN' } });

            const selfToken = jwt.sign({ userId: newUser._id, role: 'ADMIN' }, jwtConfig.secret);

            return request(app)
                .patch(`${BASE_ROUTE}/${newUser._id}/role`)
                .set('Cookie', `${COOKIE_NAME}=${selfToken}`)
                .send({ role: 'VIEWER' })
                .expect(400); // Bad Request due to self-demotion protection
        });
    });
});
