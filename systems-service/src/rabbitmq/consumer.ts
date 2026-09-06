import amqp, { Channel } from 'amqplib';
import { config } from '@/config.js';
import { SystemServiceManager } from '@/express/systems-service/manager.js';
import { QUEUE_NAME, SystemStatus } from '@whats-down/shared';

export const startStatusUpdateConsumer = async (): Promise<void> => {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel: Channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.prefetch(1);

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            try {
                const system: { systemId: string; status: SystemStatus } = JSON.parse(msg.content.toString());

                await SystemServiceManager.changeStatus(system.systemId, system.status);
            } catch (error) {
                console.error('Failed to process status update message:', error);
            } finally {
                channel.ack(msg);
            }
        }
    });
};
