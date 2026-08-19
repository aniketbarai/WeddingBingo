export const ROLE_PERMISSIONS = {
  super_admin: ["*"],
  admin: [
    "dashboard.view", "portfolio.view", "portfolio.create", "portfolio.update", "portfolio.delete",
    "galleries.view", "galleries.create", "galleries.update", "galleries.delete",
    "media.view", "media.upload", "media.update", "media.delete", "inquiries.view", "inquiries.update", "inquiries.delete",
    "bookings.view", "bookings.create", "bookings.update", "bookings.delete", "testimonials.view", "testimonials.create", "testimonials.update", "testimonials.delete",
    "packages.view", "packages.create", "packages.update", "packages.delete", "services.view", "services.create", "services.update", "services.delete",
    "audit_logs.view", "settings.view", "settings.update",
  ],
  editor: ["dashboard.view", "portfolio.view", "portfolio.create", "portfolio.update", "portfolio.delete", "galleries.view", "galleries.create", "galleries.update", "galleries.delete", "media.view", "media.upload", "media.update", "media.delete", "testimonials.view", "testimonials.create", "testimonials.update", "testimonials.delete", "blogs.view", "blogs.create", "blogs.update", "blogs.delete"],
  content_manager: ["dashboard.view", "services.view", "services.create", "services.update", "services.delete", "testimonials.view", "testimonials.create", "testimonials.update", "testimonials.delete", "packages.view", "packages.create", "packages.update", "packages.delete"],
};

export const normalizeRole = (role = "admin") => role.toLowerCase().replace(/\s+/g, "_");
export const permissionsForRole = (role) => ROLE_PERMISSIONS[normalizeRole(role)] || [];
export const hasPermission = (admin, permission) => admin?.role === "super_admin" || admin?.permissions?.includes("*") || admin?.permissions?.includes(permission) || permissionsForRole(admin?.role).includes(permission);
