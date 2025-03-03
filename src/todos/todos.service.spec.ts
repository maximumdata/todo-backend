import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';

const mockTodo = { id: 1, title: 'Test Todo', completed: false };

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn().mockResolvedValue([mockTodo]),
            findOne: jest.fn().mockResolvedValue(mockTodo),
            create: jest.fn().mockReturnValue(mockTodo),
            save: jest.fn().mockResolvedValue(mockTodo),
            update: jest.fn().mockResolvedValue(mockTodo),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all todos', async () => {
    const todos = await service.findAll();
    expect(todos).toEqual([mockTodo]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one todo by id', async () => {
    const todo = await service.findOne(1);
    expect(todo).toEqual(mockTodo);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error if todo not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(1)).rejects.toThrow('Todo not found');
  });

  it('should create a new todo', async () => {
    const todo = await service.create(mockTodo);
    expect(todo).toEqual(mockTodo);
    expect(repository.create).toHaveBeenCalledWith(mockTodo);
    expect(repository.save).toHaveBeenCalledWith(mockTodo);
  });

  it('should update a todo', async () => {
    const updatedTodo = await service.update(1, mockTodo);
    expect(updatedTodo).toEqual(mockTodo);
    expect(repository.update).toHaveBeenCalledWith({ id: 1 }, mockTodo);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error if updated todo not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    await expect(service.update(1, mockTodo)).rejects.toThrow('Todo not found');
  });

  it('should delete a todo', async () => {
    await service.delete(1);
    expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
  });
});
