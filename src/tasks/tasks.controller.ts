import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilteredTaskDto } from './dto/filter-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() taskFilterDto: FilteredTaskDto): Promise<Task[]> {
    if(Object.keys(taskFilterDto).length){
      return this.tasksService.getTaskWithFilters(taskFilterDto)
    }else{
      return this.tasksService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): Promise<string> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body() UpdateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, UpdateTaskDto);
  }
}
