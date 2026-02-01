export const userRolesEnum = {
    ADMIN : 'admin',
    PROJECT_ADMIN : 'project_admin',
    MEMBER : 'member',
}

export const availableUserRoles = Object.values(userRolesEnum);

export const taskStatusEnum = {
    TODO : 'todo',
    IN_PROGRESS : 'in_progress',
    DONE : 'done',
}

export const availableTaskStatus = Object.values(taskStatusEnum);