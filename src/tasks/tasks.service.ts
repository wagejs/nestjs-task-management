import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilteredTaskDto } from './dto/filter-task-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.query('SELECT * FROM task');
  }

  async getTaskWithFilters(filterDto: FilteredTaskDto): Promise<Task[]> {
    const { status, search } = filterDto;
    if (status) {
      return await this.taskRepository.findBy({
        status,
      });
    }

    if (search) {
      return await this.taskRepository.query(
        `SELECT * FROM task WHERE title LIKE '%` +
          search.toLowerCase() +
          `%' OR description LIKE '%` +
          search.toLowerCase() +
          `%'`,
      );
    }
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException('Task with ID: ' + id + ' not found');
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string): Promise<string> {
    const found = await this.getTaskById(id);

    if (found) {
      await this.taskRepository.delete(found);
      return 'Task : ' + found.title + ' deleted';
    }
    return null;
  }

  async updateTaskById(
    id: string,
    UpdateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = UpdateTaskDto.status;
    await this.taskRepository.save(task);

    return task;
  }
}
