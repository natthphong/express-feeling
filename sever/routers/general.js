const express = require('express');
const db = require('../DB/db');
const dayjs = require('dayjs');

const router = express.Router();



router.get('/', async (request, response) => {
    let allpost = [];
    try {

        allpost = await db.select('post.id', 'post.title', 'post.from', 'post.createdAt')
        .count('comment.postid as commentCount')
        .from('post')
        .leftJoin('comment','post.id','comment.postid')
        .groupBy('post.id')
        .orderBy('post.id' , 'desc')

     
       allpost =  allpost.map(post=>{
            const createdAtText = dayjs(post.createdAt).format('D/MM/YYYY - HH:mm');
            return {...post,createdAtText};
        }); 
   
    } catch (error) {
        console.error(error);
    }


    response.render('home', { allpost });
});


module.exports = router;