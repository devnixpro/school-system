/**
 * Validators for Fee module forms.
 * All functions return { valid: boolean, message?: string }.
 */

export const validateAmount = (value) => {
  const n = Number(value);
  if (!value && value !== 0) return { valid: false, message: "Amount is required" };
  if (Number.isNaN(n)) return { valid: false, message: "Amount must be a number" };
  if (n <= 0) return { valid: false, message: "Amount must be greater than 0" };
  if (n > 10000000) return { valid: false, message: "Amount looks too high" };
  return { valid: true };
};

export const validateMonth = (value) => {
  if (!value) return { valid: false, message: "Month is required" };
  const pattern = /^[A-Z][a-z]+-\d{4}$/;
  if (!pattern.test(value)) {
    return { valid: false, message: "Use format: October-2026" };
  }
  return { valid: true };
};

export const validateDueDate = (value) => {
  if (!value) return { valid: false, message: "Due date is required" };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { valid: false, message: "Invalid date" };
  return { valid: true };
};

export const validateStudents = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { valid: false, message: "Select at least one student" };
  }
  return { valid: true };
};

export const validateFeeForm = (form) => {
  const errors = {};
  const checks = {
    amount: validateAmount(form.amount),
    month: validateMonth(form.month),
    dueDate: validateDueDate(form.dueDate),
    studentIds: validateStudents(form.studentIds),
  };
  Object.entries(checks).forEach(([key, res]) => {
    if (!res.valid) errors[key] = res.message;
  });
  return { valid: Object.keys(errors).length === 0, errors };
};