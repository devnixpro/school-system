export const ROLES = Object.freeze({
  SUPER_ADMIN: "superadmin",
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
});
export const PRIVILEGED_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN];
