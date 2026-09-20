# Biblioteca Blu-ray

Site estático para catalogar a coleção, lista de desejos e ofertas de Blu-ray.

## Estrutura

- `index.html` — interface principal
- `styles.css` — layout responsivo
- `seed.js` — dados iniciais para uso local
- `data.js` — persistência local e API
- `ui-list.js` / `ui-detail.js` — catálogo, ficha e ofertas
- `app.js` — interações
- `config.js` — URL opcional do Apps Script
- `apps-script/Code.gs` — API para persistência no Google Sheets

## Persistência

Sem API configurada, o site usa `localStorage` do navegador.

Para compartilhar os mesmos dados entre computador e celular:

1. Abra a planilha Google usada pela biblioteca.
2. Acesse **Extensões > Apps Script**.
3. Cole o conteúdo de `apps-script/Code.gs`.
4. Troque `TROQUE-ESTE-TOKEN` por uma senha longa e exclusiva.
5. Execute a função `setup()` uma vez e autorize o acesso à planilha.
6. Em **Implantar > Nova implantação > Aplicativo da Web**, execute como você e permita acesso a qualquer pessoa com o link.
7. Copie a URL terminada em `/exec`.
8. No site, abra **Configurações**, informe a URL e o mesmo token.

O token não fica no GitHub. Ele é salvo apenas no navegador em que foi informado.

A função `setup()` cria as abas `Biblioteca` e `Ofertas`. Se `Biblioteca` estiver vazia, ela importa os dados da aba antiga `Filmes` sem alterar essa aba legada.
