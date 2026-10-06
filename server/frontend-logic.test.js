// Unit test for frontend form validation logic
function validateProjectInput(title, status) {
  if (!title || title.trim() === '') {
    return { valid: false, error: 'Project Title is required' };
  }
  const allowed = ['active', 'completed', 'archived'];
  const sanitizedStatus = allowed.includes(status) ? status : 'active';
  return {
    valid: true,
    data: {
      title: title.trim(),
      status: sanitizedStatus
    }
  };
}

describe('Day 36 Frontend Unit Tests', () => {
  test('Validates whitespace title input correctly', () => {
    const result = validateProjectInput('   ', 'active');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project Title is required');
  });

  test('Sanitizes input and defaults status properly', () => {
    const result = validateProjectInput('  New Frontend Project  ', 'unknown');
    expect(result.valid).toBe(true);
    expect(result.data.title).toBe('New Frontend Project');
    expect(result.data.status).toBe('active');
  });
});