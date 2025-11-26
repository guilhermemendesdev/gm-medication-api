// Script para iniciar a aplicação com suporte a tsconfig-paths
const path = require('path');
const fs = require('fs');

// Detectar o projectRoot corretamente
// Se start.js está em /app/apps/auth-service, subir dois níveis para /app
// Se start.js está em /app, usar diretamente
let projectRoot = __dirname;
if (__dirname.includes('/apps/auth-service') || __dirname.includes('\\apps\\auth-service')) {
  // Se estamos em /app/apps/auth-service, subir dois níveis
  projectRoot = path.resolve(__dirname, '../..');
} else if (__dirname.includes('/apps/api-gateway') || __dirname.includes('\\apps\\api-gateway')) {
  // Se estamos em /app/apps/api-gateway, subir dois níveis
  projectRoot = path.resolve(__dirname, '../..');
}
// Se não, assumimos que estamos em /app

console.log(`📁 projectRoot detectado: ${projectRoot}`);
console.log(`📁 __dirname: ${__dirname}`);

// Carregar tsconfig.base.json primeiro
const tsConfigBasePath = path.join(projectRoot, 'tsconfig.base.json');
let tsConfigBase = {};
if (fs.existsSync(tsConfigBasePath)) {
  tsConfigBase = require(tsConfigBasePath);
}

// Calcular caminhos absolutos ANTES de mudar diretório
const serviceDir = path.resolve(projectRoot, 'apps', 'auth-service');
const serviceTsConfigPath = path.resolve(serviceDir, 'tsconfig.json');
const mainTsPath = path.resolve(serviceDir, 'src', 'main.ts');

// Verificar se os arquivos existem
if (!fs.existsSync(serviceTsConfigPath)) {
  console.error(`❌ tsconfig.json não encontrado em: ${serviceTsConfigPath}`);
  console.error(`   Diretório atual: ${process.cwd()}`);
  console.error(`   projectRoot: ${projectRoot}`);
  console.error(`   serviceDir: ${serviceDir}`);
  process.exit(1);
}

if (!fs.existsSync(mainTsPath)) {
  console.error(`❌ main.ts não encontrado em: ${mainTsPath}`);
  console.error(`   Verificando diretório: ${serviceDir}`);
  console.error(`   Conteúdo do diretório:`, fs.readdirSync(serviceDir, { withFileTypes: true }).map(d => d.name));
  process.exit(1);
}

console.log(`✅ Arquivos encontrados:`);
console.log(`   - tsconfig.json: ${serviceTsConfigPath}`);
console.log(`   - main.ts: ${mainTsPath}`);

// Mudar para o diretório do serviço
process.chdir(serviceDir);
console.log(`📂 Diretório atual mudado para: ${process.cwd()}`);

// Configurar ts-node ANTES de tsconfig-paths
// Usar caminho absoluto para o tsconfig.json
require('ts-node').register({
  transpileOnly: true,
  project: serviceTsConfigPath,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    skipLibCheck: true,
    baseUrl: projectRoot,
    paths: tsConfigBase.compilerOptions?.paths || {},
  },
});

// Registrar tsconfig-paths com caminho explícito
const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
  baseUrl: path.resolve(projectRoot, tsConfigBase.compilerOptions?.baseUrl || '.'),
  paths: tsConfigBase.compilerOptions?.paths || {},
});

// Executar diretamente do TypeScript source usando o caminho absoluto já calculado
console.log(`🚀 Carregando aplicação de: ${mainTsPath}`);
require(mainTsPath);

