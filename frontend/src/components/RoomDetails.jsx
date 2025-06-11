import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const RoomDetails = ({ classroomId, onClose }) => {
  const [classroom, setClassroom] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentgroups, setStudentgroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [request, setRequest] = useState({
    subject_id: '',
    studentgroup_id: '',
    teacher_id: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching details for classroomId:', classroomId);

        if (!classroomId || isNaN(classroomId)) {
          throw new Error('Некоректний ID аудиторії');
        }

        const [classroomRes, schedulesRes, subjectsRes, studentgroupsRes, teachersRes] = await Promise.all([
          axios.get(`http://localhost:8000/classrooms/${classroomId}`).catch((err) => {
            console.error('Classroom fetch error:', err.response?.status, err.message);
            throw err;
          }),
          axios.get(`http://localhost:8000/classrooms/${classroomId}/schedule`).catch((err) => {
            console.error('Schedules fetch error:', err.response?.status, err.message);
            throw err;
          }),
          axios.get('http://localhost:8000/subjects').catch((err) => {
            console.error('Subjects fetch error:', err.response?.status, err.message);
            throw err;
          }),
          axios.get('http://localhost:8000/studentgroups').catch((err) => {
            console.error('Studentgroups fetch error:', err.response?.status, err.message);
            throw err;
          }),
          axios.get('http://localhost:8000/users').catch((err) => {
            console.error('Teachers fetch error:', err.response?.status, err.message);
            throw err;
          }),
        ]);

        console.log('Classroom response:', classroomRes.data);
        console.log('Schedules response:', schedulesRes.data);
        console.log('Subjects response:', subjectsRes.data);
        console.log('Studentgroups response:', studentgroupsRes.data);
        console.log('Teachers response:', teachersRes.data);

        setClassroom(classroomRes.data);
        setSchedules(
          schedulesRes.data.map((schedule) => ({
            ...schedule,
            subject: schedule.subject || { name: 'Немає' },
            group: schedule.group || { name: 'Немає' },
            teacher: schedule.teacher || { name: 'Немає' },
          }))
        );
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
        setStudentgroups(Array.isArray(studentgroupsRes.data) ? studentgroupsRes.data : []);
        setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch details error:', err.message, err.response?.data);
        setError('Помилка завантаження даних: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      }
    };
    fetchDetails();
  }, [classroomId]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const { subject_id, studentgroup_id, teacher_id, start_time, end_time } = request;
    if (!subject_id || !studentgroup_id || !teacher_id || !start_time || !end_time) {
      setError('Заповніть усі поля');
      return;
    }
    if (new Date(start_time) >= new Date(end_time)) {
      setError('Час закінчення має бути пізніше за час початку');
      return;
    }
    try {
      const requestData = {
        classroom_id: parseInt(classroomId),
        subject_id: parseInt(subject_id) || null,
        studentgroup_id: parseInt(studentgroup_id) || null,
        teacher_id: parseInt(teacher_id) || null,
        start_time: new Date(start_time).toISOString().slice(0, 19).replace('T', ' '), // YYYY-MM-DD HH:MM:SS
        end_time: new Date(end_time).toISOString().slice(0, 19).replace('T', ' '),
        status: 'pending',
      };
      console.log('Submitting request:', requestData);
      const response = await axios.post('http://localhost:8000/exchange_requests', requestData);
      console.log('Request submitted:', response.data);
      setError('');
      setRequest({
        subject_id: '',
        studentgroup_id: '',
        teacher_id: '',
        start_time: '',
        end_time: '',
      });
      alert('Заявку успішно подано!');
    } catch (err) {
      console.error('Request submit error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage =
        err.response?.data?.detail ||
        (typeof err.response?.data === 'object' ? JSON.stringify(err.response?.data) : err.message);
      setError('Помилка подачі заявки: ' + errorMessage);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });
  };

  if (!classroom && !loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {error || 'Дані не знайдено'}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-gray-50 p-6 overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {classroom ? `Аудиторія ${classroom.name}` : 'Завантаження...'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        {classroom && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">Статус</h3>
            <p className={`text-center text-sm font-medium ${classroom.status === 'free' ? 'text-green-600' : 'text-red-600'}`}>
              {classroom.status === 'free' ? 'Вільна' : 'Зайнята'}
            </p>
          </div>
        )}

        {/* Equipment */}
        {classroom && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">Обладнання</h3>
            <table className="w-full text-sm border border-gray-200">
              <tbody>
                <tr>
                  <td className="border-b border-gray-200 p-3 font-medium text-gray-700 text-center">Обладнання</td>
                  <td className="border-b border-gray-200 p-3 text-center">{classroom.equipment || 'Немає'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Schedule */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">Розклад</h3>
          {schedules.length > 0 ? (
            <table className="w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border-b p-2 text-center">Предмет</th>
                  <th className="border-b p-2 text-center">Група</th>
                  <th className="border-b p-2 text-center">Викладач</th>
                  <th className="border-b p-2 text-center">Початок</th>
                  <th className="border-b p-2 text-center">Кінець</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">{schedule.subject.name}</td>
                    <td className="p-2 text-center">{schedule.group.name}</td>
                    <td className="p-2 text-center">{schedule.teacher.name}</td>
                    <td className="p-2 text-center">{formatDateTime(schedule.start_time)}</td>
                    <td className="p-2 text-center">{formatDateTime(schedule.end_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-sm text-gray-600">Розклад не знайдено</p>
          )}
        </div>

        {/* Exchange Request Form */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">Подати заявку на обмін</h3>
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-1">Аудиторія</label>
              <input
                type="text"
                value={classroom ? classroom.name : ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-1">Предмет</label>
              <select
                value={request.subject_id}
                onChange={(e) => setRequest({ ...request, subject_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                disabled={subjects.length === 0}
              >
                <option value="">Виберіть предмет</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-1">Група</label>
              <select
                value={request.studentgroup_id}
                onChange={(e) => setRequest({ ...request, studentgroup_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                disabled={studentgroups.length === 0}
              >
                <option value="">Виберіть групу</option>
                {studentgroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-1">Викладач</label>
              <select
                value={request.teacher_id}
                onChange={(e) => setRequest({ ...request, teacher_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                disabled={teachers.length === 0}
              >
                <option value="">Виберіть викладача</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-1">Початок заняття</label>
              <input
                type="datetime-local"
                value={request.start_time}
                onChange={(e) => setRequest({ ...request, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-1">Кінець заняття</label>
              <input
                type="datetime-local"
                value={request.end_time}
                onChange={(e) => setRequest({ ...request, end_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 font-medium"
              disabled={loading || !classroom}
            >
              Подати заявку
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomDetails;