# História de Usuário: Filtros e Busca no Catálogo

**Como** cliente da loja online,
**Quero** buscar e filtrar produtos no catálogo,
**Para** encontrar rapidamente o produto que preciso.

## Critérios de Aceite

- CA01: Ao buscar por nome (ex: "pliers"), os resultados devem conter produtos com aquele termo
- CA02: Ao clicar em um produto dos resultados, sou levado à sua página de detalhe
- CA03: Ao buscar com um termo inexistente, uma mensagem informativa é exibida
- CA04: A busca funciona com termos parciais (ex: "plier" encontra "Combination Pliers")
- CA05: Ao limpar a busca, todos os produtos são exibidos novamente

## Contexto Técnico

- URL base: https://practicesoftwaretesting.com
- Page Objects disponíveis: `CatalogPage`, `ProductPage`
- Autenticação **não** é necessária para navegar no catálogo
- Elemento de reset de busca mapeado em `CatalogPage.botaoResetBusca`
