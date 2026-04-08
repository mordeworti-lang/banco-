// src/application/use-cases/retirar-dinero.ts
// Caso de uso: Retirar dinero validando fondos de cuenta Y disponibilidad en cajero.
// Por que: Es el mas complejo, requiere dos validaciones (cuenta saldo, cajero efectivo).
// Para que: Transaccion segura que no deja inconsistencias (si cajero no tiene, no se debita cuenta).

import type { CuentaRepository } from '../../domain/repositories/cuenta-repository';
import type { CajeroRepository } from '../../domain/repositories/cajero-repository';
import type { Presenter } from '../ports/output/presenter';
import type { RetirarInput } from '../ports/input/retirar-input';
import { createDinero } from '../../domain/value-objects/dinero';
import { accountNotFound } from '../../domain/errors/domain-error';

export class RetirarDineroUseCase {
  constructor(
    private readonly cuentaRepo: CuentaRepository,
    private readonly cajeroRepo: CajeroRepository,
    private readonly presenter: Presenter
  ) {}

  async ejecutar(input: RetirarInput): Promise<void> {
    const [cuentaResult, cajeroResult] = await Promise.all([
      this.cuentaRepo.buscarPorId(input.cuentaId),
      this.cajeroRepo.obtener(),
    ]);
    if (cuentaResult.kind === 'err') {
      this.presenter.mostrarError(cuentaResult.error);
      return;
    }
    if (cajeroResult.kind === 'err') {
      this.presenter.mostrarError(cajeroResult.error);
      return;
    }
    const cuenta = cuentaResult.value;
    const cajero = cajeroResult.value;
    if (!cuenta) {
      this.presenter.mostrarError(accountNotFound(input.cuentaId));
      return;
    }

    let montoARetirar = input.monto;

    // Si el cajero no puede dispensar el monto solicitado, preguntar si quiere lo disponible
    if (!cajero.puedeDispensar(input.monto)) {
      const disponible = cajero.efectivoDisponible.cantidad;
      const quiereDisponible = await this.presenter.confirmarRetiroDisponible(disponible, input.monto.cantidad);
      if (!quiereDisponible) {
        return;
      }
      const dineroDisponible = createDinero(disponible, input.monto.moneda);
      if (dineroDisponible.kind === 'err') {
        this.presenter.mostrarError(dineroDisponible.error);
        return;
      }
      montoARetirar = dineroDisponible.value;
    }

    const retiroResult = cuenta.retirar(montoARetirar);
    if (retiroResult.kind === 'err') {
      this.presenter.mostrarError(retiroResult.error);
      return;
    }
    const dispensarResult = cajero.dispensar(montoARetirar);
    if (dispensarResult.kind === 'err') {
      this.presenter.mostrarError(dispensarResult.error);
      return;
    }
    const [guardarCuentaResult, guardarCajeroResult] = await Promise.all([
      this.cuentaRepo.guardar(cuenta),
      this.cajeroRepo.guardar(cajero),
    ]);
    if (guardarCuentaResult.kind === 'err') {
      this.presenter.mostrarError(guardarCuentaResult.error);
      return;
    }
    if (guardarCajeroResult.kind === 'err') {
      this.presenter.mostrarError(guardarCajeroResult.error);
      return;
    }
    this.presenter.mostrarOperacionExitosa('retiro', montoARetirar);
  }
}
