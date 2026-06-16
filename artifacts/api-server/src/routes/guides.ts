import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middlewares/require-admin";

const router: IRouter = Router();

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const KNOWN_GUIDES: Record<string, string> = {
  "how-to-close-any-deal": "How to Close Any Business Deal",
  "underground-closing-techniques": "Underground Techniques Used by 7-Figure Closers That Most Will Never Know",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, _file, cb) => {
    const guideId = Array.isArray(req.params.guideId)
      ? req.params.guideId[0]
      : req.params.guideId;
    cb(null, `${guideId}.pdf`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.get("/guides/status", (_req, res): void => {
  const statuses = Object.entries(KNOWN_GUIDES).map(([id, title]) => {
    const filePath = path.join(uploadsDir, `${id}.pdf`);
    const hasFile = fs.existsSync(filePath);
    let fileName: string | null = null;
    if (hasFile) {
      const stats = fs.statSync(filePath);
      fileName = `${id}.pdf (${(stats.size / 1024).toFixed(0)} KB)`;
    }
    return { id, title, hasFile, fileName };
  });
  res.json(statuses);
});

router.post(
  "/guides/:guideId/upload",
  requireAdmin,
  upload.single("file"),
  (req, res): void => {
    const guideId = Array.isArray(req.params.guideId)
      ? req.params.guideId[0]
      : req.params.guideId;

    if (!KNOWN_GUIDES[guideId]) {
      res.status(404).json({ error: "Guide not found" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    res.json({ id: guideId, hasFile: true, fileName: req.file.filename });
  }
);

router.get("/guides/:guideId/download", (req, res): void => {
  const guideId = Array.isArray(req.params.guideId)
    ? req.params.guideId[0]
    : req.params.guideId;

  if (!KNOWN_GUIDES[guideId]) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  const filePath = path.join(uploadsDir, `${guideId}.pdf`);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not yet available" });
    return;
  }

  const title = KNOWN_GUIDES[guideId];
  res.download(filePath, `${title}.pdf`);
});

export default router;
