import { Router } from "express";
import { findOneById, create, findAll } from "./users.controller";
import { controller } from "../utilities/controller";
import { roles } from "../utilities/middlewares/roles";
import { EUserRole } from "./dto/user.dto";
import passport from "../passport";
import { pagination } from "../utilities/middlewares/pagination";

const router = Router();

router.get(
	"/:id",
	passport.authenticate("jwt"),
	roles(EUserRole.USER),
	controller(findOneById)
);

router.get("/", pagination, controller(findAll));

router.post("/", controller(create));

export default router;
