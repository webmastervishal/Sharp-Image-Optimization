const sharp = require('sharp')
const sizeOf = require('image-size')

async function compressWithJpg(img) {

    const {
        data,
        info
    } = await sharp(img)
        .jpeg({
            quality: 100,
            chromaSubsampling: '4:4:4'
        })
        .toBuffer({
            resolveWithObject: true
        });
    return {
        data,
        info
    };
}

async function compressWithWebp(img) {
    const {
        data,
        info
    } = await sharp(img)
        .withMetadata()
        .webp()
        .toBuffer({
            resolveWithObject: true
        })
    return {
        data,
        info
    };
}
async function resizeWithJpg(img, newSize) {

    const {
        data,
        info
    } = await sharp(img)
        .resize(newSize)
        .jpeg({
            quality: 100,
            chromaSubsampling: '4:4:4'
        })
        .toBuffer({
            resolveWithObject: true
        });

    return {
        data,
        info
    };
}

async function resizeWithWebp(img, newSize) {
    const {
        data,
        info
    } = await sharp(img)
        .withMetadata()
        .resize(newSize)
        .webp()
        .toBuffer({
            resolveWithObject: true
        })
    return {
        data,
        info
    };
}

async function aspectRatio(img, newWidth) {
    let {
        height,
        width
    } = sizeOf(img);
    let newHeight = Math.round((height / width) * newWidth);

    return {
        width: newWidth,
        height: newHeight
    }
}

async function getMB(size) {
    return (size / 1024 / 1024).toFixed(2)
}


module.exports = {
    compressWithJpg,
    compressWithWebp,
    aspectRatio,
    resizeWithJpg,
    resizeWithWebp,
    getMB
}