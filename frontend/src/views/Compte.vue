<template>
     <div>
         <button>Page Admin Users </button>           

            

       <div id="app">
        <div class='group__header__body'>

          

        
        <div v-for="item  in users" :key="item .id">
              <!-- <div v-for="item  in messages | paginate" :key="item .id"> -->
              <!-- <tr v-for="item in items | paginate"> -->
                <div  _ngcontent-cpa-c6="">
                    Compte crée le:{{ new Date(item .createdAt) | dateFormat('DD/MM/YYYY') }} à
                    {{ new Date(item .createdAt) | dateFormat('hh:mm') }} : <br>
                     dernière maj le:{{ new Date(item .updatedAt) | dateFormat('DD/MM/YYYY') }} à
                    {{ new Date(item .updatedAt) | dateFormat('hh:mm') }} : <br>
                    <b>{{ item .username }}</b><br>
                    <b>{{ item .email }}</b><br>
                     <button
                          @click="destroyUser(item .id)">
                            Supprimer  utilisateur n°{{item.id }}                   
                     </button>                 <!-- <u>Nombre de like:</u> {{ message.likes }} -->
                </div>
        
            </div>
        </div>
      </div>
    </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.16/vue.js"></script>
<script>
  import Vue from 'vue'
  import axios from 'axios';
  import VueAxios from 'vue-axios'
  import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

  Vue.use(VueFilterDateFormat);
  Vue.use(VueAxios, axios)
  export default {
    data() {
      return {
        users: [],
      }
    },
    created() {
      axios
        .get('http://localhost:3000/api/users/')
        .then(response => {
          this.users= response.data
          })
        .catch(error => console.log(error()))
    },
     methods: {
     destroyUser: function (id) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        this.axios.post('http://localhost:3000/api/users/' + id + '/del', null, {
            headers: {
              'Authorization': token
            }
          })
              .then(response => this.users = response.data)
                    axios
                  .get('http://localhost:3000/api/users/')
                  .then(response => {
                    this.users = response.data
                    })
                  .catch(error => console.log(error()))
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
    .group__header__body {
        padding: 1rem;
        background-color: rgba(14, 14, 15, 0.205);
        border-radius: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    .like-buttons[_ngcontent-cpa-c6] {
        display: flex;
    }
    .dislikes[_ngcontent-cpa-c6], .likes[_ngcontent-cpa-c6] {
        margin: 0 .3em;
    }
 
</style>