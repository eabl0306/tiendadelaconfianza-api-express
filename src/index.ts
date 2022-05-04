import dotenv from "dotenv";
if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: ".production.env" });
} else {
	dotenv.config({ path: ".development.env" });
}

import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { HttpError } from "http-errors";
import methodOverride from "method-override";
import express, { Request, Response, NextFunction } from "express";
import expressSession from "express-session";
import winston from "winston";
import winstonExpress from "express-winston";
import passport from "./passport";

// rutas
import auth from "./auth/auth.routes";
import users from "./users/users.routes";

import "./products/models/product.model";

const sess: expressSession.SessionOptions = {
	secret: "vefhbicuehwoidfh",
	cookie: {},
};

const app = express();
const port = 3000;

if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sess.cookie.secure = true;
}

app.use(
	cors({
		origin: "*",
	})
);
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride());

app.get("/", (req, res) => {
	res.send("ok");
});
app.use("/auth", auth);
app.use("/users", users);

app.use(async function (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err && err.status) {
		const { status, name, message, stack } = err as HttpError;
		res.status(status).send({ name, message, stack });
	} else if (err.name === "SequelizeUniqueConstraintError") {
		res.status(406).send({
			message: err.message,
			stack: err.stack,
			errors: err.errors.map((it: any) => ({
				message: it.message,
				type: it.type,
				field: it.path,
				value: it.value,
			})),
		});
	} else {
		next(err);
	}
});

app.use(
	winstonExpress.logger({
		transports: [
			new winston.transports.File({
				level: "error",
				filename: "error.log",
				format: winston.format.json(),
			}),
			new winston.transports.File({
				level: "info",
				filename: "combined.log",
				format: winston.format.json(),
			}),
		],
		format: winston.format.combine(winston.format.json()),
	})
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
