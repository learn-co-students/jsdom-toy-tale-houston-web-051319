//this is here so that variables are in scope for the other functions
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyURL = "http://localhost:3000/toys"
let submitForm = document.querySelector('.add-toy-form')

//loads this stuff first, no matter where script tag is in html
document.addEventListener('DOMContentLoaded',function(){

  //get toys
  fetch(toyURL)
  .then( (response) => { return response.json() } )
  .then( (results) => {
    //create cards
    results.forEach(toycard)
  })

})

// hide & seek with the form
let addToy = false
addBtn.addEventListener('click', () => {
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    submitForm.addEventListener('submit', newToy)
  } else {
    toyForm.style.display = 'none'
  }
})

//function to add new toys
function newToy(e){
  e.preventDefault()

  fetch(toyURL,{
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Accept': "application/json"
    },
    body: JSON.stringify({
      //children 1 and 3 are name and image inputs of the form
      name: submitForm.children[1].value,
      image: submitForm.children[3].value,
      likes: 0
    })
  }).then(response => response.json() )
  //creates toy card for new toy after getting the confirmation back from the server
  .then(toycard)
  //hides the new toy display and lets user know toy has been made
  .then(
    addToy = false,
    toyForm.style.display = 'none'
  )
  
}


//easier to create elements
let c = tagName => document.createElement(tagName)

//function to create toy cards
function toycard(toy){

  //create div
  let div = c('div')
  div.className = "card"

  //create header
  let h2 = c('h2')
  h2.innerText = toy.name

  //create img
  let img = c('img')
  img.src = toy.image
  img.className = "toy-avatar"

  //create like label and button
  let p = c('p')
  likeChecker(toy,p)
  let button = c('button')
  button.className ="like-btn"
  button.innerText = "Like <3"
  //make button increase like count
  button.addEventListener('click',() => likeButton(toy,p))

  //create dislike button
  let button2 = c('button')
  button2.className ="like-btn"
  button2.innerText = "Dislike </3"
  //make button decrease like count
  button2.addEventListener('click',() => dislikeButton(toy,p))

  //append stuff into the div
  div.append(h2,img,p,button,button2)

  //find toy collection div
  let collection = document.querySelector('#toy-collection')

  //append card div to collection
  collection.append(div)

}

// function for like button event listener
function likeButton(toy,p){
  // adds like to database
  fetch(toyURL+`/${toy.id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json',
      'Accept': "application/json"
    },
    body: JSON.stringify({
      likes: (toy.likes + 1)
    })
  }).then( response => response.json() )
  //gets like total back and displays it
  .then((result) => {
    toy.likes = result.likes
    likeChecker(toy,p)
  })
}

// function for dislike button event listener
function dislikeButton(toy,p){
  // adds like to database
  fetch(toyURL+`/${toy.id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json',
      'Accept': "application/json"
    },
    body: JSON.stringify({
      likes: (toy.likes - 1)
    })
  }).then( response => response.json() )
  //gets like total back and displays it
  .then((result) => {
    toy.likes = result.likes
    likeChecker(toy,p)
  })
}

function likeChecker(toy,p){
  //word is singular for one like
  if(toy.likes == 1){
    p.innerText = `${toy.likes} Like`
  }else{
    p.innerText = `${toy.likes} Likes`
  }
}
