import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRepository, createIssue, listRepositories, listIssues } from '../src/github/operations.js';
import { AuthenticationError, GitHubAPIError } from '../src/errors/index.js';

vi.mock('../src/github/client.js', () => ({
  getOctokit: vi.fn(),
}));

import { getOctokit } from '../src/github/client.js';

const mockOctokit = {
  repos: {
    createForAuthenticatedUser: vi.fn(),
    listForAuthenticatedUser: vi.fn(),
    getContent: vi.fn(),
    createOrUpdateFileContents: vi.fn(),
  },
  issues: {
    create: vi.fn(),
    listForRepo: vi.fn(),
  },
  git: {
    getRef: vi.fn(),
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue(mockOctokit);
});

describe('createRepository', () => {
  it('debe crear un repositorio exitosamente', async () => {
    mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        name: 'mi-repo',
        html_url: 'https://github.com/usuario/mi-repo',
        description: 'Un repo de prueba',
        private: false,
      },
    });

    const result = await createRepository({
      name: 'mi-repo',
      description: 'Un repo de prueba',
      private: false,
    });

    expect(result?.name).toBe('mi-repo');
    expect(result?.url).toBe('https://github.com/usuario/mi-repo');
  });

  it('debe lanzar AuthenticationError con token inválido', async () => {
    mockOctokit.repos.createForAuthenticatedUser.mockRejectedValue({ status: 401 });

    await expect(
      createRepository({ name: 'mi-repo', private: false })
    ).rejects.toThrow(AuthenticationError);
  });

  it('debe lanzar GitHubAPIError cuando el repo ya existe', async () => {
    mockOctokit.repos.createForAuthenticatedUser.mockRejectedValue({ status: 422 });

    await expect(
      createRepository({ name: 'mi-repo', private: false })
    ).rejects.toThrow(GitHubAPIError);
  });
});

describe('createIssue', () => {
  it('debe crear un issue exitosamente', async () => {
    mockOctokit.issues.create.mockResolvedValue({
      data: {
        number: 1,
        title: 'Bug encontrado',
        html_url: 'https://github.com/usuario/mi-repo/issues/1',
        state: 'open',
      },
    });

    const result = await createIssue({
      owner: 'usuario',
      repo: 'mi-repo',
      title: 'Bug encontrado',
      body: 'Descripción del bug',
    });

    expect(result?.number).toBe(1);
    expect(result?.title).toBe('Bug encontrado');
  });

  it('debe lanzar GitHubAPIError cuando el repo no existe', async () => {
    mockOctokit.issues.create.mockRejectedValue({ status: 404 });

    await expect(
      createIssue({ owner: 'usuario', repo: 'repo-inexistente', title: 'Bug' })
    ).rejects.toThrow(GitHubAPIError);
  });
});

describe('listRepositories', () => {
  it('debe listar repositorios exitosamente', async () => {
    mockOctokit.repos.listForAuthenticatedUser.mockResolvedValue({
      data: [
        {
          name: 'repo-1',
          html_url: 'https://github.com/usuario/repo-1',
          description: 'Repo 1',
          private: false,
          stargazers_count: 5,
          updated_at: '2024-01-01',
        },
      ],
    });

    const result = await listRepositories({ type: 'owner', per_page: 30 });

    expect(result).toHaveLength(1);
    expect(result?.[0].name).toBe('repo-1');
  });
});

describe('listIssues', () => {
  it('debe listar issues exitosamente', async () => {
    mockOctokit.issues.listForRepo.mockResolvedValue({
      data: [
        {
          number: 1,
          title: 'Bug',
          state: 'open',
          html_url: 'https://github.com/usuario/mi-repo/issues/1',
          created_at: '2024-01-01',
          body: 'Descripción',
        },
      ],
    });

    const result = await listIssues({
      owner: 'usuario',
      repo: 'mi-repo',
      state: 'open',
      per_page: 30,
    });

    expect(result).toHaveLength(1);
    expect(result?.[0].title).toBe('Bug');
  });
});