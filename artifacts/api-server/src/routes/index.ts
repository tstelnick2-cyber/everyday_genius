import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subscribersRouter from "./subscribers";
import adminRouter from "./admin";
import guidesRouter from "./guides";

const router: IRouter = Router();

router.use(healthRouter);
router.use(subscribersRouter);
router.use(adminRouter);
router.use(guidesRouter);

export default router;
