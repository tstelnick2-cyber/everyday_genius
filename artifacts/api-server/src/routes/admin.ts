import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { AdminLoginBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/require-admin";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "genius2024";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  req.session.isAdmin = true;
  res.json({ authenticated: true });
});

router.post("/admin/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ authenticated: false });
  });
});

router.get("/admin/status", (req, res): void => {
  res.json({ authenticated: !!req.session?.isAdmin });
});

router.get("/admin/subscribers", requireAdmin, async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(subscribersTable)
    .orderBy(subscribersTable.createdAt);
  res.json(subscribers);
});

export default router;
