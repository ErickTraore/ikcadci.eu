<template>
    <div class='group'>
        <div class='group__header'>
          <div>CONNEXION</div>
            <form @submit="postData" method="post">
                <div class='group__header__body '>
                    <p v-if="errors.length">
                        <b>Merci de corriger les erreurs suivantes : </b>
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                    </p>
                    <p>
                        <label for="email">Email* </label>
                        <input
                              id="email"
                              v-model="user.email"
                              type="email"
                              name="email"
                        ><br> <br>
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
                    <button class=" group__header__body__btn">Connexion</button>
                </div>
            </form>
          <div>Vous n'avez pas de compte:</div>
        <div>
          <a class="labelForm" href="/Singnup#/signup">Créer un compte</a>

          </div>
        </div>
    </div>
</template>

<script>
  import Vue from "vue";
  
  import VueAxios from "vue-axios";
  import axios from "axios";

  Vue.use(VueAxios, axios)
  export default {
    name: 'ConexionComponent',
    data() {
      return {
        errors: [],
        user: {
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
         this.axios.post('http://localhost:3000/api/users/login/',user)
          .then(reponse => {
            this.user = reponse.data
                    // stokage token dans localStorage
                    let objMySession = {
                      myId: this.user.$userId,
                      myToken: this.user.$token
                      }
                    let sessionStore = JSON.stringify(objMySession);
                    localStorage.setItem("obj",sessionStore);
                    this.$store.dispatch("nowLogged");
                    this.$router.push({path: '/'});
                    window.location.reload();

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
<style lang="scss">
    @import 'sass/main.scss';
   
 
</style>