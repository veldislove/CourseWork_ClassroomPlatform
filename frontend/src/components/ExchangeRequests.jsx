import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ExchangeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActual, setIsActual] = useState(null);

  // Fetch exchange requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        console.log('Fetching exchange requests...');
        const response = await axios.get('http://localhost:8000/exchange_requests');
        console.log('Exchange requests response:', response.data);
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.response?.status, err.response?.data, err.message);
        setError('Помилка завантаження заявок: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Check request actuality
  const checkActuality = async (request) => {
    try {
      const response = await axios.get(`http://localhost:8000/classrooms/${request.classroom_id}/schedule`);
      const isSlotFree = !response.data.some(
        (schedule) =>
          new Date(schedule.start_time) < new Date(request.end_time) &&
          new Date(schedule.end_time) > new Date(request.start_time)
      );
      setIsActual(isSlotFree);
    } catch (err) {
      console.error('Check actuality error:', err.response?.status, err.message);
      setIsActual(false);
    }
  };

  // Open modal and check actuality
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    setIsActual(null); // Reset actuality
    checkActuality(request);
  };

  // Confirm request
  const handleConfirmRequest = async () => {
    if (!selectedRequest || !isActual) return;
    try {
      // Update request status
      await axios.patch(`http://localhost:8000/exchange_requests/${selectedRequest.id}`, {
        status: 'approved',
      });
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: 'approved' } : req
        )
      );
      setIsModalOpen(false);
      alert('Заявку підтверджено та додано до розкладу!');
    } catch (err) {
      console.error('Confirm error:', err.response?.status, err.response?.data, err.message);
      setError('Помилка підтвердження заявки: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Reject request
  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    try {
      await axios.patch(`http://localhost:8000/exchange_requests/${selectedRequest.id}`, {
        status: 'rejected',
      });
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: 'rejected' } : req
        )
      );
      setIsModalOpen(false);
      alert('Заявку відхилено!');
    } catch (err) {
      console.error('Reject error:', err.response?.status, err.response?.data, err.message);
      setError('Помилка відхилення заявки: ' + (err.response?.data?.detail || err.message));
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Завантаження...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-gray-50 p-6 overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Запити на обмін</h2>
        {requests.length === 0 ? (
          <p className="text-center text-gray-600">Запити відсутні</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <table className="w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border-b p-2 text-center">Аудиторія</th>
                  <th className="border-b p-2 text-center">Предмет</th>
                  <th className="border-b p-2 text-center">Група</th>
                  <th className="border-b p-2 text-center">Викладач</th>
                  <th className="border-b p-2 text-center">Час</th>
                  <th className="border-b p-2 text-center">Статус</th>
                  <th className="border-b p-2 text-center">Дії</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">{request.classroom?.name || 'Немає'}</td>
                    <td className="p-2 text-center">{request.subject?.name || 'Немає'}</td>
                    <td className="p-2 text-center">{request.studentgroup?.name || 'Немає'}</td>
                    <td className="p-2 text-center">{request.teacher?.name || 'Немає'}</td>
                    <td className="p-2 text-center">
                      {formatDateTime(request.start_time)} - {formatDateTime(request.end_time)}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status === 'pending'
                          ? 'Очікує'
                          : request.status === 'approved'
                          ? 'Підтверджено'
                          : 'Відхилено'}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Переглянути
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for request details */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Деталі заявки
                  </Dialog.Title>
                  {selectedRequest && (
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <p><strong>Аудиторія:</strong> {selectedRequest.classroom?.name || 'Немає'}</p>
                      <p><strong>Предмет:</strong> {selectedRequest.subject?.name || 'Немає'}</p>
                      <p><strong>Група:</strong> {selectedRequest.studentgroup?.name || 'Немає'}</p>
                      <p><strong>Викладач:</strong> {selectedRequest.teacher?.name || 'Немає'}</p>
                      <p>
                        <strong>Час:</strong> {formatDateTime(selectedRequest.start_time)} -{' '}
                        {formatDateTime(selectedRequest.end_time)}
                      </p>
                      <p>
                        <strong>Статус:</strong>{' '}
                        {selectedRequest.status === 'pending'
                          ? 'Очікує'
                          : selectedRequest.status === 'approved'
                          ? 'Підтверджено'
                          : 'Відхилено'}
                      </p>
                      <p>
                        <strong>Актуальність:</strong>{' '}
                        {isActual === null
                          ? 'Перевіряється...'
                          : isActual
                          ? 'Слот вільний'
                          : 'Слот зайнятий'}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    {selectedRequest?.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                            isActual
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={handleConfirmRequest}
                          disabled={!isActual}
                        >
                          Підтвердити
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                          onClick={handleRejectRequest}
                        >
                          Відхилити
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Закрити
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default ExchangeRequests;