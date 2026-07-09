/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Express } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { config } from '../src/config.js';
import { Feature } from '../src/express/features/interface.js';
import { Server } from '../src/express/server.js';

const { mongo } = config;

const fakeObjectId = '111111111111111111111111';

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection!.deleteMany({});
    }
};

const exampleFeature: Feature = {
    name: 'test',
    age: 123,
};

describe('e2e features api testing', () => {
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

    describe('/api/features', () => {
        describe('GET /api/features', () => {
            it('should get all the features', async () => {
                const features: Feature[] = [];

                for (let i = 0; i < 3; i++) {
                    const { body: feature } = await request(app).post('/api/features').send(exampleFeature).expect(200);

                    features.push(feature);
                }

                const { body } = await request(app).get('/api/features').expect(200);

                expect(body).toEqual(features);
            });

            it('should get features with pagination', async () => {
                const features: Feature[] = [];

                for (let i = 0; i < 15; i++) {
                    const { body: feature } = await request(app).post('/api/features').send(exampleFeature).expect(200);

                    features.push(feature);
                }

                const [{ body: body1 }, { body: body2 }, { body: body3 }] = await Promise.all([
                    request(app).get('/api/features').query({ limit: 5, step: 0 }).expect(200),
                    request(app).get('/api/features').query({ limit: 5, step: 1 }).expect(200),
                    request(app).get('/api/features').query({ limit: 5, step: 2 }).expect(200),
                ]);

                expect(body1).toEqual(features.slice(0, 5));
                expect(body2).toEqual(features.slice(5, 10));
                expect(body3).toEqual(features.slice(10, 15));
            });

            it('should get an empty array', async () => {
                const { body } = await request(app).get('/api/features').query({ limit: 100 }).expect(200);

                expect(body).toEqual([]);
            });
        });

        describe('GET /api/features/:featureId', () => {
            it('should get a feature', async () => {
                const { body: feature } = await request(app).post('/api/features').send(exampleFeature).expect(200);

                const { body } = await request(app).get(`/api/features/${feature._id}`).expect(200);

                expect(body).toEqual(feature);
            });

            it('should fail for getting a non-existing feature', async () => {
                return request(app).get(`/api/features/${fakeObjectId}`).expect(404);
            });
        });

        describe('GET /api/features/count', () => {
            it('should get features count', async () => {
                const count = 4;

                await Promise.all(Array.from({ length: count }, () => request(app).post('/api/features').send(exampleFeature).expect(200)));

                const { body } = await request(app).get('/api/features/count').expect(200);

                expect(body).toEqual(count);
            });

            it('should get zero when there are no features', async () => {
                const { body } = await request(app).get('/api/features/count').expect(200);

                expect(body).toEqual(0);
            });
        });

        describe('POST /api/features', () => {
            it('should create a new feature', async () => {
                const { body } = await request(app).post('/api/features').send(exampleFeature).expect(200);

                expect(body).toEqual(expect.objectContaining(exampleFeature));
            });

            it('should fail validation for missing fields', async () => {
                return request(app).post('/api/features').send({}).expect(400);
            });
        });

        describe('PUT /api/features/:featureId', () => {
            it('should update feature', async () => {
                const propertyForUpdate = 'test2';

                const {
                    body: { _id },
                } = await request(app).post('/api/features').send(exampleFeature).expect(200);

                const {
                    body: { name },
                } = await request(app).put(`/api/features/${_id}`).send({ name: propertyForUpdate }).expect(200);

                expect(name).toEqual(propertyForUpdate);
            });

            it('should fail for updating a non-existing feature', async () => {
                return request(app).put(`/api/features/${fakeObjectId}`).send(exampleFeature).expect(404);
            });
        });

        describe('DELETE /api/features/:featureId', () => {
            it('should delete feature', async () => {
                const {
                    body: { _id },
                } = await request(app).post('/api/features').send(exampleFeature).expect(200);

                return request(app).delete(`/api/features/${_id}`).expect(200);
            });

            it('should fail for deleting a non-existing feature', async () => {
                return request(app).delete(`/api/features/${fakeObjectId}`).expect(404);
            });
        });
    });
});
