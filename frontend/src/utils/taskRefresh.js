export async function refreshTaskResources(refreshTasks, refreshDashboard) {
  const [tasksResult, dashboardResult] = await Promise.allSettled([
    refreshTasks(),
    refreshDashboard(),
  ]);

  return {
    tasksUpdated: tasksResult.status === 'fulfilled' && tasksResult.value !== false,
    dashboardUpdated: dashboardResult.status === 'fulfilled' && dashboardResult.value !== false,
  };
}

export async function runTaskMutation(mutation, refreshResources) {
  const result = await mutation();
  const refreshResult = await refreshResources();
  return { result, refreshResult };
}
