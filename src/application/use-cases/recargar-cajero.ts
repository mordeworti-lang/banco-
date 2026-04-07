// src/application/use-cases/recargar-cajero.ts
// Caso de uso: Recargar efectivo en el cajero (admin only).
// Por que: Mantener el cajero operativo cuando se agota el efectivo.
// Para que: Administrador pueda agregar billetes al cajero.

import type { CajeroRepository } from '../../domain/repositories/cajero-repository.js';
import type { Presenter } from '../ports/output/presenter.js';
import type { Dinero } from '../../domain/value-objects/dinero.js';

export type RecargarCajeroInput = {
  monto: Dinero;
};

export class RecargarCajeroUseCase {
  constructor(
    private readonly cajeroRepo: CajeroRepository,
    private readonly presenter: Presenter
  ) {}

  async ejecutar(input: RecargarCajeroInput): Promise<void> {
    const cajeroResult = await this.cajeroRepo.obtener();
    if (cajeroResult.kind === 'err') {
      this.presenter.mostrarError(cajeroResult.error);
      return;
    }
    const cajero = cajeroResult.value;
    const recargaResult = cajero.recargarEfectivo(input.monto);
    if (recargaResult.kind === 'err') {
      this.presenter.mostrarError(recargaResult.error);
      return;
    }
    const guardarResult = await this.cajeroRepo.guardar(cajero);
    if (guardarResult.kind === 'err') {
      this.presenter.mostrarError(guardarResult.error);
      return;
    }
    console.log(`Cajero recargado. Nuevo disponible: ${cajero.efectivoDisponible.cantidad} ${cajero.efectivoDisponible.moneda}`);
  }
}
