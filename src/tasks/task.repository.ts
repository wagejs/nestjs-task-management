// import { EntityRepository, Repository } from "typeorm";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import {dataSource} from "../data-source"
// @EntityRepository(Task) // TODO : FIND A UPDATED METHOD
// export class TaskRepository extends Repository<Task>{
//   async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
//     const { title, description } = createTaskDto;
//     const task = this.create({
//       title,
//       description,
//       status: TaskStatus.OPEN,
//     });

//     await this.save(task)
//     return task;
//   }
// }

export const TaskRepository = dataSource.getRepository(Task).extend({
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task)
    return task;
  }
})