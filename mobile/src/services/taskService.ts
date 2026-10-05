import api from './api';

export type Task = {
  _id: string;
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (
  task: CreateTaskData,
): Promise<Task> => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (
  id: string,
  updates: Partial<Task>,
): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};