import makeApp from "./app";
import Sync from "./utilities/syncDB";

const { app } = makeApp();

// noinspection JSIgnoredPromiseFromCall
// Sync.synchronize();

app.listen(+process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`);
});
