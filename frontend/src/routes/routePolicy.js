export function getProtectedRedirect(isAuthenticated, pathname, sessionNotice = '') {
  if (isAuthenticated) return null;
  return {
    to: '/login',
    state: { from: pathname, message: sessionNotice },
  };
}

export function getGuestRedirect(isAuthenticated) {
  return isAuthenticated ? '/dashboard' : null;
}

export function getHomeDestination(isAuthenticated) {
  return isAuthenticated ? '/dashboard' : '/login';
}
