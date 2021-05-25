<center>
  <h1>Cacarecos - Ecommerce</h1>
</center>


## 📑 Resumo
Este projeto consiste em uma API para um Ecommerce fictício, que vende produtos próprios das mais variadas categorias. Este projeto tem como objetivo demonstrar meus conhecimentos em criação de APIs, e a capacidade de organização.

## 🔧 Ferramentas & Serviços
- NodeJS
- Typescript
- Express
- Babel
- Typeorm
- Postgres
- Cloudinary
- Jest

## 📖 Como iniciar
1. É necessário configurar as variáveis de ambiente em um arquivo `.env`, preenchendo estes valores:
```env
DATABASE_URL= #production-postgres-database-url
DATABASE_TESTS_URL= #tests-postgres-database-url
JWT_SECRET= #jsonwebtoken-secret
CLOUDINARY_URL= #cloudinary-access-url
```

2. Antes de iniciar a aplicação, é necessário carregar as Migrations, para isso basta digitar o seguinte comando no terminal ou prompt de comando:
```
$ yarn typeorm migration:run
```

- Caso queira rodar os testes, antes será necessário rodar as Migrations na base de dados de testes, com o seguinte comando:
```
$ yarn typeorm-test migration:run
```

- Para rodar os testes, basta inserir o seguinte comando:
```
$ yarn test
```

4. Para iniciar a aplicação em modo de desenvolvimento, basta inserir o seguinte comando:
```
$ yarn dev
```

## 🔑 Licença
[MIT - Jonatan Frederico](./LICENSE)