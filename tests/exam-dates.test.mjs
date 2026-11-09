import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../utils/academicYear.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { getOfficialExamDateSource, getDefaultDatesForYear, OSYM_2027_SOURCE } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
for (const [exam, date] of [['TYT', '2027-06-19'], ['AYT', '2027-06-20'], ['YDT', '2027-06-20']]) {
  assert.equal(getOfficialExamDateSource(exam, date), OSYM_2027_SOURCE);
}
assert.equal(getOfficialExamDateSource(' tyt ', '2027-06-19'), OSYM_2027_SOURCE);
assert.equal(getOfficialExamDateSource('TYT', '2027-06-20'), undefined);
assert.equal(getOfficialExamDateSource('AYT', '2027-06-19'), undefined);
assert.equal(getOfficialExamDateSource('Deneme', '2027-06-19'), undefined);
const future = getDefaultDatesForYear('2027-2028');
assert.equal(getOfficialExamDateSource('TYT', future.tytDate), undefined);
assert.equal(getOfficialExamDateSource('AYT', future.aytDate), undefined);
assert.equal(getOfficialExamDateSource('YDT', future.ydtDate), undefined);
assert.equal(getDefaultDatesForYear('2026-2027').tytDate, '2027-06-19');
console.log('11 exam date assertions passed.');
