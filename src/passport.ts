import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { userService } from "./users/users.service";

passport.use(
	new Strategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
			algorithms: ["HS256"],
		},
		function (jwt, done) {
			userService
				.findOneById(+jwt.sub)
				.then((user) => {
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				})
				.catch((error) => {
					return done(error, false);
				});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

export default passport;
