import axios from 'axios';
import userModel from '../models/userModel.js';

const generateImage = async (req, res) => {

    try {
        const { prompt } = req.body;
        const userId = req.user.id;
        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        if (user.creditBalance <= 0) {
            return res.status(403).json({ success: false, message: 'Insufficient credits' });
        }

        const response = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            { prompt },
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API,
                },
                responseType: 'arraybuffer',
            }
        );

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        user.creditBalance -= 1;
        await user.save();

        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance,
            resultImage: `data:image/png;base64,${base64Image}`,
        });

    } catch (error) {

        console.error('Image Generation Error:', error.message);
        res.status(500).json({ success: false, message: 'Image generation failed' });
    }
};

export { generateImage };
