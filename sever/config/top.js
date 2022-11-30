
const topz  = document.getElementById('top');
topz.addEventListener('click',onTop);

function onTop(){
    document.body.scroll = 0 ;  //safari
    document.documentElement.scrollTop  =  0;
    console.log('hello');
}
