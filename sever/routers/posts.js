const express = require('express');

const router  = express.Router();

const db = require('../DB/db');
const dayjs = require('dayjs');


async function getpost(Id){
    let postComments = [];
    let post ;
    try {
        let somePost =await db.select('*').from('post').where('post.id'  , +Id);
        post = somePost[0];
     
        post.createdAt = dayjs(post.createdAt).format('D/MM/YYYY - HH:mm');


        postComments = await db.select('*').from('comment').where('comment.postid',+Id);
        postComments =  postComments.map(post=>{
            const createdAt = dayjs(post.createdAt).format('D/MM/YYYY - HH:mm');
            return {...post , createdAt};
        })

    } catch (error) {
        console.error(error);
    }
    const customTitle =     !!post ? `${post.title} |` :'not found |';
    return {post,postComments,customTitle};
}

router.get('/new', (request, response) => {
    response.render('postNew');
});


router.post('/new', async (request, response) => {


    const { title,content,from , accepted } = request.body ?? {};
    console.log(request.body);
    try {
        if(!title||!content||!from){
            throw new Error('no text');

        }
        else if(!accepted){
            throw new Error('no accepted')
        }

        await db.insert({title , content  , from }).into('post');
    } catch (error) {
        console.error(error);
        let errormessage = 'error';
        if(error.message ==="no text"){
                errormessage = 'text';
        }else if(error.message=='no accepted'){
                errormessage = 'checkbox';

        }
        return response.render('postNew',{errormessage ,value:{ title , content , from}});

    }

    response.redirect('/p/new/done');
 
});

router.post('/:Id/comment' ,async (request , response)=>{
 
    const {Id} = request.params;
  
    const { content,from , accepted } = request.body ?? {};

    try {
        if(!content||!from){
            throw new Error('no text');

        }
        else if(!accepted){
            throw new Error('no accepted')
        }
            
        await db.insert({ content  , from , postid : +Id} ).into('comment');
    } catch (error) {
        console.error(error);
        let errormessage = 'error';
        if(error.message ==="no text"){
                errormessage = 'text';
        }else if(error.message=='no accepted'){
                errormessage = 'checkbox';

        }
        let postData = await getpost(Id);
        return response.render('postId',{
                ...postData
            ,errormessage ,value:{  content , from}});

    }
 

    response.redirect(`/p/${Id}`);
});

router.get('/new/done', (request , response)=>{
    response.render('postNewDone');
});

router.get('/:Id', async (request, response) => {
    const { Id } = request.params
    let postData = await getpost(Id);
    response.render('postId', postData);

});
module.exports = router;