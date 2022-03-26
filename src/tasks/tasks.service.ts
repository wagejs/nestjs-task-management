import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilteredTaskDto } from './dto/filter-task-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: FilteredTaskDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        const isIncludeTitle = task.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const isIncludeDescription = task.description
          .toLowerCase()
          .includes(search.toLowerCase());
        return isIncludeDescription || isIncludeTitle ? true : false;
      });
    }

    return tasks;
  }
  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException('Task with ID: ' + id + ' not found');
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): string { 
    const newListTask = this.tasks.filter((task) => task.id !== id);
    if (newListTask) {
      this.tasks = newListTask;
      return 'Task Deleted';
    } else {
      return 'Task not delete, please report an error';
    }
  }

  updateTaskById(id: string, UpdateTaskDto: UpdateTaskDto): Task {
    const selectedTask = this.tasks.find((task) => task.id === id);
    const updatedTask: Task = {
      ...selectedTask,
      ...UpdateTaskDto,
    };

    const taskIndex = this.tasks
      .map((task) => {
        return task.id;
      })
      .indexOf(id);
    this.tasks[taskIndex] = updatedTask;

    return updatedTask;
  }
}
