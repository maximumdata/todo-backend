import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find();
  }

  async findOne(id: number): Promise<Todo | null> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newtodo = this.todosRepository.create(todo);
    return this.todosRepository.save(newtodo);
  }

  async update(id: number, todo: Partial<Todo>): Promise<Todo | null> {
    await this.todosRepository.update({ id }, todo);
    const updatedTodo = await this.todosRepository.findOne({ where: { id } });
    if (!updatedTodo) {
      throw new Error('Todo not found');
    }
    return updatedTodo;
  }

  async delete(id: number): Promise<void | null> {
    await this.todosRepository.delete({ id });
  }
}
