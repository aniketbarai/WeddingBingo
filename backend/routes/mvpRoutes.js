import express from "express";
import { requireAdminAuth, requirePermission } from "../middlewares/authJwt.js";
import { resources, permissionNames, listResource, createResource, updateResource, deleteResource, addInquiryNote, updateInquiryStatus } from "../controllers/mvpController.js";
import { upload, uploadVideo } from "../middlewares/upload.js";
import { addWeddingMedia, deleteWeddingMedia, setWeddingCoverImage, setWeddingVideo, deleteWeddingVideo } from "../controllers/weddingMediaController.js";

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

// Per-couple story media: hero video, cover image, and this couple's own
// photo gallery — each stored on the Wedding doc, separate from the shared
// gallery pool managed under Admin > Gallery.
router.post("/weddings/:id/media", requirePermission("portfolio.update"), upload.single("image"), addWeddingMedia);
router.delete("/weddings/:id/media/:mediaId", requirePermission("portfolio.update"), deleteWeddingMedia);
router.post("/weddings/:id/cover", requirePermission("portfolio.update"), upload.single("image"), setWeddingCoverImage);
router.post("/weddings/:id/video", requirePermission("portfolio.update"), uploadVideo.single("video"), setWeddingVideo);
router.delete("/weddings/:id/video", requirePermission("portfolio.update"), deleteWeddingVideo);

router.post("/inquiries/:id/notes", requirePermission("inquiries.update"), addInquiryNote);
router.patch("/inquiries/:id/status", requirePermission("inquiries.update"), updateInquiryStatus);

export default router;
