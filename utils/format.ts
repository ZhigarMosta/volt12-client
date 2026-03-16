/**
 * Форматирует цену в строку с символом рубля и разделителями тысяч
 */
export function formatPrice(price: number): string {
  return `₽ ${price.toLocaleString('ru-RU')}`;
}
