import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';
import { NotFoundException } from '@nestjs/common';

describe('TodosController', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    todosController = module.get<TodosController>(TodosController);
    todosService = module.get<TodosService>(TodosService);
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result: Todo[] = [{ id: 1, title: 'Test Todo', completed: false }];
      jest.spyOn(todosService, 'findAll').mockResolvedValue(result);

      expect(await todosController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result: Todo = { id: 1, title: 'Test Todo', completed: false };
      jest.spyOn(todosService, 'findOne').mockResolvedValue(result);

      expect(await todosController.findOne('1')).toBe(result);
    });

    it('should throw a NotFoundException if todo not found', async () => {
      jest.spyOn(todosService, 'findOne').mockResolvedValue(null);

      await expect(todosController.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new todo', async () => {
      const newTodo: Todo = { id: 1, title: 'New Todo', completed: false };
      jest.spyOn(todosService, 'create').mockResolvedValue(newTodo);

      expect(await todosController.create(newTodo)).toBe(newTodo);
    });
  });

  describe('update', () => {
    it('should update and return the todo', async () => {
      const updatedTodo: Todo = {
        id: 1,
        title: 'Updated Todo',
        completed: true,
      };
      jest.spyOn(todosService, 'update').mockResolvedValue(updatedTodo);

      expect(await todosController.update('1', updatedTodo)).toBe(updatedTodo);
    });

    it('should throw a NotFoundException if todo not found', async () => {
      jest.spyOn(todosService, 'update').mockResolvedValue(null);

      await expect(
        todosController.update('1', {
          id: 1,
          title: 'Updated Todo',
          completed: true,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      const result: Todo = { id: 1, title: 'Test Todo', completed: false };
      jest.spyOn(todosService, 'findOne').mockResolvedValue(result);
      jest.spyOn(todosService, 'delete').mockResolvedValue();

      await todosController.remove('1');
      expect(todosService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if todo not found', async () => {
      jest.spyOn(todosService, 'findOne').mockResolvedValue(null);

      await expect(todosController.remove('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
