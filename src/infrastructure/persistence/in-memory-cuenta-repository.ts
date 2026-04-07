// src/infrastructure/persistence/in-memory-cuenta-repository.ts
// Implementacion del puerto CuentaRepository usando Map en memoria.
// Por que: Para desarrollo y testing sin dependencias externas.
// Para que: Cumplir contrato de dominio con implementacion simple.

import { ok, type Result } from '../../shared/result.js';
import type { CuentaBancaria } from '../../domain/entities/cuenta-bancaria.js';
import type { CuentaRepository } from '../../domain/repositories/cuenta-repository.js';
import type { DomainError } from '../../domain/errors/domain-error.js';

export class InMemoryCuentaRepository implements CuentaRepository {
  private readonly store = new Map<string, CuentaBancaria>();

  async buscarPorId(id: string): Promise<Result<CuentaBancaria | null, DomainError>> {
    return ok(this.store.get(id) ?? null);
  }

  async guardar(cuenta: CuentaBancaria): Promise<Result<void, DomainError>> {
    this.store.set(cuenta.id, cuenta);
    return ok(undefined);
  }

  async existe(id: string): Promise<Result<boolean, DomainError>> {
    return ok(this.store.has(id));
  }
}
