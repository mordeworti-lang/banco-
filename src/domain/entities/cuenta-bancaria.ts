// src/domain/entities/cuenta-bancaria.ts
// Entidad del dominio: Cuenta bancaria con reglas de negocio invariantes.
// Por que: Encapsula estado y comportamiento, protege invariantes (saldo >= 0).
// Para que: Application orquesta, pero la logica de negocio pura vive aqui.

import { add, subtract, type Dinero, isGreaterThan } from '../value-objects/dinero';
import { insufficientFunds, type DomainError } from '../errors/domain-error';
import { isNonNullish } from '../../shared/validators';
import { ok, err, type Result } from '../../shared/result';

export class CuentaBancaria {
  private _saldo: Dinero;
  private readonly _titular: string;
  readonly id: string;

  constructor(id: string, titular: string, saldoInicial: Dinero) {
    if (!isNonNullish(titular) || titular.length === 0) {
      throw new Error('Titular requerido');
    }
    this.id = id;
    this._titular = titular;
    this._saldo = saldoInicial;
    Object.freeze(this.id);
  }

  get saldo(): Dinero {
    return this._saldo;
  }

  get titular(): string {
    return this._titular;
  }

  depositar(monto: Dinero): Result<void, DomainError> {
    const result = add(this._saldo, monto);
    if (result.kind === 'err') {
      return err(result.error);
    }
    this._saldo = result.value;
    return ok(undefined);
  }

  retirar(monto: Dinero): Result<void, DomainError> {
    if (!this.tieneSaldoSuficiente(monto)) {
      return err(insufficientFunds(this.id));
    }
    const result = subtract(this._saldo, monto);
    if (result.kind === 'err') {
      return err(result.error);
    }
    this._saldo = result.value;
    return ok(undefined);
  }

  tieneSaldoSuficiente(monto: Dinero): boolean {
    return isGreaterThan(this._saldo, monto) || this._saldo.cantidad === monto.cantidad;
  }
}
