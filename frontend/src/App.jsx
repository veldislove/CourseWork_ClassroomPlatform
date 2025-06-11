// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import ClassroomMap from './components/ClassroomMap';
// import ScheduleSearch from './components/ScheduleSearch';
// import ExchangeRequests from './components/ExchangeRequests';

// function App() {
//   return (
//     <Router>
//       <div className="flex">
//         <Sidebar />
//         <div className="ml-20 w-full h-screen">
//           <Routes>
//             <Route path="/map" element={<ClassroomMap />} />
//             <Route path="/schedule" element={<ScheduleSearch />} />
//             <Route path="/requests" element={<ExchangeRequests />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }
//
//export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ClassroomMap from './components/ClassroomMap';
import ScheduleSearch from './components/ScheduleSearch';
import ExchangeRequests from './components/ExchangeRequests';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="ml-20 w-full h-screen bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <ClassroomMap />
                </ErrorBoundary>
              }
            />
            <Route path="/schedule" element={<ScheduleSearch />} />
            <Route path="/requests" element={<ExchangeRequests />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;