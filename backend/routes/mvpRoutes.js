import express from "express";
import { requireAdminAuth, requirePermission } from "../middlewares/authJwt.js";
import { resources, permissionNames, listResource, createResource, updateResource, deleteResource, addInquiryNote, updateInquiryStatus } from "../controllers/mvpController.js";

const router = express.Router();
router.use(requireAdminAuth);

Object.keys(resources).forEach((resource) => {
  const permission = permissionNames[resource];
  router.get(`/${resource}`, requirePermission(`${permission}.view`), listResource);
  router.post(`/${resource}`, requirePermission(`${permission}.create`), createResource);
  router.patch(`/${resource}/:id`, requirePermission(`${permission}.update`), updateResource);
  router.delete(`/${resource}/:id`, requirePermission(`${permission}.delete`), deleteResource);
});

router.post("/inquiries/:id/notes", requirePermission("inquiries.update"), addInquiryNote);
router.patch("/inquiries/:id/status", requirePermission("inquiries.update"), updateInquiryStatus);

export default router;
