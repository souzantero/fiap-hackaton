# FIAP HACKATHON

## Primeiros Passos

Estas instruções irão ajudá-lo a obter uma cópia do projeto em sua máquina local para fins de desenvolvimento e testes.

### Pré-requisitos

O que você precisa instalar na sua máquina local.

- Node.js (v20.11)
- Docker

### Instalação

Como configurar o ambiente de desenvolvimento.

```bash
# Clone o repositório
git clone https://github.com/souzantero/fiap-tech-challenge-product.git

# Acesse o diretório
cd fiap-tech-challenge-product/

# Instale as dependências
npm install
```

## Iniciando o servidor

Como iniciar o servidor em modo de desenvolvimento.

Crie um arquivo `.env` na raiz do diretório e cole o seguinte conteúdo.

```
PORT=_PORT_
DATABASE_URL=_DATABASE_URL_
AUTHORIZATION_URL=_AUTHORIZATION_URL_
```

Obs: Se estiver executando o serviço de autorização localmente altere a URL pelo endereço do localhost

Execute o serviço Docker Compose para iniciar o Mongo.

```bash
docker-compose up -d database
```

Inicie a aplicação.

```bash
npm run start:dev
```

Para iniciar em modo de produção.

```bash
npm run build
npm run start
```

## Open API

Para acessar o painel Open API e visualizar os endpoints disponíveis na API. 

`http://localhost:{port}/api/docs`

## Construído com

- [Node.js](http://www.nodejs.org/) - A estrutura do servidor em tempo de execução.
- [TypeScript](https://www.typescriptlang.org/) - Usado para tipagem estática no JavaScript.
- [Express.js](https://expressjs.com/) - Estrutura de aplicativo da web Node.js.
- [Prisma](https://www.prisma.io/) - ORM Node.js e TypeScript.

## Autores

- **Felipe Antero** - _Trabalho inicial_ - [souzantero](https://github.com/souzantero)

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE.md](LICENSE.md) para obter detalhes.
