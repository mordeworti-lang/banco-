// src/infrastructure/console/menu-controller.ts
// Controlador de flujo principal: Login inicial, luego menu cliente o admin.
// Por que: Separar flujos segun tipo de usuario, no preguntar ID en cada accion.
// Para que: UX mas limpia, admin puede recargar cajero.

import type { Presenter } from '../../application/ports/output/presenter';
import type { ConsultarSaldoUseCase } from '../../application/use-cases/consultar-saldo';
import type { DepositarDineroUseCase } from '../../application/use-cases/depositar-dinero';
import type { RetirarDineroUseCase } from '../../application/use-cases/retirar-dinero';
import type { RecargarCajeroUseCase } from '../../application/use-cases/recargar-cajero';
import { createConsultarSaldoInput } from '../../application/ports/input/consultar-saldo-input';
import { createDepositarInput } from '../../application/ports/input/depositar-input';
import { createRetirarInput } from '../../application/ports/input/retirar-input';
import { createDinero, type Moneda } from '../../domain/value-objects/dinero';

export class MenuController {
  constructor(
    private readonly presenter: Presenter,
    private readonly consultarSaldo: ConsultarSaldoUseCase,
    private readonly depositarDinero: DepositarDineroUseCase,
    private readonly retirarDinero: RetirarDineroUseCase,
    private readonly recargarCajero: RecargarCajeroUseCase
  ) {}

  async iniciar(): Promise<void> {
    let sesionActiva = true;
    while (sesionActiva) {
      console.log('\n=== CAJERO AUTOMATICO ===');
      console.log('1. Iniciar sesion');
      console.log('0. Salir');
      
      const opcion = await this.presenter.solicitarInput('Seleccione opcion: ');
      
      switch (opcion.trim()) {
        case '1': {
          const cuentaId = await this.presenter.solicitarInput('Ingrese su Cuenta ID: ');
          if (cuentaId.toLowerCase() === 'salir') continue;
          
          if (cuentaId.startsWith('admin-')) {
            const continuar = await this.menuAdministrador();
            if (!continuar) sesionActiva = false;
          } else {
            const continuar = await this.menuCliente(cuentaId);
            if (!continuar) sesionActiva = false;
          }
          break;
        }
        case '0':
          sesionActiva = false;
          console.log('Gracias por usar el cajero. Hasta luego!');
          break;
        default:
          console.log('Opcion invalida');
      }
    }
  }

  private async menuCliente(cuentaId: string): Promise<boolean> {
    let activo = true;
    while (activo) {
      console.log('\n=== MENU CLIENTE ===');
      console.log('Cuenta: ' + cuentaId);
      console.log('1. Consultar saldo');
      console.log('2. Depositar dinero');
      console.log('3. Retirar dinero');
      console.log('4. Cerrar sesion (volver a login)');
      console.log('0. Salir del sistema');
      
      try {
        const opcion = await this.presenter.solicitarInput('Seleccione opcion: ');
        
        switch (opcion.trim()) {
          case '1': {
            const input = createConsultarSaldoInput(cuentaId);
            if (input.kind === 'ok') {
              await this.consultarSaldo.ejecutar(input.value);
            } else {
              this.presenter.mostrarError(input.error);
            }
            break;
          }
          case '2': {
            const cantidad = Number(await this.presenter.solicitarInput('Monto: '));
            const input = createDepositarInput(cuentaId, cantidad, 'USD' as Moneda);
            if (input.kind === 'ok') {
              await this.depositarDinero.ejecutar(input.value);
            } else {
              this.presenter.mostrarError(input.error);
            }
            break;
          }
          case '3': {
            const cantidad = Number(await this.presenter.solicitarInput('Monto: '));
            const input = createRetirarInput(cuentaId, cantidad, 'USD' as Moneda);
            if (input.kind === 'ok') {
              await this.retirarDinero.ejecutar(input.value);
            } else {
              this.presenter.mostrarError(input.error);
            }
            break;
          }
          case '4':
            activo = false;
            return true;
          case '0':
            activo = false;
            console.log('Gracias por usar el cajero. Hasta luego!');
            return false;
          default:
            console.log('Opcion invalida');
        }
      } catch (error: unknown) {
        this.presenter.mostrarError({ kind: 'invalid_amount', message: String(error), monto: 0 });
      }
    }
    return true;
  }

  private async menuAdministrador(): Promise<boolean> {
    let activo = true;
    while (activo) {
      console.log('\n=== MENU ADMINISTRADOR ===');
      console.log('1. Recargar cajero');
      console.log('2. Cerrar sesion (volver a login)');
      console.log('0. Salir del sistema');
      
      try {
        const opcion = await this.presenter.solicitarInput('Seleccione opcion: ');
        
        switch (opcion.trim()) {
          case '1': {
            const cantidad = Number(await this.presenter.solicitarInput('Monto a recargar: '));
            const dinero = createDinero(cantidad, 'USD');
            if (dinero.kind === 'ok') {
              await this.recargarCajero.ejecutar({ monto: dinero.value });
            } else {
              this.presenter.mostrarError(dinero.error);
            }
            break;
          }
          case '2':
            activo = false;
            console.log('Sesion admin cerrada');
            return true;
          case '0':
            activo = false;
            console.log('Gracias por usar el cajero. Hasta luego!');
            return false;
          default:
            console.log('Opcion invalida');
        }
      } catch (error: unknown) {
        this.presenter.mostrarError({ kind: 'invalid_amount', message: String(error), monto: 0 });
      }
    }
    return true;
  }
}
