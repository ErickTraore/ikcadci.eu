<template>
  <div class="pageNotFound">
    <NotFoundComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import NotFoundComponent from '@/components/NotFoundComponent.vue'

export default {
  name: 'PageNotFound',
  components: {
    NotFoundComponent
  }
}
</script>
<script>
import Vue from 'vue'
import Vuex from 'vuex'
import NotFoundComponent from '@/components/NotFoundComponent.vue'

Vue.use(Vuex)
export default {
      name: 'PageNotFound',
  components: {
    NotFoundComponent
  },
   methods: {
      logoutClick () {
        this.$store.dispatch('beforeLogged')
         window.localStorage.clear()
        //  <a href = "/login"> page d'acceuil </a> 

        },
      continuerClick: function () {
    // 
          this.$router.push('/') 

        }
}
}

</script>