
export function getBossImageUrl(bossName: string) {
  // Normaliza: tira espaços extras, troca espaço por underscore, preserva maiúsculas/minúsculas.
  const fileName = bossName.trim().replace(/\s+/g, '_');
  return encodeURI(`https://www.tibiawiki.com.br/wiki/Special:FilePath/${fileName}.gif`);
}
