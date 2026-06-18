import { z } from 'zod';
import { successResult, errorResult } from '../types.js';
 import { getOctokit } from '../github/client.js';
import { handleGitHubError } from '../errors/index.js';

export const CreateBranchSchema = z.object({
  owner: z.string().min(1, 'El owner es requerido').describe('Usuario dueño del repositorio'),
  repo: z.string().min(3).max(100).describe('Nombre del repositorio'),
  branch: z.string().min(1, 'El nombre del branch es requerido').describe('Nombre del nuevo branch'),
  from_branch: z.string().optional().default('main').describe('Branch base desde donde crear el nuevo branch'),
});

export const createBranchTool = {
  name: 'create_branch',
  description:
    'Crea un nuevo branch en un repositorio de GitHub. Usá este tool cuando el usuario quiera crear una nueva rama para trabajar en una feature o fix.',
  schema: CreateBranchSchema,
  handler: async (input: unknown) => {
    const parsed = CreateBranchSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const octokit = getOctokit();

      const { data: refData } = await octokit.git.getRef({
        owner: parsed.data.owner,
        repo: parsed.data.repo,
        ref: `heads/${parsed.data.from_branch}`,
      });

      const { data } = await octokit.git.createRef({
        owner: parsed.data.owner,
        repo: parsed.data.repo,
        ref: `refs/heads/${parsed.data.branch}`,
        sha: refData.object.sha,
      });

      return successResult({
        message: `Branch "${parsed.data.branch}" creado exitosamente desde "${parsed.data.from_branch}"`,
        ref: data.ref,
        sha: data.object.sha,
      });
    } catch (error) {
      handleGitHubError(error, parsed.data.repo);
    }
  },
};