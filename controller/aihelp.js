const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

exports.askAi = async (req, res) => {
    try {
        // console.log(req.body.askedPrompt);


        const instruction = `
                    You are an AI assistant on a salon booking website.
                    Answer only general salon-related or beauty-related questions 
                    (haircare, skincare, facials, etc.).
                    If the user asks anything about salon timings, offers, prices, locations, 
                    appointments, or specific salons — politely reply: "Sorry, I can only answer questions related to beauty, hair, or skincare."
                    Never provide information outside of beauty or salon topics.."
                    If the user asks about unrelated topics (politics, news, math, coding, general knowledge, etc.),  
                    politely reply: "Sorry, I can only answer questions related to beauty, hair, or skincare."
                    Never provide information outside of beauty or salon topics.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: instruction },
                        { text: req.body.askedPrompt }
                    ]
                }
            ],
        });

        // console.log("====================",response.text);

        res.status(200).json({ response: response.text });

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}