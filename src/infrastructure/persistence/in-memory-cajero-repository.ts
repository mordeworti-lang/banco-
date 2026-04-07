// src/infrastructure/persistence/in-memory-cajero-repository.ts
// Implementacion del puerto CajeroRepository.
// Por que: Singleton del cajero en memoria para este ejercicio.
// Para que: Simular persistencia del estado del cajero.

import { ok, type Result } from '../../shared/result.js';
import { Cajero } from '../../domain/entities/cajero.js';
import type { CajeroRepository } from '../../domain/repositories/cajero-repository.js';
import type { DomainError } from '../../domain/errors/domain-error.js';
import type { Moneda } from '../../domain/value-objects/dinero.js';

export class InMemoryCajeroRepository implements CajeroRepository {
  private cajero: Cajero | null = null;
  private readonly id = 'cajero-001';
  private readonly efectivoInicial = 10000;
  private readonly moneda: Moneda = 'USD';

  async obtener(): Promise<Result<Cajero, DomainError>> {
    if (!this.cajero) {
      const { createDinero } = await import('../../domain/value-objects/dinero.js');
      const dineroResult = createDinero(this.efectivoInicial, this.moneda);
      if (dineroResult.kind === 'err') {
        return dineroResult;
      }
      this.cajero = new Cajero(this.id, dineroResult.value);
    }
    return ok(this.cajero);
  }

  async guardar(cajero: Cajero): Promise<Result<void, DomainError>> {
    this.cajero = cajero;
    return ok(undefined);
  }
}
