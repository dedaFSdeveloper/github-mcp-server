import { getOctokit } from './client.js';
import { handleGitHubError } from '../errors/index.js';
import { withRetry } from '../utils/retry.js';
import { logger } from '../utils/logging.js';
import type {
  CreateRepositoryInput,
  CreateIssueInput,
  ListRepositoriesInput,
  CreateCommitInput,
  ListIssuesInput,
} from '../schemas/index.js';

export async function createRepository(input: CreateRepositoryInput) {
  return withRetry(async () => {
    try {
      logger.info('Creando repositorio', { name: input.name });
      const octokit = getOctokit();
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: input.name,
        description: input.description,
        private: input.private,
        auto_init: true,
      });
      logger.info('Repositorio creado exitosamente', { url: data.html_url });
      return {
        name: data.name,
        url: data.html_url,
        description: data.description,
        private: data.private,
      };
    } catch (error) {
      handleGitHubError(error, input.name);
    }
  });
}

export async function createIssue(input: CreateIssueInput) {
  return withRetry(async () => {
    try {
      logger.info('Creando issue', { repo: input.repo, title: input.title });
      const octokit = getOctokit();
      const { data } = await octokit.issues.create({
        owner: input.owner,
        repo: input.repo,
        title: input.title,
        body: input.body,
      });
      return {
        number: data.number,
        title: data.title,
        url: data.html_url,
        state: data.state,
      };
    } catch (error) {
      handleGitHubError(error, input.repo);
    }
  });
}

export async function listRepositories(input: ListRepositoriesInput) {
  return withRetry(async () => {
    try {
      logger.info('Listando repositorios');
      const octokit = getOctokit();
      const { data } = await octokit.repos.listForAuthenticatedUser({
        type: input.type,
        per_page: input.per_page,
        sort: 'updated',
      });
      return data.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        private: repo.private,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
      }));
    } catch (error) {
      handleGitHubError(error);
    }
  });
}

export async function createCommit(input: CreateCommitInput) {
  return withRetry(async () => {
    try {
      logger.info('Creando commit', { repo: input.repo, file: input.filePath });
      const octokit = getOctokit();

      // Obtener el SHA del branch
      const { data: refData } = await octokit.git.getRef({
        owner: input.owner,
        repo: input.repo,
        ref: `heads/${input.branch}`,
      });
      const latestSha = refData.object.sha;

      // Verificar si el archivo ya existe
      let fileSha: string | undefined;
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner: input.owner,
          repo: input.repo,
          path: input.filePath,
        });
        if ('sha' in fileData) fileSha = fileData.sha;
      } catch {
        // El archivo no existe, se va a crear
      }

      // Crear o actualizar el archivo
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner: input.owner,
        repo: input.repo,
        path: input.filePath,
        message: input.message,
        content: Buffer.from(input.content).toString('base64'),
        sha: fileSha,
        branch: input.branch,
      });

      return {
        commitSha: data.commit.sha,
        commitUrl: data.commit.html_url,
        filePath: input.filePath,
        message: input.message,
      };
    } catch (error) {
      handleGitHubError(error, input.repo);
    }
  });
}

export async function listIssues(input: ListIssuesInput) {
  return withRetry(async () => {
    try {
      logger.info('Listando issues', { repo: input.repo });
      const octokit = getOctokit();
      const { data } = await octokit.issues.listForRepo({
        owner: input.owner,
        repo: input.repo,
        state: input.state,
        per_page: input.per_page,
      });
      return data.map((issue) => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        url: issue.html_url,
        createdAt: issue.created_at,
        body: issue.body,
      }));
    } catch (error) {
      handleGitHubError(error, input.repo);
    }
  });
}