import express from "express";
import { requireAdminAuth, requirePermission } from "../middlewares/authJwt.js";
import { resources, permissionNames, listResource, createResource, updateResource, deleteResource, addInquiryNote, updateInquiryStatus } from "../controllers/mvpController.js";

const router = express.Router();
router.use(requireAdminAuth);

// These routes are registered with literal paths (e.g. /packages), so
// req.params.resource is not populated automatically. Set it explicitly for
// the shared CRUD handlers before they resolve the model from `resources`.
const withResource = (resource, handler) => (req, res, next) => {
  req.params.resource = resource;
  return handler(req, res, next);
};

Object.keys(resources).forEach((resource) => {
  const permission = permissionNames[resource];
  router.get(`/${resource}`, requirePermission(`${permission}.view`), withResource(resource, listResource));
  router.post(`/${resource}`, requirePermission(`${permission}.create`), withResource(resource, createResource));
  router.patch(`/${resource}/:id`, requirePermission(`${permission}.update`), withResource(resource, updateResource));
  router.delete(`/${resource}/:id`, requirePermission(`${permission}.delete`), withResource(resource, deleteResource));
});

router.post("/inquiries/:id/notes", requirePermission("inquiries.update"), addInquiryNote);
router.patch("/inquiries/:id/status", requirePermission("inquiries.update"), updateInquiryStatus);

export default router;
