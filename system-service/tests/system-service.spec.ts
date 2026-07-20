/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Express } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { config } from '../src/config.js';
import { SystemServiceDocument } from '../src/express/system-service/interface.js';
import { Server } from '../src/express/server.js';
import { COOKIE_NAME } from '@whats-down/shared';

const { mongo, jwt: jwtConfig } = config; 

const fakeObjectId = '111111111111111111111111';
const BASE_ROUTE = '/api/system-service'; 

const generateTestToken = (role: 'ADMIN' | 'EDITOR' | 'VIEWER' = 'ADMIN') => {
    return jwt.sign(
        { userId: 'test-user-id-123', role }, 
        jwtConfig.secret 
    );
};

const adminToken = generateTestToken('ADMIN'); 
const editorToken = generateTestToken('EDITOR'); 
const viewerToken = generateTestToken('VIEWER'); 

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection!.deleteMany({});
    }
};

const exampleSystemService = {
    name: 'test-service',
    parentId: null,
};

describe('e2e system-service api testing', () => {
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

    describe('/unknownRoute', () => {
        it('should return status code 404', async () => {
            return request(app).get('/unknownRoute').expect(404);
        });
    });

    describe(BASE_ROUTE, () => {
        describe(`GET ${BASE_ROUTE}`, () => {
            it('should get all the system services', async () => {
                const services: SystemServiceDocument[] = [];

                for (let i = 0; i < 3; i++) {
                    const { body: service } = await request(app)
                        .post(BASE_ROUTE)
                        .set('Cookie', `${COOKIE_NAME}=${adminToken}`) 
                        .send({ ...exampleSystemService, name: `test-service-${i}` })
                        .expect(200);

                    services.push(service);
                }

                const { body } = await request(app)
                    .get(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`) 
                    .expect(200);

                expect(body).toHaveLength(3);
            });

            it('should filter by parentId (get direct children of a node)', async () => {
                const { body: parent } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                const { body: child } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'child-service', parentId: parent._id })
                    .expect(200);

                await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'unrelated-root', parentId: null })
                    .expect(200);

                const { body } = await request(app)
                    .get(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .query({ parentId: parent._id })
                    .expect(200);

                expect(body).toEqual([expect.objectContaining({ _id: child._id })]);
            });

            it('should get services with pagination', async () => {
                const services: SystemServiceDocument[] = [];

                for (let i = 0; i < 15; i++) {
                    const { body: service } = await request(app)
                        .post(BASE_ROUTE)
                        .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                        .send({ ...exampleSystemService, name: `svc-${i}` })
                        .expect(200);

                    services.push(service);
                }

                const [{ body: body1 }, { body: body2 }, { body: body3 }] = await Promise.all([
                    request(app).get(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).query({ limit: 5, step: 0 }).expect(200),
                    request(app).get(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).query({ limit: 5, step: 1 }).expect(200),
                    request(app).get(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).query({ limit: 5, step: 2 }).expect(200),
                ]);

                expect(body1).toHaveLength(5);
                expect(body2).toHaveLength(5);
                expect(body3).toHaveLength(5);
            });

            it('should get an empty array', async () => {
                const { body } = await request(app)
                    .get(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .query({ limit: 100 })
                    .expect(200);

                expect(body).toEqual([]);
            });
        });

        describe(`GET ${BASE_ROUTE}/roots`, () => {
            it('should get only root services (parentId: null)', async () => {
                const { body: root } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'child', parentId: root._id })
                    .expect(200);

                const { body } = await request(app)
                    .get(`${BASE_ROUTE}/roots`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .expect(200);

                expect(body).toEqual([expect.objectContaining({ _id: root._id })]);
            });
        });

        describe(`GET ${BASE_ROUTE}/:id`, () => {
            it('should get a system service', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                const { body } = await request(app)
                    .get(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .expect(200);

                expect(body).toEqual(service);
            });

            it('should fail for getting a non-existing service', async () => {
                return request(app)
                    .get(`${BASE_ROUTE}/${fakeObjectId}`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .expect(404);
            });
        });

        describe(`GET ${BASE_ROUTE}/count`, () => {
            it('should get services count', async () => {
                const count = 4;

                await Promise.all(
                    Array.from({ length: count }, (_, i) =>
                        request(app)
                            .post(BASE_ROUTE)
                            .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                            .send({ ...exampleSystemService, name: `svc-${i}` })
                            .expect(200),
                    ),
                );

                const { body } = await request(app)
                    .get(`${BASE_ROUTE}/count`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .expect(200);

                expect(body).toEqual(count);
            });

            it('should get zero when there are no services', async () => {
                const { body } = await request(app)
                    .get(`${BASE_ROUTE}/count`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .expect(200);

                expect(body).toEqual(0);
            });
        });

        describe(`POST ${BASE_ROUTE}`, () => {
            it('should create a new root system service with default status UP', async () => {
                const { body } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                expect(body).toEqual(
                    expect.objectContaining({
                        name: exampleSystemService.name,
                        parentId: null,
                        status: 'UP',
                    }),
                );
                expect(body.createdAt).toBeDefined();
                expect(body.statusUpdatedAt).toBeDefined();
            });

            it('should allow EDITOR to create a system service', async () => {
                return request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${editorToken}`)
                    .send(exampleSystemService)
                    .expect(200);
            });

            it('should block VIEWER from creating a system service', async () => {
                return request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .send({ name: 'viewer-attempt', parentId: null })
                    .expect(403); 
            });

            it('should fail validation for missing name', async () => {
                return request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ parentId: null })
                    .expect(400);
            });

            it('should fail validation when parentId is missing entirely', async () => {
                return request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'no-parent-field' })
                    .expect(400);
            });

            it('should reject client-supplied status (createOneRequestSchema strips/rejects extra fields)', async () => {
                const { body } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ ...exampleSystemService, status: 'DOWN' })
                    .expect(200);

                expect(body.status).toEqual('UP'); 
            });
        });

        describe(`PUT ${BASE_ROUTE}/:id`, () => {
            it('should edit service name', async () => {
                const propertyForUpdate = 'renamed-service';

                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                const { body } = await request(app)
                    .put(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${editorToken}`)
                    .send({ name: propertyForUpdate })
                    .expect(200);

                expect(body.name).toEqual(propertyForUpdate);
            });

            it('should block VIEWER from editing a system service', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                return request(app)
                    .put(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .send({ name: 'hacked-name' })
                    .expect(403);
            });

            it('should fail for updating a non-existing service', async () => {
                return request(app)
                    .put(`${BASE_ROUTE}/${fakeObjectId}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'system-x' })
                    .expect(404);
            });

            it('should fail validation when body is empty (refine: at least one field)', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                return request(app)
                    .put(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({})
                    .expect(400);
            });

            it('should reject status field via editService endpoint (Omit<..., "status">)', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                return request(app)
                    .put(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ status: 'DOWN' })
                    .expect(400);
            });

            it('should reject parentId change that creates a cycle', async () => {
                const { body: a } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-A', parentId: null }).expect(200);
                const { body: b } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-B', parentId: a._id }).expect(200);
                const { body: c } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-C', parentId: b._id }).expect(200);

                const { body } = await request(app)
                    .put(`${BASE_ROUTE}/${b._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ parentId: c._id })
                    .expect(422);

                expect(body.type).toEqual('CreateCircleError');
            });

            it('should allow changing to a valid new parent (no cycle)', async () => {
                const { body: a } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-A', parentId: null }).expect(200);
                const { body: b } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-B', parentId: null }).expect(200);
                const { body: c } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-C', parentId: a._id }).expect(200);

                const { body } = await request(app)
                    .put(`${BASE_ROUTE}/${c._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ parentId: b._id })
                    .expect(200);

                expect(body.parentId).toEqual(b._id);
            });
        });

        describe(`PATCH ${BASE_ROUTE}/:id/status`, () => {
            it('should change status of a leaf service', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                const { body } = await request(app)
                    .patch(`${BASE_ROUTE}/${service._id}/status`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ status: 'DOWN' })
                    .expect(200);

                expect(body.status).toEqual('DOWN');
            });

            it('should block status change on a service with children', async () => {
                const { body: parent } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'child', parentId: parent._id })
                    .expect(200);

                const { body } = await request(app)
                    .patch(`${BASE_ROUTE}/${parent._id}/status`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ status: 'DOWN' })
                    .expect(422);

                expect(body.type).toEqual('SystemWithChildrenError');
            });

            it('should fail for a non-existing service', async () => {
                return request(app)
                    .patch(`${BASE_ROUTE}/${fakeObjectId}/status`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ status: 'DOWN' })
                    .expect(404);
            });

            it('should cascade DOWN status up to the root', async () => {
                const { body: grandparent } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'GTA', parentId: null }).expect(200);
                const { body: parent } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'SYSTEM-P', parentId: grandparent._id })
                    .expect(200);
                const { body: child } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ name: 'SYSTEM-C', parentId: parent._id })
                    .expect(200);

                await request(app)
                    .patch(`${BASE_ROUTE}/${child._id}/status`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send({ status: 'DOWN' })
                    .expect(200);

                const { body: parentAfter } = await request(app).get(`${BASE_ROUTE}/${parent._id}`).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).expect(200);
                const { body: grandparentAfter } = await request(app).get(`${BASE_ROUTE}/${grandparent._id}`).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).expect(200);

                expect(parentAfter.status).toEqual('DOWN');
                expect(grandparentAfter.status).toEqual('DOWN');
            });

            it('should recover parent to UP only when all siblings are UP', async () => {
                const { body: parent } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-P', parentId: null }).expect(200);
                const { body: childA } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-A', parentId: parent._id }).expect(200);
                const { body: childB } = await request(app).post(BASE_ROUTE).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ name: 'SYSTEM-B', parentId: parent._id }).expect(200);

                await request(app).patch(`${BASE_ROUTE}/${childA._id}/status`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ status: 'DOWN' }).expect(200);
                await request(app).patch(`${BASE_ROUTE}/${childB._id}/status`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ status: 'DOWN' }).expect(200);

                await request(app).patch(`${BASE_ROUTE}/${childA._id}/status`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ status: 'UP' }).expect(200);

                const { body: parentStillDown } = await request(app).get(`${BASE_ROUTE}/${parent._id}`).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).expect(200);
                expect(parentStillDown.status).toEqual('DOWN');

                await request(app).patch(`${BASE_ROUTE}/${childB._id}/status`).set('Cookie', `${COOKIE_NAME}=${adminToken}`).send({ status: 'UP' }).expect(200);

                const { body: parentUp } = await request(app).get(`${BASE_ROUTE}/${parent._id}`).set('Cookie', `${COOKIE_NAME}=${viewerToken}`).expect(200);
                expect(parentUp.status).toEqual('UP');
            });
        });

        describe(`DELETE ${BASE_ROUTE}/:id`, () => {
            it('should delete a service', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                return request(app)
                    .delete(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .expect(200);
            });

            it('should block EDITOR from deleting a service', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                return request(app)
                    .delete(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${editorToken}`)
                    .expect(403); 
            });

            it('should block VIEWER from deleting a service', async () => {
                const { body: service } = await request(app)
                    .post(BASE_ROUTE)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .send(exampleSystemService)
                    .expect(200);

                return request(app)
                    .delete(`${BASE_ROUTE}/${service._id}`)
                    .set('Cookie', `${COOKIE_NAME}=${viewerToken}`)
                    .expect(403); 
            });

            it('should fail for deleting a non-existing service', async () => {
                return request(app)
                    .delete(`${BASE_ROUTE}/${fakeObjectId}`)
                    .set('Cookie', `${COOKIE_NAME}=${adminToken}`)
                    .expect(404);
            });
        });
    });
});