const CircleDisc = require("../");

const hook = new CircleDisc("id", "token", 5600);

hook.once("listening", () => {
    console.log("Ready!");
});

hook.on("buildComplete", (body, type) => {
    switch (type.toLowerCase()) {
        case "appveyor": {
            return console.log("Build", body.eventData.buildNumber, "on AppVeyor completed!");
        }
        case "circleci": {
            return console.log("Build", body.payload.build_num, "on CircleCI completed!");
        }
    }
})