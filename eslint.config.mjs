import { register } from 'tsx/esm/api';
register();

// @ts-expect-error - ESM dynamic import
const config = await import('./eslint.config.ts');

export default config.default;
