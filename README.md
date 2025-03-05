# Тестовое задание

## Цель

Backend сервис для управления статьями базы знаний: добавление, изменение, удаление и получение статей с фильтрацией по тегам. Реализована авторизация и контроль доступа

# Описание проекта

В проекте реализован backend сервис для управления статьями базы знаний с системой аутентификации и авторизации пользователей. Сервис позволяет работать с статьями, включая создание, редактирование, удаление и получение, а также управлять пользователями с возможностью регистрации и авторизации.

## Основные функции

### 1. Пользователи:
- Реализована регистрация и аутентификация пользователей с использованием JWT.
- Пользователи могут только изменять или удалять свои собственные статьи.
- Для авторизации используется Guard с JWT.

### 2. Статьи:
- Каждая статья включает атрибуты: заголовок, содержание, теги и публичный статус.
- CRUD операции для статей (создание, обновление, удаление, получение).
- Фильтрация статей по тегам и публичности.
- Авторизованные пользователи могут создавать, редактировать и удалять статьи. Неавторизованные могут только читать публичные статьи.

## Технологии

- **NestJS**: Фреймворк для создания REST API, использованный для реализации бизнес-логики и структуры приложения.
- **Prisma**: ORM для работы с базой данных PostgreSQL. Используется для обработки операций с данными и обеспечения миграций.
- **PostgreSQL**: Реляционная база данных для хранения информации о пользователях и статьях.
- **JWT (JSON Web Token)**: Механизм для аутентификации и авторизации пользователей.
- **Swagger**: Автоматически генерируемая документация API для удобства использования сервиса.
- **Docker**: Контейнеризация приложения для удобного развертывания и использования в различных средах.

## Дополнительные функции

- Реализован контроль доступа к статьям, где доступ к приватным статьям ограничен только авторизованными пользователями.


## Установка и запуск

1. Создать файл .env и внести в него следующие данные (пример)
```yaml
PORT=8000

DATABASE_URL="postgresql://user:root@localhost:5432/knowledge_base?schema=public"

POSTGRES_USER=user
POSTGRES_PASSWORD=root
POSTGRES_DB=knowledge_base
POSTGRES_PORT=5432

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=root
REDIS_DB=0

JWT_SECRET=4f730576e03d2c9c53b33dbb2764bc4e5771681dccee90eb9cba22d09d56d4c4
JWT_EXPIRE_IN=1h

REFRESH_JWT_SECRET=9e7b1b7520b9d1cc129762228be550ddad526c1a05580996cf412d539899bd02
REFRESH_JWT_EXPIRE_IN=7d
```
2. Запустить докер контейнеры
```bash
docker-compose up --build
```

3. Запустить миграции
```bash
npx prisma migrate dev
```

3. Запустить миграции
```bash
npm run start:dev
```

3. Докуменация swagger доступна по адресу [http://localhost:8000/doc](http://localhost:8000/doc)


4. API будет доступно по адресу [http://localhost:8000/api](http://localhost:8000/api)


# Регистрация и Авторизация

## 1. Регистрация нового пользователя

Для регистрации нового пользователя отправьте `POST` запрос на `http://localhost:8000/api/auth/register` с телом запроса:

```json
{
  "email": "user@gmail.com",
  "username": "user",
  "password": "pass"
}
```

В ответ придет:
```json
{
  "id": "9bf6f278-2e00-4f81-92fb-dbb1ba681762",
  "email": "user@gmail.com"
}
```

## 2. Авторизация пользователя

Для авторизации отправьте `POST` запрос на `http://localhost:8000/api/auth/login` с телом запроса:

```json
{
  "email": "user@gmail.com",
  "password": "pass"
}
```

В ответ придет:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjJhY2M4OS05ZDA4LTRlMjYtYjljMS05Y2ZkY2Y4Y2RmYTkiLCJpYXQiOjE3NDExNzE4ODcsImV4cCI6MTc0MTE3NTQ4N30.OYT5UhkLKCAYhJA6zYjOoLDwxgvLEhGn2g_pDa2IjLI",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjJhY2M4OS05ZDA4LTRlMjYtYjljMS05Y2ZkY2Y4Y2RmYTkiLCJpYXQiOjE3NDExNzE4ODcsImV4cCI6MTc0MTc3NjY4N30.4ogAquMTxqwVd21xqHgNqsyJ6L0CQ-y51JrD5stpuK4"
}
```

## 3. Обновление токена (access-token - 1h)

Для обновления пары токенов отправьте `POST` запрос на `http://localhost:8000/api/auth/refresh` с refresh-token в хемдерах:

```json
{
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjJhY2M4OS05ZDA4LTRlMjYtYjljMS05Y2ZkY2Y4Y2RmYTkiLCJpYXQiOjE3NDExNDc3NjksImV4cCI6MTc0MTc1MjU2OX0.pPE-3jGI9F59c0y_pJkAovsMNRv-UduWkt1AnYj_-Ms",
}
```

В ответ придет:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjJhY2M4OS05ZDA4LTRlMjYtYjljMS05Y2ZkY2Y4Y2RmYTkiLCJpYXQiOjE3NDExNzE4ODcsImV4cCI6MTc0MTE3NTQ4N30.OYT5UhkLKCAYhJA6zYjOoLDwxgvLEhGn2g_pDa2IjLI",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjJhY2M4OS05ZDA4LTRlMjYtYjljMS05Y2ZkY2Y4Y2RmYTkiLCJpYXQiOjE3NDExNzE4ODcsImV4cCI6MTc0MTc3NjY4N30.4ogAquMTxqwVd21xqHgNqsyJ6L0CQ-y51JrD5stpuK4"
}
```

## 4. Выход из авторизации

Для выхода из аккаунта отправьте `POST` запрос на `http://localhost:8000/api/auth/sign-out` с access-token в хемдерах:

```json
{
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjJhY2M4OS05ZDA4LTRlMjYtYjljMS05Y2ZkY2Y4Y2RmYTkiLCJpYXQiOjE3NDExNDc3NjksImV4cCI6MTc0MTc1MjU2OX0.pPE-3jGI9F59c0y_pJkAovsMNRv-UduWkt1AnYj_-Ms",
}
```




