<template>
    <div class='group'>
        <div class='group__header'>
            <div id="app">
                <div class='group__header__body'>
                    <h2>Mon profil</h2>
                    <div>Pseudo: {{ profile.username }}</div>
                    <div>Email: {{ profile.email }}</div>
                    <div>Biographie: {{ profile.bio }}</div>
                </div>
            </div>
            <form @submit="postData" method="post">
                <div class='group__header__body'>
                    <label>Mettre à jour ma biographie</label> <br> <br>
                    <textarea
                            id="bio"
                            name="bio"
                            placeholder="Biographie"
                            type="text"
                            v-model="posts.bio"
                    ></textarea> <br> <br>
                    <button type="submit">Soumettre</button>
                    <button @click="delProfil()">Supprimer</button>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
  import axios from 'axios';
// import { mapState } from 'vuex';

  export default {
    data() {
      return {
        profile: '',
        posts: {
          username: '',
          email: '',
          bio: '',
        }
      }
    },
    created() {
      let objMySession = localStorage.getItem("obj")
      let myStorageToken = JSON.parse(objMySession)
      let token = myStorageToken.myToken;
      axios
        .get('http://localhost:3000/api/users/me/', {
          headers: {
            'Authorization': token
          }
        })
        .then(response => {
          this.profile = response.data
          this.testUser = this.profile.testUser
          console.log(this.testUser) // this.$store.dispatch("beforeLogged")
      if(this.testUser == 'testOk'){
       this.$store.dispatch("beforeLogged")
      }
        })
        .catch(error => console.log(error()))
    },
    methods: {
      postData(e) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;

        this.axios.put('http://localhost:3000/api/users/me/', this.posts, {
          headers: {
            'Authorization': token
          }
        })
          .then(response => {
            this.profile.bio = response.data.bio
          })
          .catch(error => console.log(error()))

        e.preventDefault();
      }, 
      delProfil() {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;

        this.axios.post('http://localhost:3000/api/users/delProfil', null, {
          headers: {
            'Authorization': token
          }
        })
          .then(response => {
            this.profile = response.data
          })
          .catch(error => console.log(error()))

      }
    }
  }

</script>
<style scoped>
    .group {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    * {
        box-sizing: border-box;
    }

    .group__header {
        font-size: 1.2rem;
        align-items: center;
        padding: 1rem;
        border-radius: 2rem;
          background-color: rgb(35, 49, 82);



    }

    .group__header__body {
        padding: 1rem;
        background-color: rgba(196, 192, 192, 0.849);

        border-radius: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>