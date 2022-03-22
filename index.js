const fs = require("fs");
const http = require("http");
const {
    compressWithJpg,
    compressWithWebp,
    aspectRatio,
    resizeWithJpg,
    resizeWithWebp,
    getMB
} = require("./convertImages.js");
const sizeOf = require("image-size");

function writeFile(path, data) {
    fs.writeFile(path, data, "binary",
        (err, dt) => {
            if (err) {
                console.log("error", err);
            }
        }
    );
}

fs.readdir("./images", (err, filenames) => {
    let imageSize = [320, 640, 1280];

    filenames.forEach((filename) => {
        let file = `images/${filename}`;
        let extention = filename.substring(filename.indexOf('.') + 1);

        fs.readFile(file, async (err, data) => {
            if (err) {
                throw err;
            }

            let webpFile = await compressWithWebp(data);
            let size = await getMB(webpFile.info.size)

            //compress with webp
            writeFile(
                `./converted-images/webp/${filename}-${size} MB.${extention}`,
                webpFile.data
            );

            let jpgFile = await compressWithJpg(data);
            size = await getMB(jpgFile.info.size)


            //compress with jpeg
            writeFile(
                `./converted-images/jpeg/${filename}-${size} MB.${extention}`,
                jpgFile.data
            );

            imageSize.forEach(async (is) => {
                let newSize = await aspectRatio(file, is);

                webpFile = await resizeWithWebp(data, newSize);
                size = await getMB(webpFile.info.size)

                writeFile(
                    `./converted-images/webp/${filename}-${newSize.width}x${newSize.height}-${size} MB.${extention}`,
                    webpFile.data
                );

                jpgFile = await resizeWithJpg(data, newSize);
                size = await getMB(jpgFile.info.size)

                writeFile(
                    `./converted-images/jpeg/${filename}-${newSize.width}x${newSize.height}-${size} MB.${extention}`,
                    jpgFile.data
                );

            });
        });
    });

    http.createServer(async function(req, res) {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.write("Hello World!");
        res.end();
    }).listen(6655);
    console.log("Server running at http://localhost:6655/");
});