// src/domain/errors/domain-error.ts
// Error base para todo el dominio. Permite discriminar errores de negocio vs tecnicos.
// Por que: TypeScript permite instanceof pero discriminacion por propiedad es mas flexible.
// Para que: Catcher en capa superior puede switch sobre error.kind y decidir mensaje al usuario.

export type DomainError =
  | { readonly kind: 'insufficient_funds'; readonly message: string; readonly cuentaId: string }
  | { readonly kind: 'account_not_found'; readonly message: string; readonly cuentaId: string }
  | { readonly kind: 'invalid_amount'; readonly message: string; readonly monto: number }
  | { readonly kind: 'atm_insufficient_funds'; readonly message: string; readonly disponible: number };

export const insufficientFunds = (cuentaId: string): DomainError => ({
  kind: 'insufficient_funds',
  message: `Saldo insuficiente en cuenta ${cuentaId}`,
  cuentaId,
});

export const accountNotFound = (cuentaId: string): DomainError => ({
  kind: 'account_not_found',
  message: `Cuenta ${cuentaId} no encontrada`,
  cuentaId,
});

export const invalidAmount = (monto: number): DomainError => ({
  kind: 'invalid_amount',
  message: `Monto invalido: ${String(monto)}`,
  monto,
});

export const atmInsufficientFunds = (disponible: number): DomainError => ({
  kind: 'atm_insufficient_funds',
  message: `Cajero sin fondos suficientes. Disponible: ${String(disponible)}`,
  disponible,
});
