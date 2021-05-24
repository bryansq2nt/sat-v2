const AWS = require('aws-sdk');
const sharp = require('sharp');
const path = require('path');

let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const uploadToS3 = (file) => {
    return new Promise(function (resolve, reject) {
        var image = {
            name: file.originalname,
            ext: path.extname(file.originalname)
        }

        const fileKey = "images/" + image.name + Date.now() + image.ext;


        sharp(file.buffer)
            .resize(500)
            .toBuffer()
            .then( data => {
               
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileKey,
                    Body: data,
                    ContentType: file.mimetype,
                    ACL: 'public-read'
                };

                s3bucket.upload(params, (err, data) => {
                    if (err) {
                        console.log(err);
                        reject(new Error(err.message));
                    } else {
                        resolve(fileKey);
                    }
                });
            })
            .catch (error => {
                console.log(error);
                reject(new Error(error.message));
            })

    });
}

const deleteFromS3 = (fileKey) => {
    return new Promise(function (resolve, reject) {

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        };

        s3bucket.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(new Error(err.message));
            } else {
                resolve(fileKey);
            }
        });
    });
}

module.exports = {
    uploadToS3,
    deleteFromS3
}