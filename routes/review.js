const express=require('express');

const router=express.Router();

const Review=require('../controller/review');

const userAuthentication=require('../middleware/userAuthentication');

router.get('/get-review/:id',userAuthentication.authentication,Review.getReview)

// router.get('/get-reviews',userAuthentication.authentication,Review.getReview)

// router.get('/get-total-reviews',userAuthentication.authentication,Review.getTotalReview);

router.post('/add-review/:id',userAuthentication.authentication,Review.addReview);

// router.post('/add-reply/:id',userAuthentication.authentication,Review.addReply);


module.exports=router;
