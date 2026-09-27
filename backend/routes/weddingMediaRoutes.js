import express from "express";
import {
  adminGetWedding,
  adminUploadWeddingCover,
  adminDeleteWeddingCover,
  adminUploadWeddingVideo,
  adminDeleteWeddingVideo,
  adminAddWeddingGalleryImage,
  adminRemoveWeddingGalleryImage,
  adminReorderWeddingGallery,
  adminDeleteWeddingWithCleanup,
} from "../controllers/weddingMediaController.js";
import { requireAdminAuth, requirePermission } from "../middlewares/authJwt.js";
import { upload } from "../middlewares/upload.js";
import { videoUpload } from "../middlewares/videoUpload.js";

const router = express.Router();
router.use(requireAdminAuth);

router.get("/admin/weddings/:id/full", requirePermission("portfolio.view"), adminGetWedding);

router.post("/admin/weddings/:id/cover", requirePermission("portfolio.update"), upload.single("image"), adminUploadWeddingCover);
router.delete("/admin/weddings/:id/cover", requirePermission("portfolio.update"), adminDeleteWeddingCover);

router.post("/admin/weddings/:id/video", requirePermission("portfolio.update"), videoUpload.single("video"), adminUploadWeddingVideo);
router.delete("/admin/weddings/:id/video", requirePermission("portfolio.update"), adminDeleteWeddingVideo);

router.post("/admin/weddings/:id/gallery", requirePermission("portfolio.update"), upload.single("image"), adminAddWeddingGalleryImage);
router.delete("/admin/weddings/:id/gallery/:imageId", requirePermission("portfolio.update"), adminRemoveWeddingGalleryImage);
router.patch("/admin/weddings/:id/gallery/reorder", requirePermission("portfolio.update"), adminReorderWeddingGallery);

// Overrides the generic mvpRoutes delete for this one resource so deleting a
// story also cleans up its ImageKit assets. Must be mounted before mvpRoutes
// in app.js so Express resolves this handler first.
router.delete("/admin/weddings/:id", requirePermission("portfolio.delete"), adminDeleteWeddingWithCleanup);

export default router;
