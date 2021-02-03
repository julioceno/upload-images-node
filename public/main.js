const albums = document.querySelectorAll('.album')


albums.forEach( album => {
    const imagesContainer = album.children[2].children[1]
    const imagesSrc = (album.children[2].children[0].value).split(',')


    imagesSrc.forEach(link => {
        const img = document.createElement('img')
        img.src = link
        
        imagesContainer.appendChild(img)
    })
    

})