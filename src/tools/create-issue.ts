import { CreateIssueSchema } from '../schemas/index.js';
import { createIssue } from '../github/operations.js';
import { successResult, errorResult } from '../types.js';

export const createIssueTool = {
  name: 'create_issue',
  description:
    'Abre un nuevo issue en un repositorio de GitHub. Usá este tool cuando el usuario quiera reportar un bug, solicitar una feature, o crear una tarea en un repositorio.',
  schema: CreateIssueSchema,
  handler: async (input: unknown) => {
    const parsed = CreateIssueSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const result = await createIssue(parsed.data);
      return successResult({
        message: `Issue #${result?.number} "${result?.title}" creado exitosamente`,
        url: result?.url,
        state: result?.state,
      });
    } catch (error) {
      return errorResult((error as Error).message);
    }
  },
};