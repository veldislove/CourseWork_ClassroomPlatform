import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './ScheduleSearch.css';

const ScheduleSearch = () => {
  const [searchType, setSearchType] = useState('classroom');
  const [searchValue, setSearchValue] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(null);

  const validateInput = async () => {
    setError('');
    setIsValid(null);
    console.log('Validating:', { searchType, searchValue });
    if (!searchValue.trim()) {
      setError('Введіть значення для пошуку');
      return false;
    }
    try {
      let response;
      if (searchType === 'classroom') {
        response = await axios.get(`http://localhost:8000/classrooms/validate?name=${encodeURIComponent(searchValue)}`);
      } else if (searchType === 'teacher') {
        response = await axios.get(`http://localhost:8000/users/validate?name=${encodeURIComponent(searchValue)}`);
      } else if (searchType === 'group') {
        response = await axios.get(`http://localhost:8000/schedules/validate?name=${encodeURIComponent(searchValue)}`);
      }
      console.log('Validation response:', response.data);
      setIsValid(response.data.exists);
      if (!response.data.exists) {
        setError('Такого значення не знайдено в базі');
        return false;
      }
      return response.data.id || true;
    } catch (err) {
      console.error('Validation error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || err.message;
      setError(`Помилка перевірки: ${errorMessage}`);
      return false;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSchedules([]);
    setLoading(true);
    console.log('Search triggered:', { searchType, searchValue });

    try {
      const isValidInput = await validateInput();
      if (!isValidInput) {
        setLoading(false);
        return;
      }

      let response;
      if (searchType === 'classroom') {
        console.log(`Fetching schedules for classroom ID: ${isValidInput}`);
        response = await axios.get(`http://localhost:8000/classrooms/${isValidInput}/schedule`);
      } else if (searchType === 'teacher') {
        console.log(`Fetching schedules for teacher ID: ${isValidInput}`);
        response = await axios.get(`http://localhost:8000/schedules/by_teacher/${isValidInput}`);
      } else if (searchType === 'group') {
        console.log(`Fetching schedules for group ID: ${isValidInput}`);
        response = await axios.get(`http://localhost:8000/schedules/by_group/${isValidInput}`);
      }
      console.log('Schedules response:', JSON.stringify(response.data, null, 2));
      setSchedules(response.data);
    } catch (err) {
      console.error('Search error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || err.message;
      setError(`Не вдалося знайти розклад: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('uk-UA', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Пошук розкладу
      </motion.h1>
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue('');
                setIsValid(null);
                setError('');
                setSchedules([]); // Очищення таблички розкладу при зміні типу пошуку
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="classroom">Аудиторія</option>
              <option value="teacher">Викладач</option>
              <option value="group">Група</option>
            </select>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === 'classroom'
                  ? 'Введіть номер аудиторії (803)'
                  : searchType === 'teacher'
                  ? 'Введіть ПІБ (Іванов Іван Іванович)'
                  : 'Введіть групу (ОІ-33)'
              }
              className="flex-1 border-b-2 border-gray-200 focus:border-blue-500 px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="0 150" />
                </svg>
              ) : (
                'Пошук'
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          {isValid === false && (
            <p className="mt-2 text-red-600 text-sm">Введено некоректне значення.</p>
          )}
        </form>

        <AnimatePresence>
          {schedules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="overflow-x-auto"
            >
              <table className="schedule-table w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4 text-sm">Аудиторія</th>
                    <th className="py-2 px-4 text-sm">Предмет</th>
                    <th className="py-2 px-4 text-sm">Група</th>
                    <th className="py-2 px-4 text-sm">Викладач</th>
                    <th className="py-2 px-4 text-sm">Початок</th>
                    <th className="py-2 px-4 text-sm">Кінець</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <motion.tr
                      key={schedule.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: schedules.indexOf(schedule) * 0.1 }}
                      className="border-b hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="py-2 px-4 text-sm">{schedule.classroom ? schedule.classroom.name : 'Невідома аудиторія'}</td>
                      <td className="py-2 px-4 text-sm">{schedule.subject ? schedule.subject.name : 'Немає предмета'}</td>
                      <td className="py-2 px-4 text-sm">{schedule.group ? schedule.group.name : 'Немає групи'}</td>
                      <td className="py-2 px-4 text-sm">{schedule.teacher ? schedule.teacher.name : 'Немає викладача'}</td>
                      <td className="py-2 px-4 text-sm">{formatDateTime(schedule.start_time)}</td>
                      <td className="py-2 px-4 text-sm">{formatDateTime(schedule.end_time)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && schedules.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-4">Розклад не знайдено.</p>
        )}
      </div>
    </div>
  );
};

export default ScheduleSearch;