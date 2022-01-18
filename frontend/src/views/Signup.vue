<template>
  <div class="Signup">
    <SignupComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import SignupComponent from '@/components/SignupComponent.vue'

export default {
  name: 'Signup',
  components: {
    SignupComponent
  }
}
</script>