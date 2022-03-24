/* eslint-disable camelcase */
const extractFrames = require('ffmpeg-extract-frames');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const imageToBase64 = require('image-to-base64');
const uploadImage = require('../helpers/upload-image');
const fs = require('fs');
const path = require('path');
const validUrl = require('valid-url');

module.exports = async (req, res) => {
	try {
		const { video_url, time } = req.body;
		if (!video_url || !time) {
			return res.status(400).send({
				status: false,
				message: "Video Url or timeframe cannot be empty"
			});
		}

		if (!validUrl.isUri(video_url)) {
			return res.status(400).send({
				status: false,
				message: "Invalid Video Url"
			});
		}
		const imagePath = '/tmp/screenshot.jpg';
		await extractFrames({
            input: video_url,
            output: imagePath,
            offsets: [time],
            ffmpegPath,
        });

        // imageFile = await imageToBase64('/tmp/screenshot.jpg', 'base64');
		const imageFile = fs.readFileSync(imagePath);
		const extensionName = path.extname(imagePath);
		const imageBuffer = Buffer.from(imageFile, "base64");
		
        const imageUrl = await uploadImage('video-images1', imageBuffer, extensionName);
        fs.unlinkSync(imagePath);
		return res.status(200).send({
			status: true,
			imageUrl
		});
	} catch (error) {
		console.log("Video frame extract error===>", error);
		return res.status(500).send({
			status: false,
			message: error.message,
		});
	}
};
