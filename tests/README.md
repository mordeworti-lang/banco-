/**
 * ESTRUCTURA DE TESTS
 * 
 * tests/
 * ├── unit/           # Tests unitarios puros (sin dependencias externas)
 * │   ├── domain/     # Tests de entidades y value objects
 * │   └── application/# Tests de casos de uso con mocks
 * ├── integration/    # Tests de integración entre capas
 * │   └── use-cases-with-real-repositories/
 * └── e2e/           # Tests end-to-end (flujo completo CLI)
 *     └── cajero-cli-flow.test.ts
 * 
 * PATRON: Cada archivo en src/ tiene su correspondiente .test.ts en:
 * - src/.../file.ts  -> tests/unit/.../file.test.ts (para tests extensos)
 * - src/.../file.ts  -> src/.../file.test.ts (para tests simples inline)
 */
