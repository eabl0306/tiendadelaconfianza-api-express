import { Router } from "express";
import { get, getByEmail } from "./users.controller";

const router = Router();

router.get("/:id", get);

router.get("/email/:email", getByEmail);

export default router;
