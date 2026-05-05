import Pocketbase from 'pocketbase';

const envUrl = import.meta.env.VITE_POCKETBASE_URL;
const POCKETBASE_API_URL =
  envUrl || (import.meta.env.DEV ? 'http://127.0.0.1:8090' : '');

if (!POCKETBASE_API_URL) {
  // Build-time guard (verify-production-env.mjs) should catch this; fail loudly in case it didn't.
  throw new Error(
    'VITE_POCKETBASE_URL is not defined for production builds. Set it in apps/web/.env.production or via CI secret.',
  );
}

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
