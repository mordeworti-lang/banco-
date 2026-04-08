// src/infrastructure/persistence/in-memory-cuenta-repository.ts
// Implementacion del puerto CuentaRepository usando Map en memoria.
// Por que: Para desarrollo y testing sin dependencias externas.
// Para que: Cumplir contrato de dominio con implementacion simple.

import { ok, type Result } from '../../shared/result';
import type { CuentaBancaria } from '../../domain/entities/cuenta-bancaria';
import type { CuentaRepository } from '../../domain/repositories/cuenta-repository';
import type { DomainError } from '../../domain/errors/domain-error';

export class InMemoryCuentaRepository implements CuentaRepository {
  private readonly store = new Map<string, CuentaBancaria>();

  buscarPorId(id: string): Promise<Result<CuentaBancaria | null, DomainError>> {
    return Promise.resolve(ok(this.store.get(id) ?? null));
  }

  guardar(cuenta: CuentaBancaria): Promise<Result<void, DomainError>> {
    this.store.set(cuenta.id, cuenta);
    return Promise.resolve(ok(undefined));
  }

  existe(id: string): Promise<Result<boolean, DomainError>> {
    return Promise.resolve(ok(this.store.has(id)));
  }
}
