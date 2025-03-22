
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  const toyCollection = document.querySelector('#toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  let addToy = false;

  
  const TOYS_URL = 'http://localhost:3000/toys';

  
  addBtn.addEventListener('click', () => {
      addToy = !addToy;
      toyFormContainer.style.display = addToy ? 'block' : 'none';
  });

  
  function fetchToys() {
      fetch(TOYS_URL)
          .then(response => response.json())
          .then(toys => {
              toys.forEach(toy => renderToy(toy));
          })
          .catch(error => console.error('Error fetching toys:', error));
  }


  function renderToy(toy) {
      const toyCard = document.createElement('div');
      toyCard.className = 'card';
      
      toyCard.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes || 0} Likes</p>
          <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
      `;

      // Add like button functionality
      const likeBtn = toyCard.querySelector('.like-btn');
      likeBtn.addEventListener('click', () => likeToy(toy.id, toy.likes));

      toyCollection.appendChild(toyCard);
  }

  // Handle form submission
  addToyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
          name: e.target.name.value,
          image: e.target.image.value,
          likes: 0
      };

      fetch(TOYS_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(toy => {
          renderToy(toy);
          addToyForm.reset();
          toyFormContainer.style.display = 'none';
          addToy = false;
      })
      .catch(error => console.error('Error creating toy:', error));
  });

  // Handle like button clicks
  function likeToy(toyId, currentLikes) {
      const newLikes = (currentLikes || 0) + 1;

      fetch(`${TOYS_URL}/${toyId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
          const toyCard = document.querySelector(`button[data-id="${toyId}"]`).parentElement;
          toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error liking toy:', error));
  }

  // Initial fetch of toys
  fetchToys();
});