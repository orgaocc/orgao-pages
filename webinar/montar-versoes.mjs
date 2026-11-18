// Gera as 3 versões da página de inscrição da imersão a partir de _modelo.html (pedido da Bruna, 17/11/2026):
// uma headline e uma cor por versão. Rodar depois de mexer no modelo:  node webinar/montar-versoes.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const IMG = join(AQUI, 'img');

// copy do doc "PÁGINA WEBNÁRIO - DPE", sem mudar uma vírgula; o <em> só marca o trecho em itálico colorido
const VERSOES = [
  { pasta: 'v1', tema: 'oliva', cor: '#74815a', form: 'webinar_v1',
    headline: 'Descubra o real motivo que está te impedindo de engravidar, <em>mesmo com os seus exames normais.</em>' },
  { pasta: 'v2', tema: 'rose', cor: '#b0646a', form: 'webinar_v2', cel: true,
    headline: 'Descubra de uma vez por todas o que está atrapalhando você de engravidar, <em>antes de mais um teste negativo ou de ir direto para a FIV.</em>' },
  { pasta: 'v3', tema: 'cafe', cor: '#74402f', form: 'webinar_v3',
    longa: true,
    headline: 'Saia de um único encontro sabendo <em>o dia da sua ovulação</em>, qual fase da sua fertilidade está em desequilíbrio e o que mudar na sua rotina nos próximos 7 dias.' },
];

// largura e altura de um WebP (VP8, VP8L ou VP8X)
function medidas(arquivo) {
  const b = readFileSync(arquivo);
  const tipo = b.toString('ascii', 12, 16);
  if (tipo === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (tipo === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}
const lista = (prefixo) => readdirSync(IMG).filter((f) => f.startsWith(prefixo) && f.endsWith('.webp')).sort();

const alunas = lista('aluna-');
const fotoAluna = (f, copia) => {
  const [w, h] = medidas(join(IMG, f));
  return `    <img src="/webinar/img/${f}" alt="${copia ? '' : 'Aluna do Programa Conceber'}" width="${w}" height="${h}" loading="lazy"${copia ? ' aria-hidden="true"' : ''}>`;
};
// duas voltas da lista: a animação anda metade do trilho e emenda sem salto
const FAIXA = [...alunas.map((f) => fotoAluna(f, false)), ...alunas.map((f) => fotoAluna(f, true))].join('\n');

// cada print dentro de um celular: mesma moldura pra todos, o print rola dentro da tela e amplia no clique
const PRINTS = lista('depoimento-').map((f, i) => {
  const [w, h] = medidas(join(IMG, f));
  return `        <button class="c-print" type="button" data-zoom="/webinar/img/${f}" aria-label="Ampliar o depoimento ${i + 1}"><img src="/webinar/img/${f}" alt="Depoimento de aluna ${i + 1}" width="${w}" height="${h}" loading="lazy"></button>`;
}).join('\n');

const modelo = readFileSync(join(AQUI, '_modelo.html'), 'utf8');
for (const v of VERSOES) {
  const html = modelo
    .replaceAll('{{HEADLINE_TEXTO}}', v.headline.replace(/<[^>]+>/g, ''))
    .replaceAll('{{HEADLINE}}', v.headline)
    .replaceAll('{{TEMA}}', v.tema)
    .replaceAll('{{COR}}', v.cor)
    .replaceAll('{{FORM}}', v.form)
    // fotos da Dra. Talita: cada versão tem o seu conjunto (v1 sem sufixo; v2 e v3 com -v2/-v3, ver orgao-cc/material-conceber/LEIA-ME.md)
    .replaceAll('{{H1_CLASSE}}', v.longa ? ' class="c-h1-longa"' : v.cel ? ' class="c-h1-cel"' : '')
    .replaceAll('{{SUF}}', v.pasta === 'v1' ? '' : '-' + v.pasta)
    .replace('{{FAIXA}}', FAIXA)
    .replace('{{PRINTS}}', PRINTS);
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`${v.pasta}: sobrou marcador no HTML`);
  mkdirSync(join(AQUI, v.pasta), { recursive: true });
  writeFileSync(join(AQUI, v.pasta, 'index.html'), html);
  console.log(`ok  webinar/${v.pasta}/  (${v.tema}, ${Math.round(html.length / 1024)} KB)`);
}
