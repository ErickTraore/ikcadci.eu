<template>
  <div class='group'>
   <div class='group__header'> 
  <form
    @submit="postData" 
    method="post"  
  >
      <div class='group__header__body'>
<label>Biographie </label>
    <input
      id="bio"
      v-model="posts.bio"
      type="text"
      name="bio"
      placeholder="Biographie"
    > <br> <br>
      <button type="submit">Post</button>
  </div>
  </form>
  </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

  export default{
     name: 'ConexionComponent',
        data() {
                return {
                    posts: {
                      username: '',
                      email: '',
                      bio: '',
                        }
                }
              },
        methods:{
              postData(e){
                    let objMySession = localStorage.getItem("obj")
                    let myStorageToken = JSON.parse(objMySession)
                    console.log("profile");
                    let token = myStorageToken.myToken;
                    console.log('N° du Token =', token);
                  // console.warn(this.posts);
                this.axios.put('http://localhost:3000/api/users/me/',this.posts,{
                  headers: {
                   'Authorization': token}  
                   
                })
                  .then(reponse => {
                    this.user = reponse.data

                    })
                    this.$router.push({path: '/'})

                  .catch(error => console.log(error()))

                e.preventDefault();
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
.group__header{
  font-size:1.2rem;
  align-items: center;
  background-color:rgba(10, 10, 10, 0.288);
  padding:1rem;
  border-radius:2rem;
  color:white;
  }
  .group__header__body{
        padding: 1rem;
        background-color:rgba(14, 14, 15, 0.205);
        border-radius:2rem;
        margin-top:1rem;
        margin-bottom:1rem;
        }
</style>