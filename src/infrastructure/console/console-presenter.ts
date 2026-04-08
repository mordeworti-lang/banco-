// src/infrastructure/console/console-presenter.ts
// Implementacion del puerto Presenter para interfaz de linea de comandos.
// Por que: Adaptador especifico de tecnologia (console).
// Para que: Infrastructure traduce entre Application y mundo externo (CLI).

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import type { Dinero } from '../../domain/value-objects/dinero';
import type { DomainError } from '../../domain/errors/domain-error';
import type { Presenter } from '../../application/ports/output/presenter';

export class ConsolePresenter implements Presenter {
  private rl: readline.Interface | null = null;

  private getInterface(): readline.Interface {
    this.rl ??= readline.createInterface({ input, output });
    return this.rl;
  }

  cerrar(): void {
    this.rl?.close();
    this.rl = null;
  }

  mostrarSaldo(cuentaId: string, saldo: Dinero): void {
    console.log(`Cuenta: ${cuentaId} - Saldo: ${String(saldo.cantidad)} ${saldo.moneda}`);
  }

  mostrarOperacionExitosa(tipo: 'deposito' | 'retiro', monto: Dinero): void {
    console.log(`${tipo === 'deposito' ? 'Deposito' : 'Retiro'} de ${String(monto.cantidad)} ${monto.moneda} exitoso`);
  }

  mostrarError(error: DomainError): void {
    switch (error.kind) {
      case 'insufficient_funds':
        console.error('No tiene saldo suficiente para esta operacion');
        break;
      case 'atm_insufficient_funds':
        console.error('El cajero no tiene suficiente efectivo');
        break;
      case 'account_not_found':
        console.error('Cuenta no encontrada');
        break;
      case 'invalid_amount':
        console.error('Monto invalido');
        break;
      default:
        console.error('Error desconocido');
    }
  }

  async solicitarInput(mensaje: string): Promise<string> {
    return this.getInterface().question(mensaje);
  }

  async confirmarRetiroDisponible(disponible: number, solicitado: number): Promise<boolean> {
    const respuesta = await this.getInterface().question(
      `El cajero solo tiene ${String(disponible)} disponible. Desea retirar ${String(disponible)} en vez de ${String(solicitado)}? (s/n): `
    );
    return respuesta.trim().toLowerCase() === 's' || respuesta.trim().toLowerCase() === 'si';
  }
}
