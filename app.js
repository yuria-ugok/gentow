'use strict';

PetiteVue.createApp({
  screen: 1,
  dataExtract: [],
  MydataExtract: [],

  setScreen(n) {
    this.screen = n;
  },

  init() {
    const db = firebase.database();
    const postRef = db.ref('/post');

    const vue = this;
    postRef.once('value', function (snapshot) {
      vue.dataExtract = snapshot.val();
    });

    // const $signin = document.querySelector('#signin');
    const provider = new firebase.auth.GoogleAuthProvider();
    /* $signin.addEventListener('click', function () {
      firebase.auth().signInWithRedirect(provider);
    }); */

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const $profile = document.querySelector('#profile');
        $profile.innerHTML = `
        <div>${user['displayName']}</div>
        <img src="${user['photoURL']}" width="50">
      `;
      } else {
        firebase.auth().signInWithRedirect(provider);
      }
    });

    const $signout = document.querySelector('#signout');
    $signout.addEventListener('click', function () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          location.reload();
        });
    });
  },

  Screen1,
  Screen2,
  Screen3
}).mount();

/* 画面1 */
function Screen1() {
  return {
    $template: '#screen1-tmpl',

    goodVote(key) {
      const db = firebase.database();
      const postRef = db.ref('/post');

      postRef.child(key).update({
        goodNum: 1
      });

      const vue = this;
      postRef.once('value', function (snapshot) {
        vue.dataExtract = snapshot.val();
      });
    },

    NotGoodVote(key) {
      const db = firebase.database();
      const postRef = db.ref('/post');

      postRef.child(key).update({
        NotGoodNum: 1
      });

      const vue = this;
      postRef.once('value', function (snapshot) {
        vue.dataExtract = snapshot.val();
      });
    }
  };
}

/* 画面2 */
function Screen2() {
  return {
    $template: '#screen2-tmpl',

    input: '',

    func_save() {
      const currentUser = firebase.auth().currentUser;
      const uid = currentUser.uid;

      const opinion = {
        input: this.input,
        userID: uid,
        goodNum: 0,
        NotGoodNum: 0
      };

      const db = firebase.database();
      const postRef = db.ref('/post');

      postRef.push(opinion);

      const vue = this;
      postRef.once('value', function (snapshot) {
        vue.dataExtract = snapshot.val();
      });

      this.screen = 1;
    }
  };
}

/* 画面3 */
function Screen3() {
  return {
    $template: '#screen3-tmpl',

    remove(key) {
      const currentUser = firebase.auth().currentUser;
      const uid = currentUser.uid;

      const db = firebase.database();
      const postRef = db.ref('/post');

      postRef.child(key).remove();

      const savedUserID = postRef.child(key).userID;
      const vue = this;
      postRef.once('value', function (snapshot) {
        vue.MydataExtract = snapshot.val();
        vue.MydataExtract = savedUserID.filter(function (value) {
          return value === uid;
        });
      });
    }
  };
}
