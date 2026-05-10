export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    list: (page: number) => ['projects', 'list', page] as const,
    detail: (projectId: string) => ['projects', 'detail', projectId] as const,
  },
  epics: {
    all: ['epics'] as const,
    list: (projectId: string, page: number, search: string) =>
      ['epics', 'list', projectId, page, search] as const,
    allForProject: (projectId: string) => ['epics', 'all', projectId] as const,
    detail: (epicId: string, projectId: string) =>
      ['epics', 'detail', epicId, projectId] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    list: (projectId: string, page: number, search: string) =>
      ['tasks', 'list', projectId, page, search] as const,
    boardColumn: (projectId: string, status: string, search: string) =>
      ['tasks', 'board', projectId, status, search] as const,
    detail: (taskId: string, projectId: string) =>
      ['tasks', 'detail', taskId, projectId] as const,
    epicTasks: (epicId: string) => ['tasks', 'epic', epicId] as const,
  },
  members: {
    byProject: (projectId: string) => ['members', projectId] as const,
  },
  statistics: {
    projects: ['statistics', 'projects'] as const,
    calendar: (
      start: string,
      end: string,
      projectId: string | null,
      status: string | null
    ) => ['statistics', 'calendar', start, end, projectId, status] as const,
    projectCounts: (start: string, end: string) =>
      ['statistics', 'projectCounts', start, end] as const,
  },
} as const
