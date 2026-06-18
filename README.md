# GitHub MCP Server 🤖

MCP Server en Node.js + TypeScript que permite a agentes de IA ejecutar operaciones en GitHub usando lenguaje natural a través de Antigravity.

## ¿Qué hace?

Permite que un LLM (Claude, Gemini, u otro) ejecute acciones reales en GitHub como crear repositorios, abrir issues, hacer commits y más, simplemente con comandos en lenguaje natural.

## Arquitectura

```
Usuario
  ↓
Antigravity (Host) — gestiona la sesión y conecta los componentes
  ↓
LLM — Claude/Gemini (Client) — decide qué tool usar y con qué parámetros
  ↓
MCP Server — este código (Server) — valida inputs con Zod y ejecuta operaciones
  ↓
GitHub API (vía Octokit) — recibe las llamadas autenticadas y devuelve resultados
```

## Requisitos

- Node.js 18+
- Cuenta de GitHub
- GitHub Personal Access Token
- Antigravity instalado

## Instalación

1. Cloná el repositorio:
```bash
git clone https://github.com/TU_USUARIO/ProyectoM5-Ezequiel-Molinari.git
cd ProyectoM5-Ezequiel-Molinari
```

2. Instalá las dependencias:
```bash
npm install
```

3. Compilá TypeScript:
```bash
npm run build
```

## Configuración

### 1. Obtener GitHub Personal Access Token

1. Entrá a github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Nombre: `mcp-server-token`
4. Seleccioná los scopes: ✅ `repo` ✅ `user` ✅ `admin:org`
5. Generalo y copialo

### 2. Configurar variables de entorno

Creá un archivo `.env` en la raíz del proyecto:
```
GITHUB_TOKEN=tu_token_aqui
```

### 3. Configurar en Antigravity

Agregá esto en la configuración de MCP servers de Antigravity:
```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["C:/ruta/completa/al/proyecto/dist/server.js"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

## Tools disponibles

### `create_repository`
Crea un nuevo repositorio en GitHub.

**Parámetros:**
- `name` (string, requerido): Nombre del repositorio (3-100 caracteres, alfanumérico)
- `description` (string, opcional): Descripción del repositorio
- `private` (boolean, opcional): Si es privado (default: false)

**Ejemplo de prompt:**
> "Creá un repositorio llamado mi-proyecto con descripción 'Proyecto de prueba'"

---

### `create_issue`
Abre un nuevo issue en un repositorio.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `title` (string, requerido): Título del issue
- `body` (string, opcional): Descripción del issue

**Ejemplo de prompt:**
> "Abrí un issue en mi repositorio mi-proyecto con título 'Bug en login' y descripción 'El login falla con email inválido'"

---

### `list_repositories`
Lista los repositorios del usuario autenticado.

**Parámetros:**
- `type` (string, opcional): Tipo de repos — `all`, `owner`, `public`, `private` (default: `owner`)
- `per_page` (number, opcional): Cantidad por página (default: 30)

**Ejemplo de prompt:**
> "Listá todos mis repositorios de GitHub"

---

### `create_commit`
Crea un commit agregando o modificando un archivo.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `message` (string, requerido): Mensaje del commit
- `filePath` (string, requerido): Ruta del archivo (ej: `src/index.ts`)
- `content` (string, requerido): Contenido del archivo
- `branch` (string, opcional): Branch destino (default: `main`)

**Ejemplo de prompt:**
> "Hacé un commit en mi-proyecto agregando un archivo README.md con el texto 'Hola mundo'"

---

### `list_issues`
Lista los issues de un repositorio.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `state` (string, opcional): `open`, `closed`, `all` (default: `open`)
- `per_page` (number, opcional): Cantidad por página (default: 30)

**Ejemplo de prompt:**
> "Mostrá los issues abiertos del repositorio mi-proyecto"

---

## Ejemplos de uso

```
"Creá un repositorio llamado api-rest-node con descripción 'API REST con Node.js'"

"Abrí un issue en ezequiel/api-rest-node con título 'Agregar autenticación JWT'"

"Listá mis repositorios públicos"

"Hacé un commit en api-rest-node agregando src/index.ts con el contenido 'console.log(hola)'"

"Mostrá todos los issues del repositorio api-rest-node"
```

## Ejecutar tests

```bash
npm run test
```

## Troubleshooting

**El server no arranca:**
- Verificá que `npm run build` haya compilado sin errores
- Verificá que el archivo `.env` exista con el token

**Error de autenticación:**
- Verificá que el token tenga los scopes `repo`, `user`, `admin:org`
- Revocá el token y creá uno nuevo si sigue fallando

**Error 404 en operaciones:**
- Verificá que el nombre del repositorio y el owner sean correctos
- El owner debe ser tu usuario de GitHub exactamente como aparece en tu perfil

**Rate limit:**
- El server implementa retry automático con exponential backoff
- Si persiste, esperá unos minutos e intentá de nuevo

**Antigravity no encuentra el server:**
- Verificá que la ruta en la configuración sea absoluta y correcta
- Asegurate de haber compilado con `npm run build` antes

## Licencia

MIT