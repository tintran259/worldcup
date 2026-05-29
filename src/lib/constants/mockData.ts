/**
 * Backward-compatibility shim.
 * All existing imports of `@/lib/constants/mockData` continue to work.
 * New code should import from `@/lib/mock` directly.
 */
export { MOCK_ROUNDS } from '@/lib/mock'
