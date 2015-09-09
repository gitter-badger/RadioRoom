var v = document.querySelector('audio'),
    source = v.querySelector('source')
source.addEventListener('error', function(ev){
    console.log('error:', ev)
})