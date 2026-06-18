import { describe, it, expect } from 'vitest';
import {
  CreateRepositorySchema,
  CreateIssueSchema,
  ListRepositoriesSchema,
  CreateCommitSchema,
  ListIssuesSchema,
} from '../src/schemas/index.js';

describe('CreateRepositorySchema', () => {
  it('debe aceptar un input válido', () => {
    const result = CreateRepositorySchema.safeParse({
      name: 'mi-repositorio',
      description: 'Un repo de prueba',
      private: false,
    });
    expect(result.success).toBe(true);
  });

  it('debe rechazar nombre menor a 3 caracteres', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'ab' });
    expect(result.success).toBe(false);
  });

  it('debe rechazar nombre con caracteres inválidos', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'repo con espacios' });
    expect(result.success).toBe(false);
  });

  it('debe rechazar nombre mayor a 100 caracteres', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });
});

describe('CreateIssueSchema', () => {
  it('debe aceptar un input válido', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'usuario',
      repo: 'mi-repo',
      title: 'Bug encontrado',
      body: 'Descripción del bug',
    });
    expect(result.success).toBe(true);
  });

  it('debe rechazar título vacío', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'usuario',
      repo: 'mi-repo',
      title: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('ListRepositoriesSchema', () => {
  it('debe usar valores por defecto', () => {
    const result = ListRepositoriesSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('owner');
      expect(result.data.per_page).toBe(30);
    }
  });
});

describe('CreateCommitSchema', () => {
  it('debe aceptar un input válido', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'usuario',
      repo: 'mi-repo',
      message: 'feat: primer commit',
      filePath: 'src/index.ts',
      content: 'console.log("hola")',
    });
    expect(result.success).toBe(true);
  });

  it('debe rechazar mensaje de commit vacío', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'usuario',
      repo: 'mi-repo',
      message: '',
      filePath: 'src/index.ts',
      content: 'contenido',
    });
    expect(result.success).toBe(false);
  });
});

describe('ListIssuesSchema', () => {
  it('debe aceptar state open', () => {
    const result = ListIssuesSchema.safeParse({
      owner: 'usuario',
      repo: 'mi-repo',
      state: 'open',
    });
    expect(result.success).toBe(true);
  });

  it('debe rechazar state inválido', () => {
    const result = ListIssuesSchema.safeParse({
      owner: 'usuario',
      repo: 'mi-repo',
      state: 'invalido',
    });
    expect(result.success).toBe(false);
  });
});