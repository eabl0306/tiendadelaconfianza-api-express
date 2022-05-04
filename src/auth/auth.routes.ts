import express from "express";
import { authLocal, profile } from "./auth.controller";
import { controller } from "../utilities/controller";
import passport from "../passport";

const router = express.Router();

router.post("/", controller(authLocal));

router.get("/profile", passport.authenticate("jwt"), controller(profile));

export default router;
