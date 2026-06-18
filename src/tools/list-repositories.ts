import { ListRepositoriesSchema } from '../schemas/index.js';
import { listRepositories } from '../github/operations.js';
import { successResult, errorResult } from '../types.js';

export const listRepositoriesTool = {
  name: 'list_repositories',
  description:
    'Lista los repositorios del usuario autenticado en GitHub. Usá este tool cuando el usuario quiera ver sus repositorios, proyectos o repos disponibles.',
  schema: ListRepositoriesSchema,
  handler: async (input: unknown) => {
    const parsed = ListRepositoriesSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const result = await listRepositories(parsed.data);
      return successResult({
        message: `Se encontraron ${result?.length} repositorios`,
        repositories: result,
      });
    } catch (error) {
      return errorResult((error as Error).message);
    }
  },
};