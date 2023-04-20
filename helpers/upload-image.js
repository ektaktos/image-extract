const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");
const isBase64 = require("is-base64");
const fs = require('fs');
const keyFile = fs.readFileSync('./gcloud-key.json');
const gcloudCredential = JSON.parse(keyFile);

const storage = new Storage({
	projectId: 'abegtech',
	credentials: gcloudCredential,
});

module.exports = async (bucketName, image, imageType) => {
    try {
        const imageBase = `https://storage.googleapis.com/${bucketName}`;

		const [bucketExist] = await storage.bucket(bucketName).exists();

		if (!bucketExist) {
			await storage.createBucket(bucketName);
		}

		const filename = `${uuidv4()}`;

		const resp = await storage
			.bucket(bucketName)
			.file(`${filename}${imageType}`)
			.save(image);

		imageUrl = `${imageBase}/${filename}${imageType}`;

		return imageUrl;

    } catch (error) {
        console.log("uploadImageBase64::Error===>", error.message);
		return {
			status: false,
			message: error.message,
		};
    }
}