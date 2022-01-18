<template>
    <div class='group__header'>
     <div>INSCRIPTION</div>
        <form @submit="postData" method="post">
            <div class='group__header__body'>
                <p v-if="errors.length">
                    <b>Merci de corriger les erreurs suivantes : </b>
                <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
                </p>

                <p>
                    <label for="username">Pseudo* </label>
                    <input
                            id="username"
                            v-model="user.username"
                            type="text"
                            name="username"
                    >
                </p>
                <p>
                    <label for="email">Email* </label>
                    <input
                            id="email"
                            v-model="user.email"
                            type="email"
                            name="email"
                    >
                </p>
                <p>
                    <label for="password">Mot de passe* </label>
                    <input
                            id="password"
                            v-model="user.password"
                            type="password"
                            name="password"
                    >
                </p>
                <p>
                    <label for="bio">Biographie </label>
                    <input
                            id="bio"
                            v-model="user.bio"
                            type="text"
                            name="bio"
                    >
                </p>
                <button class="btn"> S'inscrire</button>
            </div>
        </form>
         <div>Vous avez déja un compte:</div>
     <div>
       <a href="/signin#/login">Connectez-vous içi</a>

       </div>
    </div>
</template>

<script>
  import Vue from "vue";
  
  import VueAxios from "vue-axios";
  import axios from "axios";

  Vue.use(VueAxios, axios)
  export default {
    name: 'SignupComponent',
    data() {
      return {
        errors: [],
        user: {
          username: null,
          bio: null,
          email: null,
          password: null,
        }
      }
    },
    methods: {
      postData: function (e) {

        e.preventDefault();

        this.errors = [];

        if (!this.user.password) {
          this.errors.push('Veillez saisir un mot de passe');
        } else if (!this.validPassword(this.user.password)) {
          this.errors.push('Votre mot de passe doit contenir entre 4 et 8 caractères et au moins un chiffre');
        }

        if (!this.user.username || this.user.username.length >= 13 || this.user.username.length <= 3) {
          this.errors.push('Votre pseudo doit contenir entre 4 et 12 caractères');
        }
        if (!this.user.email) {
          this.errors.push('Veillez saisir votre email');
        } else if (!this.validEmail(this.user.email)) {
          this.errors.push('L\'adresse email est invalide.');
        }

        if (!this.errors.length) {
          return this.post(this.user);
        }

      },

      post: function (user) {
        this.axios.post('http://localhost:3000/api/users/register/', user)
          .then(response => {
            this.data = response.data
             this.$router.push({path: '/login'})
          })
          .catch(error => console.log(error()))
      },

      validEmail: function (email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);

      },
      validPassword: function (password) {
        const regex = /^(?=.*\d).{4,8}$/;
        return regex.test(password);
      }
    }
  }


</script>
<style scoped>
    * {
        box-sizing: border-box;
    }
    .group__header {
        font-size: 1.2rem;
        align-items: center;
        background-color: rgba(10, 10, 10, 0.288);
        padding: 1rem;
        border-radius: 2rem;
        color: white;
    }
    .group__header__body {
        padding: 1rem;
        background-color: rgba(14, 14, 15, 0.205);
        border-radius: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>