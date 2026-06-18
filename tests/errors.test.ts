import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  GitHubAPIError,
  AuthenticationError,
  NetworkError,
  handleGitHubError,
} from '../src/errors/index.js';

describe('Custom Error Types', () => {
  it('ValidationError debe tener el nombre correcto', () => {
    const error = new ValidationError('input inválido');
    expect(error.name).toBe('ValidationError');
    expect(error.message).toBe('input inválido');
  });

  it('GitHubAPIError debe guardar el statusCode', () => {
    const error = new GitHubAPIError('not found', 404);
    expect(error.name).toBe('GitHubAPIError');
    expect(error.statusCode).toBe(404);
  });

  it('AuthenticationError debe tener el nombre correcto', () => {
    const error = new AuthenticationError('token inválido');
    expect(error.name).toBe('AuthenticationError');
  });

  it('NetworkError debe tener el nombre correcto', () => {
    const error = new NetworkError('sin conexión');
    expect(error.name).toBe('NetworkError');
  });
});

describe('handleGitHubError', () => {
  it('error 401 debe lanzar AuthenticationError', () => {
    expect(() => handleGitHubError({ status: 401 })).toThrow(AuthenticationError);
  });

  it('error 403 debe lanzar AuthenticationError', () => {
    expect(() => handleGitHubError({ status: 403 })).toThrow(AuthenticationError);
  });

  it('error 404 debe lanzar GitHubAPIError con mensaje claro', () => {
    expect(() => handleGitHubError({ status: 404 }, 'mi-repo')).toThrow(
      'El repositorio "mi-repo" no fue encontrado'
    );
  });

  it('error 429 debe lanzar GitHubAPIError de rate limit', () => {
    expect(() => handleGitHubError({ status: 429 })).toThrow(
      'Se superó el límite de requests'
    );
  });
});