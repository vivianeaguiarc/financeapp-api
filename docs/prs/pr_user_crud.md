# feat(user): implementar CRUD completo de Usuários (POST, GET, GET by ID, PATCH, DELETE)

## Resumo

Esta PR entrega o **CRUD completo de Usuários** na API, com **injeção de dependência** para os casos de uso e repositórios Postgres, **validações** (senha, e-mail, UUID), **tratamento de erros** e **padrão de respostas HTTP** unificado.

## Mudanças principais

- **Rotas**
    - `POST   /api/users` – cria usuário
    - `GET    /api/users` – (opcional se você implementou) lista usuários
    - `GET    /api/users/:userId` – busca por ID
    - `PATCH  /api/users/:userId` – atualiza campos permitidos (`first_name`, `last_name`, `email`, `password`)
    - `DELETE /api/users/:userId` – remove por ID
- **Controllers**
    - `CreateUserController`, `GetUserByIdController` (com DI), `UpdateUserController`, `DeleteUserController`
    - Helpers de validação e respostas HTTP padronizadas (`ok`, `created`, `badRequest`, `notFound`, `serverError`)
- **Use Cases**
    - `CreateUserUseCase`, `GetUserByIdUseCase`, `UpdateUserUseCase`, `DeleteUserUseCase`
    - Lançamento/propagação de `EmailAlreadyInUseError` quando aplicável
- **Repositórios (Postgres)**
    - `PostgresGetUserByIdRepository`, `PostgresCreateUserRepository`, `PostgresUpdateUserRepository`, `PostgresDeleteUserRepository`, `PostgresGetUserByEmailRepository`
- **Infra & organização**
    - Barrel files `index.js` em **controllers**, **use-cases** e **repositories**
    - Ajustes ESM: **todas as imports locais com `.js`** e remoção de ciclos
    - `dotenv` + `pool`/config do `pg`
    - Migração inicial para criação das tabelas (se aplicável)
    - Padronização de mensagens de erro de validação (senha mínima, e-mail válido, UUID)

## Como testar (passo a passo)

1. **Setup**
    - Tenha o Postgres rodando e a base criada.
    - Configure o `.env`:
        ```
        PORT=3000
        DATABASE_URL=postgres://user:password@localhost:5432/financeapp
        ```
    - `npm i`
    - `npm run start:dev`
2. **Fluxos principais**
    - **Create (201)**  
      `POST /api/users` com body:
        ```json
        {
            "first_name": "Viviane",
            "last_name": "Aguiar",
            "email": "viviane@example.com",
            "password": "secret123"
        }
        ```
    - **Get by ID (200/404)**
      `GET /api/users/:userId`
    - **Update (200/400)**
      `PATCH /api/users/:userId` com algum campo permitido; rejeita campos não permitidos
    - **Delete (200/404)**
      `DELETE /api/users/:userId`
3. **Validações**
    - Senha < 6 → `400`
    - E-mail inválido → `400`
    - ID inválido (não-UUID) → `400`
    - Usuário não encontrado → `404`
    - E-mail já em uso → `400` (via `EmailAlreadyInUseError`)

## Tabela de endpoints

| Método | Rota                 | Descrição         | Status esperados   |
| -----: | -------------------- | ----------------- | ------------------ |
|   POST | `/api/users`         | Criar usuário     | 201, 400, 500      |
|    GET | `/api/users`\*       | Listar usuários\* | 200, 500           |
|    GET | `/api/users/:userId` | Buscar por ID     | 200, 400, 404, 500 |
|  PATCH | `/api/users/:userId` | Atualizar campos  | 200, 400, 404, 500 |
| DELETE | `/api/users/:userId` | Remover por ID    | 200, 400, 404, 500 |

> \*Inclua/ajuste a linha do GET “listar” somente se você implementou a rota.

## Considerações de design

- **Injeção de dependência** nos controllers para acoplar casos de uso/repositórios e facilitar testes.
- **ESM estrito**: todas as imports relativas com **`.js`**; remoção de imports circulares.
- **Separação** entre:
    - validação de **formato** (helpers de controller),
    - e validação de **regra de negócio** (use case, ex.: e-mail já em uso).

## Migrações/DB

- Rodar a **migração inicial** para criar as tabelas de usuários (detalhar comando caso esteja usando ferramenta X).
- Garantir índices e unicidade de `email`.

## Variáveis de ambiente

- `PORT` (opcional; default 3000)
- `DATABASE_URL` (obrigatória)

## Checklist

- [x] Rotas CRUD implementadas
- [x] Controllers com DI
- [x] Use cases + repositórios Postgres
- [x] Validações (senha, e-mail, UUID) e mensagens padronizadas
- [x] Respostas HTTP consistentes
- [x] Imports ESM com `.js` e sem ciclos
- [x] Migração inicial do banco
- [x] Testes manuais via Postman/Insomnia

## Riscos & mitigação

- **Ciclos de import (ESM)**: evitados removendo importação de `index.js` dentro de arquivos que ele próprio reexporta.
- **Quebra por variáveis sombreadas**: padronização `PascalCase` para classes e `camelCase` para instâncias (`getUserByIdUseCase`).

## Próximos passos

- Adicionar **teste de integração** por rota.
- Implementar **GET /api/users** (listagem) se ainda não incluído.
- Adicionar **paginação** e **filtros** na listagem.
- Hash de senha e autenticação (quando entrar a feature).

---

### Título sugerido da PR

**feat(user): implementar CRUD completo (POST/GET/GET by ID/PATCH/DELETE) com DI, validações e repositórios Postgres**

### Base/Branch

- **base**: `main`
- **compare**: `feat/user-crud`
