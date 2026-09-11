import { createRecoveryPoint } from '../../backend/services/backupService.js';

try {
  const result = await createRecoveryPoint({ reason: process.env.BACKUP_REASON || 'manual' });
  console.log(JSON.stringify({
    id: result.id,
    status: result.status,
    createdAt: result.createdAt,
    gitCommit: result.application?.gitCommit || null,
    database: result.mongo?.status || 'not-configured',
    secondaryCopy: result.secondaryCopy || null,
    verification: result.verification || null,
    included: result.included || null,
    path: result.path,
  }, null, 2));
  process.exit(result.status === 'good' ? 0 : 3);
} catch (error) {
  console.error(`[recovery] backup failed: ${error.stack || error.message}`);
  process.exit(1);
}
