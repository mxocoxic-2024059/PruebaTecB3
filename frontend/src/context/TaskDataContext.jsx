import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getTasks } from '../api/tasksApi';
import { getDashboard } from '../api/productivityApi';
import { ApiError } from '../api/httpClient';
import { refreshTaskResources } from '../utils/taskRefresh';

const TaskDataContext = createContext(null);
const CONNECTION_ERROR = 'No fue posible conectar con el servicio.';

function readableError(error) {
  return error instanceof ApiError ? error.message : CONNECTION_ERROR;
}

export function TaskDataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [tasksError, setTasksError] = useState('');
  const [dashboardError, setDashboardError] = useState('');

  const refreshTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError('');
    try {
      const response = await getTasks();
      if (!Array.isArray(response)) throw new ApiError('El servicio devolvió una respuesta inesperada.');
      setTasks(response);
      return response;
    } catch (error) {
      setTasksError(readableError(error));
      return false;
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError('');
    try {
      const response = await getDashboard();
      if (!response?.data) throw new ApiError('El servicio devolvió una respuesta inesperada.');
      setMetrics(response.data);
      return response.data;
    } catch (error) {
      setDashboardError(readableError(error));
      return false;
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const refreshAll = useCallback(
    () => refreshTaskResources(refreshTasks, refreshDashboard),
    [refreshTasks, refreshDashboard],
  );

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const value = useMemo(() => ({
    tasks,
    metrics,
    tasksLoading,
    dashboardLoading,
    tasksError,
    dashboardError,
    refreshTasks,
    refreshDashboard,
    refreshAll,
  }), [
    tasks,
    metrics,
    tasksLoading,
    dashboardLoading,
    tasksError,
    dashboardError,
    refreshTasks,
    refreshDashboard,
    refreshAll,
  ]);

  return <TaskDataContext.Provider value={value}>{children}</TaskDataContext.Provider>;
}

export function useTaskData() {
  const context = useContext(TaskDataContext);
  if (!context) throw new Error('useTaskData debe utilizarse dentro de TaskDataProvider');
  return context;
}
