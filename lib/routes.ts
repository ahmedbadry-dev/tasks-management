const encodeSegment = (segment: string) => encodeURIComponent(segment)

export const routes = {
  home: '/',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    forgetPassword: '/forget-password',
  },
  project: {
    list: '/project',
    add: '/project/add',
    details: (projectId: string) => `/project/${encodeSegment(projectId)}`,
    edit: (projectId: string) => `/project/${encodeSegment(projectId)}/edit`,
    epics: (projectId: string) => `/project/${encodeSegment(projectId)}/epics`,
    newEpic: (projectId: string) =>
      `/project/${encodeSegment(projectId)}/epics/new`,
    tasks: (projectId: string) => `/project/${encodeSegment(projectId)}/tasks`,
    newTask: (projectId: string, epicId?: string) =>
      `/project/${encodeSegment(projectId)}/tasks/new${epicId ? `?epicId=${encodeSegment(epicId)}` : ''}`,
    members: (projectId: string) =>
      `/project/${encodeSegment(projectId)}/members`,
  },
} as const
