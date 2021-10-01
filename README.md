# Grid

1) Зайти в папку First.
2) Скопировать все файлы в папку с сервером.
3) Открыть консоль в папке с сервером:

```
npm install
npx tsc
./alt-server.exe
```

*При необходимости изменить размер чанков в конфиге srvconfig.cfg. Находится в корневой папке сервера.*

Команды в чате:

` /pos - позиция игрока`

` /tp x y z - телепорт`

Реализовал два подхода:
1) First - обработка информации по большей части перекладывается на клиент
2) Second - обработка информации перекладывается на сервер

Как минимум, можно совместить оба подхода в один и производить всю обработку на сервере без использования ColShapes.

Для чата используется стандартный пример к Alt:V.
