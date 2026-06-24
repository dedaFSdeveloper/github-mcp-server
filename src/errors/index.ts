export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class GitHubAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export function handleGitHubError(error: unknown, repoName?: string): never {
  if (error instanceof ValidationError || 
      error instanceof GitHubAPIError || 
      error instanceof AuthenticationError || 
      error instanceof NetworkError) {
    throw error;
  }

  const err = error as { status?: number; message?: string };

  if (err.status === 401) {
    throw new AuthenticationError(
      'Token de GitHub inválido o sin permisos. Verificá tu GITHUB_TOKEN.'
    );
  }
  if (err.status === 403) {
    throw new AuthenticationError(
      'No tenés permisos para realizar esta acción. Verificá los scopes del token.'
    );
  }
  if (err.status === 404) {
    throw new GitHubAPIError(
      `El repositorio ${repoName ? `"${repoName}"` : 'solicitado'} no fue encontrado. Verificá el nombre e intentá de nuevo.`,
      404
    );
  }
  if (err.status === 422) {
    throw new GitHubAPIError(
      'El recurso ya existe o los datos son inválidos. Verificá que no exista previamente.',
      422
    );
  }
  if (err.status === 429) {
    throw new GitHubAPIError(
      'Se superó el límite de requests a GitHub. Esperá unos minutos e intentá de nuevo.',
      429
    );
  }

  throw new NetworkError(
    `Error de conexión con GitHub: ${err.message || 'Error desconocido'}`
  );
} 