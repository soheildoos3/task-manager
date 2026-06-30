import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  Task,
  TaskCreate,
  TaskUpdate,
  PaginatedTasksResponse,
} from "@/types/task";

export const tasksService = {
  async getTasks(params?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedTasksResponse> {
    const response = await apiClient.get<PaginatedTasksResponse>(
      ENDPOINTS.tasks.list,
      { params },
    );
    return response.data;
  },

  async getAllTasks(params?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<Task[]> {
    const firstPage = await this.getTasks({
      ...params,
      page: 1,
      limit: 1,
    });

    if (firstPage.total === 0) {
      return [];
    }

    const limit = 100;
    if (firstPage.total <= limit) {
      const response = await this.getTasks({
        ...params,
        page: 1,
        limit: firstPage.total,
      });
      return response.data;
    }

    const totalPages = Math.ceil(firstPage.total / limit);
    const promises = [];

    for (let page = 1; page <= totalPages; page++) {
      promises.push(
        this.getTasks({
          ...params,
          page,
          limit,
        }),
      );
    }

    const responses = await Promise.all(promises);
    return responses.flatMap((response) => response.data);
  },

  async createTask(data: TaskCreate): Promise<Task> {
    const response = await apiClient.post<Task>(ENDPOINTS.tasks.create, data);
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await apiClient.get<Task>(ENDPOINTS.tasks.detail(id));
    return response.data;
  },

  async updateTask(id: number, data: TaskUpdate): Promise<Task> {
    const response = await apiClient.patch<Task>(
      ENDPOINTS.tasks.update(id),
      data,
    );
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.tasks.delete(id));
  },
};
