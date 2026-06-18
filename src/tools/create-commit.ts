import { CreateCommitSchema } from '../schemas/index.js';
import { createCommit } from '../github/operations.js';
import { successResult, errorResult } from '../types.js';

export const createCommitTool = {
  name: 'create_commit',
  description:
    'Crea un commit en un repositorio de GitHub agregando o modificando un archivo. Usá este tool cuando el usuario quiera guardar cambios, subir un archivo o modificar contenido en un repositorio.',
  schema: CreateCommitSchema,
  handler: async (input: unknown) => {
    const parsed = CreateCommitSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: {message: string}) => e.message).join(', ');
      return errorResult(`Parámetros inválidos: ${messages}`);
    }
    try {
      const result = await createCommit(parsed.data);
      return successResult({
        message: `Commit creado exitosamente en "${parsed.data.filePath}"`,
        commitUrl: result?.commitUrl,
        commitSha: result?.commitSha,
      });
    } catch (error) {
      return errorResult((error as Error).message);
    }
  },
};