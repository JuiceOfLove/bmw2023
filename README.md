# BMW2023
## Инструкция по запуску
Для запуска проекта нужно скачать [Node js](https://nodejs.org/ru).
### Server
Качайте содержимое репозитория. Далее в папке проекта запускаем консоль. Далее запускаем сервер:
```sh
cd server
npm i
npm run start:dev
```

### Client

coming soon

### Сделано Backend

- Регистрация, логирование
- Собрана база данных

### Сделано Frontend

coming soon

#### Важное

В проекте используется облачная база данных. Не пытайтесь что-то поменять и изменить в этом месте
```sh
mongoose.connect('mongodb+srv://admin:T18152229@cluster0.caux6yw.mongodb.net/Bmw2023-demo?retryWrites=true&w=majority')
```
если хотите получить доступ к бд и возможность работать с ней ПОЖАЛУЙСТА сообщите.