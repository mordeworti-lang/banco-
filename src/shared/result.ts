// src/shared/result.ts
// Pattern: Railway-oriented programming. Representa resultado de operación que puede fallar.
// Por que: Evita excepciones para flujo de control, fuerza manejo de errores en compile-time,
//         permite encadenar operaciones (andThen, map).
// Para que: Cualquier operación que pueda fallar (retiro, deposito, validacion) retorna Result.

export type Result<T, E = Error> =
  | { readonly kind: 'ok'; readonly value: T }
  | { readonly kind: 'err'; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  kind: 'ok',
  value,
});

export const err = <E>(error: E): Result<never, E> => ({
  kind: 'err',
  error,
});

export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  if (result.kind === 'ok') {
    return ok(fn(result.value));
  }
  return result;
};

export const andThen = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  if (result.kind === 'ok') {
    return fn(result.value);
  }
  return result;
};
