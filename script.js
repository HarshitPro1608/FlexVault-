// 'use strict';

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
// import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

// const firebaseConfig = {
//   apiKey: "AIzaSyCntJyp2Q8PfKklUOVQWDZQ6UmbV3UNDE8",
//   authDomain: "flexvault-f438a.firebaseapp.com",
//   projectId: "flexvault-f438a",
//   storageBucket: "flexvault-f438a.appspot.com",
//   messagingSenderId: "38963046556",
//   appId: "1:38963046556:web:254cd9c8feeb0b11a9a559"
// };

// const fapp = firebase.initializeApp(firebaseConfig);
// const db = getFirestore(fapp);

// class Workout {
//   date = new Date();
//   id = (Date.now() + '').slice(-10);
//   clicks = 0;

//   constructor(coords, distance, duration) {
//     // this.date = ...
//     // this.id = ...
//     this.coords = coords; // [lat, lng]
//     this.distance = distance; // in km
//     this.duration = duration; // in min
//   }

//   _setDescription() {
//     // prettier-ignore
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//     this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
//       months[this.date.getMonth()]
//     } ${this.date.getDate()}`;
//   }

//   click() {
//     this.clicks++;
//   }
// }

// class Running extends Workout {
//   type = 'running';

//   constructor(coords, distance, duration, cadence) {
//     super(coords, distance, duration);
//     this.cadence = cadence;
//     this.calcPace();
//     this._setDescription();
//   }

//   calcPace() {
//     // min/km
//     this.pace = this.duration / this.distance;
//     return this.pace;
//   }
// }

// class Cycling extends Workout {
//   type = 'cycling';

//   constructor(coords, distance, duration, elevationGain) {
//     super(coords, distance, duration);
//     this.elevationGain = elevationGain;
//     // this.type = 'cycling';
//     this.calcSpeed();
//     this._setDescription();
//   }

//   calcSpeed() {
//     // km/h
//     this.speed = this.distance / (this.duration / 60);
//     return this.speed;
//   }
// }

// // const run1 = new Running([39, -12], 5.2, 24, 178);
// // const cycling1 = new Cycling([39, -12], 27, 95, 523);
// // console.log(run1, cycling1);

// ///////////////////////////////////////
// // APPLICATION ARCHITECTURE
// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

// class App {

//   #map;
//   #mapZoomLevel = 13;
//   #mapEvent;
//   #workouts = [];

//   constructor() {
//     // Get user's position
//     this._getPosition();

//     // Get data from local storage
//     this._getLocalStorage();

//     // Attach event handlers
//     form.addEventListener('submit', this._newWorkout.bind(this));
//     inputType.addEventListener('change', this._toggleElevationField);
//     containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

//     firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         this.user = user;
//         // Fetch user-specific activities
//         this._fetchUserActivities();
//       } else {
//         // User is signed out, clear data
//         this.user = null;
//         this.#workouts = [];
//         containerWorkouts.innerHTML = ''; // Clear UI
//       }
//     });
//   }

//   _getPosition() {
//     if (navigator.geolocation)
//       navigator.geolocation.getCurrentPosition(
//         this._loadMap.bind(this),
//         function () {
//           alert('Could not get your position');
//         }
//       );
//   }


//   _loadMap(position) {
//     const { latitude, longitude } = position.coords;

//     const coords = [latitude, longitude];

//     this.#map = new mappls.Map('map', {center:[position.coords.latitude,position.coords.longitude]});




//     // Handling clicks on map
//     this.#map.on('click', this._showForm.bind(this));

//     this.#workouts.forEach(work => {
//       this._renderWorkoutMarker(work);
//     });
//   }

//   _showForm(mapE) {
//     this.#mapEvent = mapE;
//     form.classList.remove('hidden');
//     inputDistance.focus();
//   }

//   _hideForm() {
//     // Empty inputs
//     inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
//       '';

//     form.style.display = 'none';
//     form.classList.add('hidden');
//     setTimeout(() => (form.style.display = 'grid'), 1000);
//   }

//   _toggleElevationField() {
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   }

//   async _newWorkout(e) {
//     if (!this.user) {
//       // Handle unauthenticated user
//       return alert('Please sign in to add workouts.');
//     }
//     const validInputs = (...inputs) =>
//       inputs.every(inp => Number.isFinite(inp));
//     const allPositive = (...inputs) => inputs.every(inp => inp > 0);

//     e.preventDefault();

//     // Get data from form
//     const type = inputType.value;
//     const distance = +inputDistance.value;
//     const duration = +inputDuration.value;
//     console.log(this.#mapEvent.lngLat)
//     const { lng, lat } = this.#mapEvent.lngLat;
//     let workout;

//     // If workout running, create running object
//     if (type === 'running') {
//       const cadence = +inputCadence.value;

//       // Check if data is valid
//       if (
//         // !Number.isFinite(distance) ||
//         // !Number.isFinite(duration) ||
//         // !Number.isFinite(cadence)
//         !validInputs(distance, duration, cadence) ||
//         !allPositive(distance, duration, cadence)
//       )
//         return alert('Inputs have to be positive numbers!');

//       workout = new Running([lat, lng], distance, duration, cadence);
//     }

//     // If workout cycling, create cycling object
//     if (type === 'cycling') {
//       const elevation = +inputElevation.value;

//       if (
//         !validInputs(distance, duration, elevation) ||
//         !allPositive(distance, duration)
//       )
//         return alert('Inputs have to be positive numbers!');

//       workout = new Cycling([lat, lng], distance, duration, elevation);
//     }

//     // Add new object to workout array
//     this.#workouts.push(workout);

//     // Render workout on map as marker
//     this._renderWorkoutMarker(workout);

//     // Render workout on list
//     this._renderWorkout(workout);

//     // Hide form + clear input fields
//     this._hideForm();

//     // Set local storage to all workouts
//     this._setLocalStorage();

//     await db.collection('userActivities').doc(this.user.uid).collection('workouts').add({
//       type: type,
//       distance: distance,
//       duration: duration,
//       coords: {
//         lat: lat,
//         lng: lng
//       },
//       // Additional properties depending on workout type
//       cadence: cadence, // Only for running
//       elevationGain: elevation // Only for cycling
//     });
//   }

//   async _fetchUserActivities() {
//     // Fetch user-specific activities from Firestore
//     const snapshot = await db.collection('userActivities').doc(this.user.uid).collection('workouts').get();
//     snapshot.forEach(doc => {
//       const workoutData = doc.data();
  
//       let workout;
  
//       if (workoutData.type === 'running') {
//         workout = new Running(
//           [workoutData.coords.lat, workoutData.coords.lng],
//           workoutData.distance,
//           workoutData.duration,
//           workoutData.cadence
//         );
//       } else if (workoutData.type === 'cycling') {
//         workout = new Cycling(
//           [workoutData.coords.lat, workoutData.coords.lng],
//           workoutData.distance,
//           workoutData.duration,
//           workoutData.elevationGain
//         );
//       }
  
//       // Render workout on list
//       this._renderWorkout(workout);
//     });
//   }

//   _renderWorkoutMarker(workout) {
//     let Marker1 = new mappls.Marker({
//       map: this.#map,
//       position: {
//         "lat": workout.coords[0],
//         "lng": workout.coords[1]
//       },
//       fitbounds: true,
      
//       icon_url: 'https://apis.mapmyindia.com/map_v3/2.png',
//       draggable: true
//     });
//   }

//   _renderWorkout(workout) {
//     let html = `
//       <li class="workout workout--${workout.type}" data-id="${workout.id}">
//         <h2 class="workout__title">${workout.description}</h2>
//         <div class="workout__details">
//           <span class="workout__icon">${
//             workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
//           }</span>
//           <span class="workout__value">${workout.distance}</span>
//           <span class="workout__unit">km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⏱</span>
//           <span class="workout__value">${workout.duration}</span>
//           <span class="workout__unit">min</span>
//         </div>
//     `;

//     if (workout.type === 'running')
//       html += `
//         <div class="workout__details">
//           <span class="workout__icon">⚡️</span>
//           <span class="workout__value">${workout.pace.toFixed(1)}</span>
//           <span class="workout__unit">min/km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">🦶🏼</span>
//           <span class="workout__value">${workout.cadence}</span>
//           <span class="workout__unit">spm</span>
//         </div>
//       </li>
//       `;

//     if (workout.type === 'cycling')
//       html += `
//         <div class="workout__details">
//           <span class="workout__icon">⚡️</span>
//           <span class="workout__value">${workout.speed.toFixed(1)}</span>
//           <span class="workout__unit">km/h</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⛰</span>
//           <span class="workout__value">${workout.elevationGain}</span>
//           <span class="workout__unit">m</span>
//         </div>
//       </li>
//       `;

//     form.insertAdjacentHTML('afterend', html);
//   }

//   _moveToPopup(e) {
//     if (!this.#map) return;

//     const workoutEl = e.target.closest('.workout');

//     if (!workoutEl) return;

//     const workout = this.#workouts.find(
//       work => work.id === workoutEl.dataset.id
//     );

//     this.#map.setView(workout.coords, this.#mapZoomLevel, {
//       animate: true,
//       pan: {
//         duration: 1,
//       },
//     });
//   }

//   _setLocalStorage() {
//     localStorage.setItem('workouts', JSON.stringify(this.#workouts));
//   }

//   _getLocalStorage() {
//     const data = JSON.parse(localStorage.getItem('workouts'));

//     if (!data) return;

//     this.#workouts = data;

//     this.#workouts.forEach(work => {
//       this._renderWorkout(work);
//     });
//   }

//   reset() {
//     localStorage.removeItem('workouts');
//     location.reload();
//   }
// }

// const app = new App();
