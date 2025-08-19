const sequelize = require('../util/database');

const Review = require('../models/review');



exports.getReview = async (req, res) => {
    try {

        const salonId = req.params.id;
        const reviews = await Review.findAll({ where: {salonId} });


        console.log(salonId);

        res.status(200).json({ message: 'successful', reviews: reviews });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
}

exports.getTotalReview = async (req, res) => {
    try {

        const salonId = req.user.id;
        const reviews = await Review.findAll({ where: {salonId} });

        const total = reviews.length;
        const avg = reviews.reduce((sum, r) => sum + Number(r.rate), 0) / total;
        

        res.status(200).json({ message: 'successful', total:total , avg:avg  });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
}

exports.addReview = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        
        const salonId = req.params.id;
        const { rate, feedback } = req.body;

        const review = await Review.create({
            rate,
            feedback,
            salonId
        });

        await t.commit();

        res.status(200).json({ message: 'successful', review: review });

    } catch (error) {

        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false });
    }
}