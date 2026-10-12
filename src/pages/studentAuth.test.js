import test from 'node:test';
import assert from 'node:assert/strict';
import { canSignInAsStudent } from './studentAuth.js';

test('student login is allowed only for valid student documents', () => {
  assert.equal(canSignInAsStudent({ role: 'student' }), true);
  assert.equal(canSignInAsStudent({ role: 'lecturer' }), false);
  assert.equal(canSignInAsStudent(null), false);
  assert.equal(canSignInAsStudent(undefined), false);
});
