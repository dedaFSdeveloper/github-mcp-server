import { ListIssuesSchema } from '../schemas/index.js';
import { listIssues } from '../github/operations.js';
import { successResult, errorResult } from '../types.js';

export const listIssuesTool = {
  name: 'list_issues',
  description:
    'Lista los issues de un repositorio de GitHub. Usá este tool cuando el usuario quiera ver los issues, bugs, tareas o solicitudes de un repositorio específico.',
  schema: ListIssuesSchema,
  handler: async (input: unknown) => {
    const parsed = ListIssuesSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const result = await listIssues(parsed.data);
      return successResult({
        message: `Se encontraron ${result?.length} issues`,
        issues: result,
      });
    } catch (error) {
      return errorResult((error as Error).message);
    }
  },
};