// src/domain/entities/cajero.ts
// Entidad: Cajero automatico con efectivo fisico disponible.
// Por que: El cajero es independiente de las cuentas, tiene su propio estado (efectivo).
// Para que: Validar que hay billetes suficientes antes de dispensar, track de disponibilidad.

import { add, subtract, type Dinero } from '../value-objects/dinero';
import { atmInsufficientFunds, type DomainError } from '../errors/domain-error';
import { ok, err, type Result } from '../../shared/result';

export class Cajero {
  private _efectivoDisponible: Dinero;
  private readonly _id: string;

  constructor(id: string, efectivoInicial: Dinero) {
    if (efectivoInicial.cantidad < 0) {
      throw new Error('Efectivo inicial no puede ser negativo');
    }
    this._id = id;
    this._efectivoDisponible = efectivoInicial;
  }

  get id(): string {
    return this._id;
  }

  get efectivoDisponible(): Dinero {
    return this._efectivoDisponible;
  }

  puedeDispensar(monto: Dinero): boolean {
    return monto.cantidad <= this._efectivoDisponible.cantidad && monto.moneda === this._efectivoDisponible.moneda;
  }

  dispensar(monto: Dinero): Result<Dinero, DomainError> {
    if (!this.puedeDispensar(monto)) {
      return err(atmInsufficientFunds(this._efectivoDisponible.cantidad));
    }
    const result = subtract(this._efectivoDisponible, monto);
    if (result.kind === 'err') {
      return err(result.error);
    }
    this._efectivoDisponible = result.value;
    return ok(monto);
  }

  recargarEfectivo(monto: Dinero): Result<void, DomainError> {
    const result = add(this._efectivoDisponible, monto);
    if (result.kind === 'err') {
      return err(result.error);
    }
    this._efectivoDisponible = result.value;
    return ok(undefined);
  }
}
