import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo | null> {
    const todo = await this.todosService.findOne(Number(id));
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  @Post()
  async create(@Body() todo: Todo): Promise<Todo> {
    return this.todosService.create(todo);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() todo: Todo,
  ): Promise<Todo | null> {
    const updatedTodo = await this.todosService.update(Number(id), todo);
    if (!updatedTodo) {
      throw new NotFoundException();
    }
    return updatedTodo;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void | null> {
    const todo = await this.todosService.findOne(Number(id));
    if (!todo) {
      throw new NotFoundException();
    }
    return this.todosService.delete(Number(id));
  }
}
