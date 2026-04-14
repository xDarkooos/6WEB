Запуск рішень

Відкрити термінал у папці з файлами проєкту і запустити потрібний файл командою:
node <назва_файлу>.js <порт>

Приклад: node file_read.js 3000 або перевірити роботу через curl. Для читання файлу: curl -i http://localhost:3000/data
Для запису у файл: curl -X POST http://localhost:3000/data
 -H "Content-Type: application/json" -d "{"name":"Artem","age":20}"

Виконані вправи:

FILE READ
Файл: file_read.js
Маршрут: /data
Зчитує дані з файлу data.json та повертає їх у вигляді JSON-відповіді. У разі помилки читання або некоректного JSON повертає відповідний статус помилки.

FILE WRITE
Файл: file_write.js
Маршрут: /data
Приймає JSON-дані через POST-запит, обробляє їх та зберігає у файл data.json.
