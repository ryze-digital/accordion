import fs from "fs";

if (fs.existsSync("demos/build")) {
    fs.rm("demos/build", { recursive: true }, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.info("Folder deleted successfully");
    });
}
