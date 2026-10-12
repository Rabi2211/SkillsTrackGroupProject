import test from 'node:test';
import assert from 'node:assert/strict';
import { buildResourceStoragePath, isPdfFile } from './resourceStorage.js';

test('buildResourceStoragePath makes a safe Firebase Storage path for PDFs', () => {
  const result = buildResourceStoragePath('Week 1 Guide.pdf');

  assert.match(result, /^resources\/\d+_Week_1_Guide\.pdf$/);
});

test('isPdfFile accepts pdf files and rejects non-pdf files', () => {
  assert.equal(isPdfFile({ name: 'notes.pdf', type: 'application/pdf' }), true);
  assert.equal(isPdfFile({ name: 'notes.txt', type: 'text/plain' }), false);
});
