import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import 'dotenv/config';
import { createRepositoryTool } from './tools/create-repository.js';
import { createIssueTool } from './tools/create-issue.js';
import { listRepositoriesTool } from './tools/list-repositories.js';
import { createCommitTool } from './tools/create-commit.js';
import { listIssuesTool } from './tools/list-issues.js';
import { closeIssueTool } from './tools/close-issue.js';
import { createBranchTool } from './tools/create-branch.js';
import { createPullRequestTool } from './tools/create-pull-request.js';
import { logger } from './utils/logging.js';

const server = new McpServer({
  name: 'github-mcp-server',
  version: '1.0.0',
});

server.tool(
  createRepositoryTool.name,
  createRepositoryTool.description,
  createRepositoryTool.schema.shape,
  async (args) => createRepositoryTool.handler(args)
);

server.tool(
  createIssueTool.name,
  createIssueTool.description,
  createIssueTool.schema.shape,
  async (args) => createIssueTool.handler(args)
);

server.tool(
  listRepositoriesTool.name,
  listRepositoriesTool.description,
  listRepositoriesTool.schema.shape,
  async (args) => listRepositoriesTool.handler(args)
);

server.tool(
  createCommitTool.name,
  createCommitTool.description,
  createCommitTool.schema.shape,
  async (args) => createCommitTool.handler(args)
);

server.tool(
  listIssuesTool.name,
  listIssuesTool.description,
  listIssuesTool.schema.shape,
  async (args) => listIssuesTool.handler(args)
);

server.tool(
  closeIssueTool.name,
  closeIssueTool.description,
  closeIssueTool.schema.shape,
  async (args) => closeIssueTool.handler(args)
);

server.tool(
  createBranchTool.name,
  createBranchTool.description,
  createBranchTool.schema.shape,
  async (args) => createBranchTool.handler(args)
);

server.tool(
  createPullRequestTool.name,
  createPullRequestTool.description,
  createPullRequestTool.schema.shape,
  async (args) => createPullRequestTool.handler(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('GitHub MCP Server iniciado correctamente');
}

main().catch((error) => {
  logger.error('Error al iniciar el servidor', { error: (error as Error).message });
  process.exit(1);
});