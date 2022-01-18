<template>
  <div class="Logout">
      <div>Merci de votre visite
            <button @click="logoutClick"> Se Déconnecter </button> </div> <br> 
       <div> Continuer votre visite  
            <button @click="continuerClick" >  Retour page d'accueille  </button> </div>
         <!-- <a href="/Singnup#/signup">page d'acceuil/a> -->


  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default {
   methods: {
      logoutClick () {
        this.$store.dispatch('beforeLogged')
         window.localStorage.clear()
         window.location.reload();

        //  <a href = "/login"> page d'acceuil </a> 

        },
      continuerClick: function () {
    // 
          this.$router.push('/') 

        }
        
}
}

</script>