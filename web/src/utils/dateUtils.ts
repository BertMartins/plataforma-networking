// src/utils/dateUtils.ts
export function getDateTimeBrasil(): Date {
  const agora = new Date();

  // pega a hora atual em UTC
  const utcMillis = agora.getTime() + agora.getTimezoneOffset() * 60000;

  // UTC-3 → subtrai 3 horas pra voltar pro horário de Brasília
  const brasilMillis = utcMillis - 6 * 60 * 60 * 1000;

  return new Date(brasilMillis);
}
