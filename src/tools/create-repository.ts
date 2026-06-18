import { CreateRepositorySchema } from '../schemas/index.js';
import { createRepository } from '../github/operations.js';
import { successResult, errorResult } from '../types.js';

export const createRepositoryTool = {
  name: 'create_repository',
  description:
    'Crea un nuevo repositorio en GitHub para el usuario autenticado. Usá este tool cuando el usuario quiera crear un nuevo repo, proyecto o repositorio en GitHub.',
  schema: CreateRepositorySchema,
  handler: async (input: unknown) => {
    const parsed = CreateRepositorySchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const result = await createRepository(parsed.data);
      return successResult({
        message: `Repositorio "${result?.name}" creado exitosamente`,
        url: result?.url,
        private: result?.private,
      });
    } catch (error) {
      return errorResult((error as Error).message);
    }
  },
};