import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { CreateSubscriberBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/subscribers", async (req, res): Promise<void> => {
  const parsed = CreateSubscriberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [subscriber] = await db
      .insert(subscribersTable)
      .values({ email: parsed.data.email })
      .returning();

    res.status(201).json(subscriber);
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") {
      res.status(409).json({ error: "This email is already subscribed." });
      return;
    }
    throw err;
  }
});

export default router;
