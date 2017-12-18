const Entry = require('./models/entry');
const sharp = require('sharp');
const request = require('request').defaults({encoding: null});
const cloudinary = require('cloudinary');
const Vibrant = require('node-vibrant');

cloudinary.config({
    cloud_name: 'vverh',
    api_key: '482121622684964',
    api_secret: 'IZQlGEJqlPg9KXr0yxw9Rcap0dU',
});
cloudinary.v2.config({
    cloud_name: 'vverh',
    api_key: '482121622684964',
    api_secret: 'IZQlGEJqlPg9KXr0yxw9Rcap0dU',
});

const TextToSVG = require('text-to-svg');

class MainApi {
    async getMain() {
        return Entry.find().exec()
    }

    async getEntry(hash) {
        return Entry.findOne({hash}).exec()
    }

    async saveModel(hash, pic, reason) {
        let model = new Entry({
            hash,
            pic,
            reason
        });
        return model.save();
    }


    //server/fonts/OpenSans-Light.ttf
    static async getSvg(color, text = '#мне_не_серо_когда') {
        const textToSVG = TextToSVG.loadSync('server/fonts/OpenSans-Regular.ttf');
        let attributes = {fill: 'black'};
        let options = {x: 0, y: 0, fontSize: 100, anchor: 'top', attributes: attributes};
        options.attributes.fill = color;
        let svg = textToSVG.getSVG(text, options);

        return await sharp(Buffer.from(svg, 'utf8')).toBuffer()
    }


    getPic(body, reason) {
        const options = {};

        const base = sharp(body)
            .resize(1210, 630)
            .crop(sharp.strategy.entropy)
            .normalize()
            .gamma(1.5)
            .toBuffer();

        let yOffset = 170;
        const composite = [
            {image: MainApi.getSvg('#000000'), options: {top: 307, left: 80}},
            {image: MainApi.getSvg('#fc991a'), options: {top: 278, left: 63}},
            {image: MainApi.getSvg('#ffffff'), options: {top: 253, left: 41}},
            {image: MainApi.getSvg('#000000', reason), options: {top: 307 + yOffset, left: 80}},
            {image: MainApi.getSvg('#fc991a', reason), options: {top: 278 + yOffset, left: 63}},
            {image: MainApi.getSvg('#ffffff', reason), options: {top: 253 + yOffset, left: 41}},
            {
                image: sharp('src/assets/logo.png').resize(115, 150).png().toBuffer(),
                options: {top: 20, left: 1210 - 115 - 40}
            },
        ]
            .reduce((input, overlay) => {
                return input.then((data) => {
                    return overlay.image.then((overlayBuff) => {
                        return sharp(data, options).overlayWith(overlayBuff, overlay.options).toBuffer();
                    });
                });
            }, base);

        return composite.then((data) => {
            console.log('compose done');
            return data
        });
    }


    async convertPic(params) {
        return new Promise(resolve => {
            let url = cloudinary.url(params.file.public_id, {
                angle: 'exif',
                // effect: 'art:athena',
            });
            request.get(url, (err, res, body) => {

                let image = this.getPic(body, params.reason);

                Vibrant.from(body).getPalette((err, palette) => {

                    let vibrant = [0, 0, 0];
                    vibrant = palette.DarkMuted ? palette.DarkMuted.getRgb() : vibrant;
                    vibrant = palette.DarkVibrant ? palette.DarkVibrant.getRgb() : vibrant;

                    image.then((buff) => {

                        // sharp(buff).png().toFile('output.png', function (err, info) {
                        //     console.log(err);
                        //     console.log(info);
                        // });

                        cloudinary.v2.uploader.upload_stream({resource_type: 'raw'},
                            (error, result) => {
                                console.log('upload');
                                console.log(result);
                                console.log(error);

                                this.saveModel(
                                    result.public_id,
                                    result,
                                    params.reason);
                                resolve({result, vibrant});
                            })
                            .end(buff);
                    });

                });


            });
        })
    }
}
module.exports = {
    MainApi
}
