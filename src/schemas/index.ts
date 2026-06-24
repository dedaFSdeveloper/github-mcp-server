import { z } from 'zod';

const repoNameSchema = z
  .string()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(100, 'El nombre no puede superar los 100 caracteres')
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    'El nombre solo puede contener letras, números, guiones, puntos y guiones bajos'
  );

export const CreateRepositorySchema = z.object({
  name: repoNameSchema.describe('Nombre del repositorio a crear'),
  description: z
    .string()
    .max(350, 'La descripción no puede superar los 350 caracteres')
    .optional()
    .describe('Descripción opcional del repositorio'),
  private: z
    .boolean()
    .optional()
    .default(false)
    .describe('Si el repositorio debe ser privado'),
});

export const CreateIssueSchema = z.object({
  owner: z.string().min(1, 'El owner es requerido').describe('Usuario o organización dueña del repositorio'),
  repo: repoNameSchema.describe('Nombre del repositorio'),
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(256, 'El título no puede superar los 256 caracteres')
    .describe('Título del issue'),
  body: z.string().optional().describe('Descripción detallada del issue'),
});

export const ListRepositoriesSchema = z.object({
  type: z
    .enum(['all', 'owner', 'public', 'private', 'member'])
    .optional()
    .default('owner')
    .describe('Tipo de repositorios a listar'),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(30)
    .describe('Cantidad de repositorios por página'),
});

export const CreateCommitSchema = z.object({
  owner: z.string().min(1, 'El owner es requerido').describe('Usuario u organización dueña del repositorio'),
  repo: repoNameSchema.describe('Nombre del repositorio'),
  message: z
    .string()
    .min(1, 'El mensaje de commit es requerido')
    .describe('Mensaje del commit'),
  filePath: z
    .string()
    .min(1, 'La ruta del archivo es requerida')
    .describe('Ruta del archivo a crear o modificar (ej: src/index.ts)'),
  content: z
    .string()
    .min(1, 'El contenido del archivo es requerido')
    .describe('Contenido del archivo'),
  branch: z
    .string()
    .optional()
    .default('main')
    .describe('Branch donde hacer el commit'),
});

export const ListIssuesSchema = z.object({
  owner: z.string().min(1, 'El owner es requerido').describe('Usuario u organización dueña del repositorio'),
  repo: repoNameSchema.describe('Nombre del repositorio'),
  state: z
    .enum(['open', 'closed', 'all'])
    .optional()
    .default('open')
    .describe('Estado de los issues a listar'),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(30)
    .describe('Cantidad de issues por página'),
});

export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type ListRepositoriesInput = z.infer<typeof ListRepositoriesSchema>;
export type CreateCommitInput = z.infer<typeof CreateCommitSchema>;
export type ListIssuesInput = z.infer<typeof ListIssuesSchema>;