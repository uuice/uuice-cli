// import { readFile, writeFile } from 'node:fs/promises'
import { join, basename, dirname } from 'node:path'
import * as ts from 'typescript'

/**
 * Compile and load the TypeScript file, returning the name and command methods
 * @param filePath The path to the TypeScript file to load
 */
export async function compileAndLoadCode(
  filePath: string
): Promise<{ name: any; command: any; Command: any }> {
  // const fileContent = await readFile(filePath)
  // const result = ts.transpileModule(fileContent.toString(), {
  //   compilerOptions: {
  //     incremental: true,
  //     target: ts.ScriptTarget.ES2016,
  //     experimentalDecorators: true,
  //     emitDecoratorMetadata: true,
  //     module: ts.ModuleKind.CommonJS,
  //     types: ['node'],
  //     resolveJsonModule: true,
  //     declaration: true,
  //     declarationMap: true,
  //     sourceMap: true,
  //     removeComments: true,
  //     allowJs: true,
  //     allowSyntheticDefaultImports: true,
  //     esModuleInterop: true,
  //     forceConsistentCasingInFileNames: true,
  //     strict: true,
  //     noImplicitAny: false,
  //     strictNullChecks: false,
  //     strictBindCallApply: false,
  //     noImplicitThis: false,
  //     noFallthroughCasesInSwitch: false,
  //     skipLibCheck: true
  //   }
  // })

  // Load the compiled code dynamically
  // console.log(fileContent.toString())
  // console.log(result.outputText)
  const modulePath = join(dirname(filePath), basename(filePath).replace('.ts', '.js'))

  // await writeFile(modulePath, result.outputText)
  // const module = await import(modulePath)

  //! Perform the complete compilation process
  // Create TypeScript programs
  const program = ts.createProgram([filePath], {
    incremental: true,
    target: ts.ScriptTarget.ES2016,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    module: ts.ModuleKind.CommonJS,
    types: ['node', 'uuice-cli'],
    resolveJsonModule: true,
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    removeComments: true,
    allowJs: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    noImplicitAny: false,
    strictNullChecks: false,
    strictBindCallApply: false,
    noImplicitThis: false,
    noFallthroughCasesInSwitch: false,
    skipLibCheck: true,
    outDir: dirname(filePath)
  })

  // Get compilation result
  const emitResult = program.emit()

  // Check for compilation errors
  if (emitResult.emitSkipped) {
    const errors = ts
      .getPreEmitDiagnostics(program)
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    throw new Error(errors.join('\n'))
  }

  // Dynamically import compiled JavaScript files
  const module = await import(modulePath)

  // Return the name and command methods
  return {
    name: module.name,
    command: module.command,
    Command: module.command
  }
}
