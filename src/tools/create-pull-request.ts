import { z } from 'zod';
import { successResult, errorResult } from '../types.js';
import { getOctokit } from '../github/client.js';
import { handleGitHubError } from '../errors/index.js';

export const CreatePullRequestSchema = z.object({
  owner: z.string().min(1, 'El owner es requerido').describe('Usuario dueño del repositorio'),
  repo: z.string().min(3).max(100).describe('Nombre del repositorio'),
  title: z.string().min(1, 'El título es requerido').describe('Título del pull request'),
  body: z.string().optional().describe('Descripción del pull request'),
  head: z.string().min(1, 'El branch origen es requerido').describe('Branch con los cambios a mergear'),
  base: z.string().optional().default('main').describe('Branch destino donde se mergeará'),
});

export const createPullRequestTool = {
  name: 'create_pull_request',
  description:
    'Crea un pull request en un repositorio de GitHub. Usá este tool cuando el usuario quiera proponer cambios de un branch a otro para revisión.',
  schema: CreatePullRequestSchema,
  handler: async (input: unknown) => {
    const parsed = CreatePullRequestSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const octokit = getOctokit();
      const { data } = await octokit.pulls.create({
        owner: parsed.data.owner,
        repo: parsed.data.repo,
        title: parsed.data.title,
        body: parsed.data.body,
        head: parsed.data.head,
        base: parsed.data.base,
      });
      return successResult({
        message: `Pull request #${data.number} "${data.title}" creado exitosamente`,
        url: data.html_url,
        state: data.state,
        head: data.head.ref,
        base: data.base.ref,
      });
    } catch (error) {
      handleGitHubError(error, parsed.data.repo);
    }
  },
};