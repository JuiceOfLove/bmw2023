# BMW2023
## Инструкция по запуску
Для запуска проекта нужно скачать [Node js](https://nodejs.org/ru).
Для работы с БД следует скачать [pgAdmin](https://www.pgadmin.org/).
### Server
Качайте содержимое репозитория. Далее в папке проекта запускаем консоль. Далее запускаем сервер:
```sh
cd server
npm i
npm run start:dev
```

### Client

```sh
cd client
npm i
npm run start
```

### Versions

**V0.5** - *current*

#### Client
- Добавлена логика админки
- Доработка рутов

#### Server
- refreshToken full fix
- models fix
- upload new user info bug fix
- userService small fix

**V0.4**

#### Client
- Добавлена логика для Layout
- Изменина логика хранения изображений
- checkAuth localStorage fix

#### Server
- refreshToken fix
- response error text fix

**V0.3**

- Добавлена страница авторизации
- Логика refresh token изменена *(на рассмотрении)
- Прописана логика маршрутизации для пользователя
- Импортированы шрифты
- Изменена структура frontend части
- Реализовано система отслеживания состояний через mobx
- Некоторые фиксы

**V0.2**

- Переписана логика регистрации и авторизации
- Добавлены cookie
- Добавлено подтверждение аккаунта через почту
- Изменена база данных на PostgreSQL

**V0.1**

- Реализована авторизация и регистрация
- Подключена MongoDB