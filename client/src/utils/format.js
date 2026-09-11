export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(valor || 0);
}

export function formatarData(data) {
  if (!data) return '—';
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(data)
  );
}

export function formatarDataHora(data) {
  if (!data) return '—';
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(data));
}

export function nomeMes(mes) {
  return MESES[Number(mes) - 1] || mes;
}
