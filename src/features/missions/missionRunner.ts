import type { Mission, MissionRun, TestResult } from '@/types';

function parseJsonValue(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function sameValue(actual: unknown, expected: unknown): boolean {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function runMission(mission: Mission, code: string): MissionRun {
  const source = code.trim();
  if (!source) {
    return {
      results: [],
      output: 'Escribe un poco de código antes de ejecutar las pruebas.',
      success: false,
    };
  }

  let results: TestResult[];
  if (mission.validationMode === 'runtime') {
    results = mission.tests.map((test, index) => {
      try {
        const input = parseJsonValue(test.input);
        const entryPoint = mission.entryPoint;
        if (!entryPoint || !/^[A-Za-z_$][\w$]*$/.test(entryPoint)) {
          throw new Error('Esta misión no tiene un punto de entrada válido.');
        }
        // El reto se ejecuta localmente y sin acceso al DOM; para un runtime compartido se usaría un sandbox aislado.
        const execute = new Function(
          'input',
          `${source}\n; if (typeof ${entryPoint} !== 'function') throw new Error('Crea la función ${entryPoint}.'); return ${entryPoint}(input);`,
        ) as (value: unknown) => unknown;
        const actual = execute(input);
        const expected = parseJsonValue(test.expected);
        const passed = sameValue(actual, expected);
        return {
          label: `Prueba ${index + 1}`,
          passed,
          detail: passed ? `Resultado correcto: ${test.expected}` : `Esperábamos ${test.expected}.`,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo ejecutar el código.';
        return { label: `Prueba ${index + 1}`, passed: false, detail: message };
      }
    });
  } else {
    const normalized = source.toLocaleLowerCase('es');
    let nextScratchSearch = 0;
    results = mission.tests.map((test, index) => {
      const token = test.input.toLocaleLowerCase('es');
      const position = normalized.indexOf(
        token,
        mission.language === 'scratch' ? nextScratchSearch : 0,
      );
      const passed = position >= 0;
      if (passed && mission.language === 'scratch') nextScratchSearch = position + token.length;
      return {
        label: `Comprobación ${index + 1}`,
        passed,
        detail: passed ? test.expected : `Todavía falta: ${test.input}`,
      };
    });
  }

  const success = results.length > 0 && results.every((result) => result.passed);
  const passedCount = results.filter((result) => result.passed).length;
  const output = success
    ? '¡Todo correcto! Has superado las pruebas de esta misión.'
    : `${passedCount} de ${results.length} pruebas superadas. Puedes ajustar el código y volver a intentarlo.`;
  return { results, output, success };
}
