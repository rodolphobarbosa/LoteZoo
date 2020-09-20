# LoteZoo

Resultados da loterias de Jogo do bicho do Brasil. Feed atualizado a cada minuto e consulta a resultados por banca.

## Overview

  Consumo de dados de API externa, transformação e cache dos resultados.
View gerada dinamicamente com PugJs.
Requisições agendadas por minuto para consumo da API.
***
### Installation

  `npm install`
Package gerado inicialmente com [express-generator](https://expressjs.com/en/starter/generator.html);

### Uso

Inicie o Express com `devstart`.
[Tasker de job](https://www.npmjs.com/package/node-cron) iniciado juntamente, para desabilitar comente a chamada em `loteria.js`.
**Obs**: A API não é disponibilizada para cópia, e atualmente você só poderá visualizar os últimos resultados.
***
### Contribuindo
  Qualquer PR é bem-vinda, alterações além da views crie um branch, commite e submeta que irei testar e dar merge se for o caso. Me contate se desejar ser um contribuidor ativo.

#### Licença
  [AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) Livre para a cópia, contanto que mantenha créditos e a mesma licença.
