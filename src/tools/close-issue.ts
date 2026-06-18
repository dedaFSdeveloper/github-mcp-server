import { z } from 'zod';
import { successResult, errorResult } from '../types.js';
import { getOctokit } from '../github/client.js';
import { handleGitHubError } from '../errors/index.js';

export const CloseIssueSchema = z.object({
  owner: z.string().min(1, 'El owner es requerido').describe('Usuario dueño del repositorio'),
  repo: z.string().min(3).max(100).describe('Nombre del repositorio'),
  issue_number: z.number().int().positive().describe('Número del issue a cerrar'),
});

export const closeIssueTool = {
  name: 'close_issue',
  description:
    'Cierra un issue existente en un repositorio de GitHub. Usá este tool cuando el usuario quiera cerrar, resolver o marcar como completado un issue.',
  schema: CloseIssueSchema,
  handler: async (input: unknown) => {
    const parsed = CloseIssueSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const octokit = getOctokit();
      const { data } = await octokit.issues.update({
        owner: parsed.data.owner,
        repo: parsed.data.repo,
        issue_number: parsed.data.issue_number,
        state: 'closed',
      });
      return successResult({
        message: `Issue #${data.number} "${data.title}" cerrado exitosamente`,
        url: data.html_url,
        state: data.state,
      });
    } catch (error) {
      handleGitHubError(error, parsed.data.repo);
    }
  },
};