import { Octokit } from '@octokit/rest';
import { AuthenticationError } from '../errors/index.js';

let octokitInstance: Octokit | null = null;

export function getOctokit(): Octokit {
  if (octokitInstance) return octokitInstance;

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new AuthenticationError(
      'GITHUB_TOKEN no está configurado. Agregalo al archivo .env'
    );
  }

  octokitInstance = new Octokit({ auth: token });
  return octokitInstance;
}

export function resetOctokit(): void {
  octokitInstance = null;
}