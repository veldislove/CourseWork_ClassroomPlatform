Бекенд платформи управління аудиторіями

Встановлення





Встановіть Python 3.9+.



У директорії backend виконайте:

pip install -r requirements.txt



Запустіть сервер:

uvicorn main:app --reload

Структура





data/schedule.csv: Дані розкладу.



models/classroom.py: Pydantic-моделі.



main.py: FastAPI-застосунок.

Запуск





Сервер запускається на http://localhost:8000.



Перевірте API через http://localhost:8000/docs.