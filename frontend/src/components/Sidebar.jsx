import { NavLink } from "react-router-dom";
import { MapPin, Calendar, Mail } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-gray-800 text-white shadow-lg flex flex-col items-center justify-center space-y-16">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 ${
            isActive ? "text-blue-400" : "text-gray-300"
          } hover:text-blue-400 transition`
        }
        title="Карта аудиторій"
      >
        <MapPin size={24} />
        <span className="text-xs">Карта</span>
      </NavLink>

      <NavLink
        to="/schedule"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 ${
            isActive ? "text-blue-400" : "text-gray-300"
          } hover:text-blue-400 transition`
        }
        title="Пошук розкладу"
      >
        <Calendar size={24} />
        <span className="text-xs">Розклад</span>
      </NavLink>

      <NavLink
        to="/requests"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 ${
            isActive ? "text-blue-400" : "text-gray-300"
          } hover:text-blue-400 transition`
        }
        title="Перегляд запитів"
      >
        <Mail size={24} />
        <span className="text-xs">Запити</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
