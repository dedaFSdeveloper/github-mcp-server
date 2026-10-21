# GitHub MCP Server 🤖

[![CI](https://github.com/dedaFSdeveloper/github-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/dedaFSdeveloper/github-mcp-server/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tests](https://img.shields.io/badge/tests-26%20passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green)

MCP Server en Node.js + TypeScript que permite a agentes de IA ejecutar operaciones en GitHub usando lenguaje natural a través de Antigravity.

## ¿Por qué es útil?

Los equipos de desarrollo pierden tiempo ejecutando tareas repetitivas en GitHub: crear repositorios, abrir issues, hacer commits. Este proyecto permite automatizar todas esas tareas usando lenguaje natural, sin necesidad de abrir GitHub manualmente.

**Casos de uso:**
- Crear un repositorio nuevo sin salir del chat
- Abrir issues para reportar bugs directamente desde el agente
- Hacer commits de archivos sin usar Git manualmente
- Listar repositorios e issues para tener contexto rápido
- Crear branches y pull requests en segundos

## Arquitectura

```
Usuario
  ↓
Antigravity (Host) — gestiona la sesión y conecta los componentes
  ↓
LLM — Gemini/Claude (Client) — decide qué tool usar y con qué parámetros
  ↓
MCP Server — este código (Server) — valida inputs con Zod y ejecuta operaciones
  ↓
GitHub API (vía Octokit) — recibe las llamadas autenticadas y devuelve resultados
```

## Requisitos del sistema

- Node.js 18+
- npm 8+
- Cuenta de GitHub
- GitHub Personal Access Token
- Antigravity instalado

## Instalación

1. Cloná el repositorio:
```bash
git clone https://github.com/dedaFSdeveloper/ProyectoM5-Ezequiel-Molinari.git
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
4. Expiration: 90 days
5. Seleccioná los scopes:
   - ✅ `repo` — acceso completo a repositorios
   - ✅ `user` — acceso a información del usuario
   - ✅ `admin:org` — acceso a organizaciones
6. Click en "Generate token" y copialo inmediatamente

### 2. Configurar variables de entorno

Creá un archivo `.env` en la raíz del proyecto:
```
GITHUB_TOKEN=tu_token_aqui
```

### 3. Configurar en Antigravity

1. Abrí Antigravity
2. Click en los tres puntos `...` arriba a la derecha del panel del agente
3. Click en "MCP Servers" → "Manage MCP Servers" → "View raw config"
4. Pegá esta configuración en el archivo que se abre:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["C:\\ruta\\completa\\al\\proyecto\\dist\\server.js"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

5. Reemplazá la ruta con la ruta absoluta a tu proyecto
6. Guardá y reiniciá Antigravity

## Tools disponibles

### `create_repository`
Crea un nuevo repositorio en GitHub para el usuario autenticado.

**Parámetros:**
- `name` (string, requerido): Nombre del repositorio. 3-100 caracteres, solo letras, números, guiones y puntos.
- `description` (string, opcional): Descripción del repositorio
- `private` (boolean, opcional): Si el repositorio es privado. Default: false

**Ejemplo de prompt:**
> "Creá un repositorio llamado mi-proyecto con descripción 'API REST con Node.js'"

---

### `create_issue`
Abre un nuevo issue en un repositorio de GitHub.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `title` (string, requerido): Título del issue
- `body` (string, opcional): Descripción detallada del issue

**Ejemplo de prompt:**
> "Abrí un issue en mi repositorio mi-proyecto con título 'Bug en login' y descripción 'El login falla con email inválido'"

---

### `list_repositories`
Lista los repositorios del usuario autenticado en GitHub.

**Parámetros:**
- `type` (string, opcional): Tipo de repositorios. Opciones: `all`, `owner`, `public`, `private`. Default: `owner`
- `per_page` (number, opcional): Cantidad por página. Default: 30

**Ejemplo de prompt:**
> "Listá todos mis repositorios públicos de GitHub"

---

### `create_commit`
Crea un commit agregando o modificando un archivo en un repositorio.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `message` (string, requerido): Mensaje del commit
- `filePath` (string, requerido): Ruta del archivo. Ejemplo: `src/index.ts`
- `content` (string, requerido): Contenido del archivo
- `branch` (string, opcional): Branch destino. Default: `main`

**Ejemplo de prompt:**
> "Hacé un commit en mi-proyecto agregando un archivo README.md con el texto 'Hola mundo'"

---

### `list_issues`
Lista los issues de un repositorio de GitHub.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `state` (string, opcional): Estado de los issues. Opciones: `open`, `closed`, `all`. Default: `open`
- `per_page` (number, opcional): Cantidad por página. Default: 30

**Ejemplo de prompt:**
> "Mostrá los issues abiertos del repositorio mi-proyecto"

---

### `create_branch` ⭐
Crea un nuevo branch en un repositorio de GitHub.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `branch` (string, requerido): Nombre del nuevo branch
- `from_branch` (string, opcional): Branch base. Default: `main`

**Ejemplo de prompt:**
> "Creá un branch llamado feature/login en mi repositorio mi-proyecto"

---

### `close_issue` ⭐
Cierra un issue existente en un repositorio de GitHub.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `issue_number` (number, requerido): Número del issue a cerrar

**Ejemplo de prompt:**
> "Cerrá el issue número 3 del repositorio mi-proyecto"

---

### `create_pull_request` ⭐
Crea un pull request entre dos branches en un repositorio de GitHub.

**Parámetros:**
- `owner` (string, requerido): Usuario dueño del repositorio
- `repo` (string, requerido): Nombre del repositorio
- `title` (string, requerido): Título del pull request
- `body` (string, opcional): Descripción del pull request
- `head` (string, requerido): Branch con los cambios
- `base` (string, opcional): Branch destino. Default: `main`

**Ejemplo de prompt:**
> "Creá un pull request en mi-proyecto desde el branch feature/login hacia main con título 'Agregar autenticación'"

---

## Ejemplos de uso

```
"Creá un repositorio llamado api-rest-node con descripción 'API REST con Node.js'"

"Abrí un issue en dedaFSdeveloper/api-rest-node con título 'Agregar autenticación JWT'"

"Listá mis repositorios públicos"

"Hacé un commit en api-rest-node agregando src/index.ts con el contenido 'console.log(hola)'"

"Mostrá todos los issues abiertos del repositorio api-rest-node"

"Creá un branch llamado feature/auth en api-rest-node"

"Cerrá el issue número 1 del repositorio api-rest-node"

"Creá un pull request en api-rest-node desde feature/auth hacia main con título 'Agregar autenticación'"
```

## Ejecutar tests

```bash
npm run test
```

Resultado esperado: 26 tests pasando en 3 archivos.

## Troubleshooting

**El server no arranca:**
- Verificá que `npm run build` haya compilado sin errores
- Verificá que el archivo `.env` exista con el token

**Error de autenticación (401/403):**
- Verificá que el token tenga los scopes `repo`, `user`, `admin:org`
- Revocá el token y creá uno nuevo si sigue fallando

**Error 404 en operaciones:**
- Verificá que el nombre del repositorio y el owner sean correctos
- El owner debe ser tu usuario de GitHub exactamente como aparece en tu perfil

**Rate limit (429):**
- El server implementa retry automático con exponential backoff
- Si persiste, esperá unos minutos e intentá de nuevo

**Antigravity no encuentra el server:**
- Verificá que la ruta en el config sea absoluta y correcta
- Asegurate de haber compilado con `npm run build` antes
- El archivo de configuración correcto es: `C:\Users\TU_USUARIO\.gemini\config\mcp_config.json`

**Los tools no aparecen en Antigravity:**
- Cerrá y volvé a abrir Antigravity
- Verificá que el JSON de configuración sea válido

## Licencia

MIT

---

## 👤 Autor / Author

**Ezequiel Molinari** — Full Stack Developer · AI & Automation  
📫 [molinariezequiel2@gmail.com](mailto:molinariezequiel2@gmail.com) · [LinkedIn](https://www.linkedin.com/in/ezmolinari12/) · [GitHub](https://github.com/dedaFSdeveloper) · [libreriacrayon.com.ar](https://libreriacrayon.com.ar)
