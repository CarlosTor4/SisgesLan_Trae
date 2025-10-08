export function maskCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export function maskRG(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{1})\d+?$/, "$1");
}

export function maskCurrency(value: string | number): string {
  if (!value && value !== 0) return '';
  
  // Converte para string e remove caracteres não numéricos, exceto vírgula e ponto
  let numericValue = String(value).replace(/[^\d.,]/g, '');
  
  // Converte para número (considerando vírgula como separador decimal)
  let numValue = parseFloat(numericValue.replace(',', '.'));
  
  // Se não for um número válido, retorna vazio
  if (isNaN(numValue)) return '';
  
  // Formata o número como moeda brasileira
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}