const CircleDisc = require("../");

const hook = new CircleDisc("id", "token", 5600);

hook.once("listening", () => {
    console.log("Ready!");
});

hook.on("buildComplete", (payload) => {
    console.log("Build", payload.build_num, "complete!");
});