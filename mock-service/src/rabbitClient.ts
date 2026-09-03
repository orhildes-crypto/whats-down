import amqp from 'amqplib';
import { config } from '@/config.js';
import { SystemStatus } from '@whats-down/shared';

const QUEUE_NAME = 'system-status-updates';

let channel: amqp.Channel | null = null;

export const connectToRabbit = async (): Promise<void> => {
    const connection = await amqp.connect(config.rabbitmq.url);

    const initChannel = await connection.createChannel();
    await initChannel.assertQueue(QUEUE_NAME, { durable: false });

    channel = initChannel;
};

export const publishStatusUpdate = (systemId: string, status: SystemStatus): void => {
    if (!channel) {
        throw new Error('channel is not initialized');
    }

    const messageBuffer = Buffer.from(JSON.stringify({ systemId, status }));

    channel.sendToQueue(QUEUE_NAME, messageBuffer, {
        persistent: false,
    });
};
