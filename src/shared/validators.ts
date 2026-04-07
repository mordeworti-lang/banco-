// src/shared/validators.ts
// Funciones genericas de validacion reutilizables en todo el dominio y aplicacion.
// Por que: Evitar duplicacion de logica de validacion, centralizar mensajes de error.
// Para que: Validar entradas en constructores, casos de uso, y presentadores.

export const isNonNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value) && value > 0;
};

export const hasMinLength = <T extends { length: number }>(value: T, minLength: number): boolean => {
  return value.length >= minLength;
};

export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};
