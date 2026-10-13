// A learner may sign in to the learner portal only when their
// students/{uid} record exists and is marked as a student.
export function canSignInAsStudent(studentRecord) {
  return Boolean(studentRecord) && studentRecord.role === 'student';
}
