<template>
  <div class="notFound">
      <div><h1>Page 404</h1></div>
      <div><h2>Page non trouvée</h2></div>

       <div> Continuer votre visite  
            <button @click="continuerClick" >  Retour page d'accueille  </button> </div>
      <div>Merci de votre visite
            <button @click="logoutClick"> Se Déconnecter </button> </div> <br> 

  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'notFound'
 
}
</script>


<style>
</style>