import { config } from '@/config.js';

const main = () => {
    console.log('mock-service starting...');
    console.log(`config: interval=${config.intervalMs}ms, systemsServiceUrl=${config.systemsServiceUrl}`);

    // TODO: שלב 1 - seeding: לבדוק אם יש roots קיימים, אם לא - ליצור 5 עצים
    // TODO: שלב 2 - setInterval שרץ כל config.intervalMs
};

main();