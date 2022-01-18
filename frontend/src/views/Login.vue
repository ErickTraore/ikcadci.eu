<template>
  <div class="connection">
    <ConexionComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import ConexionComponent from '@/components/ConexionComponent.vue'

export default {
  name: 'Login',
  components: {
    ConexionComponent
  }
}
</script>