// src/domain/repositories/cajero-repository.ts
// Puerto: Persistencia del estado del cajero (efectivo disponible).
// Por que: El cajero puede necesitar recuperar su estado tras reinicio o transaccion concurrente.
// Para que: Aislar logica de persistencia de cajero del dominio.

import type { Cajero } from '../entities/cajero.js';
import type { Result } from '../../shared/result.js';
import type { DomainError } from '../errors/domain-error.js';

export type CajeroRepository = {
  obtener(): Promise<Result<Cajero, DomainError>>;
  guardar(cajero: Cajero): Promise<Result<void, DomainError>>;
};
