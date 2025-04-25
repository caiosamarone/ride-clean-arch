# Ride Clean Architecture

Este projeto é uma aplicação backend desenvolvida com **Node.js** e **TypeScript**, seguindo os princípios de **Clean Architecture**. O objetivo é fornecer uma estrutura robusta e escalável para gerenciar corridas (rides) e usuários, com foco em boas práticas de design de software.

## Estrutura do Projeto

A estrutura do projeto é organizada para refletir os princípios de Clean Architecture, separando responsabilidades em diferentes camadas:

```
├── database/                # Configuração do banco de dados
├── resources/               # Recursos visuais e diagramas
├── src/                     # Código-fonte principal
│   ├── controller/          # Controladores das rotas
│   ├── entity/              # Entidades do domínio
│   ├── errors/              # Classes de erro personalizadas
│   ├── factory/             # Fábricas para casos de uso
│   ├── repository/          # Implementações de repositórios
│   ├── use-case/            # Casos de uso
│   └── main.ts              # Ponto de entrada da aplicação
├── test/                    # Testes automatizados
├── create.sql               # Script de criação do banco de dados
├── docker-compose.yml       # Configuração para Docker
├── environment.ts           # Configurações de ambiente
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração do TypeScript
```

## Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **PostgreSQL**
- **pg-promise** (para integração com o banco de dados)
- **Jest** (para testes automatizados)
- **Docker** (para containerização)

## Funcionalidades

### Usuários

- Criação de usuários com validação de CPF e placa de carro.
- Diferenciação entre passageiros e motoristas.

### Corridas (Rides)

- Solicitação de corridas.
- Busca de corridas por ID.
- Gerenciamento de status das corridas.

## Configuração do Banco de Dados

O banco de dados é configurado no arquivo `create.sql`. Ele contém dois esquemas principais:

- **ccca.account**: Gerencia informações de usuários.
- **ccca.ride**: Gerencia informações de corridas.

### Exemplo de Criação do Banco de Dados

Para criar o banco de dados, execute o script `create.sql`:

```bash
psql -U postgres -d app -f create.sql
```

## Testes

Os testes automatizados estão localizados na pasta `test/` e utilizam o framework **Jest**. Para executar os testes, use o comando:

```bash
npm test
```

## Executando a Aplicação

### Pré-requisitos

- Node.js instalado
- PostgreSQL configurado
- Docker (opcional, para containerização)

### Passos

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o banco de dados executando o script `create.sql`.

3. Inicie a aplicação:

   ```bash
   npm start
   ```

4. Acesse os endpoints da API, como por exemplo:
   ```bash
   GET http://localhost:3333/ride/:id
   ```

## Diagramas

Os diagramas na pasta `resources/` ajudam a entender a arquitetura e o design do projeto:

- **Algoritmo de Validação de CPF** (`algoritmo_validacao_cpf.png`)
- **Arquitetura de Design de Código** (`code_design_architecture.png`)
- **Test First** (`test_first.png`)
- **Pirâmide de Testes** (`test_pyramid.png`)
