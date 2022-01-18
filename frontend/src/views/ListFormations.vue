<template>
    <div class="cardFirst">
        <div class="card" v-for="item  in formations" :key="item .id">
               <div class="card__img" >    <img :src="item.attachment" />
               </div>
               <div class="card__body">    
                    <div class="card__body__title1">{{item.titleFirst}}</div> 
                    <div class="card__body__title2">{{item.titleSecond}}</div> 
                    <div class="card__body__box">
                      <div class="card__body__box__niveau">
                          <p>Diplome: {{item.niveau}}</p>
                      </div> 
                      <div class="card__body__box__duration">
                      <p> <i class="fa fa-clock-o "></i>
                            {{item.duration}} 
                            </p>
                      </div>
                   </div>
               </div>  
        </div>
        <path d="M11.5 11H10V7.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v2H6.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM16 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 13.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v9z"/>
    </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios';
  import VueAxios from 'vue-axios'

  Vue.use(VueAxios, axios);

  export default {
  name: "Test",
  
  data() {
    return {
        file: Blob,
        formations: [],
        formation: {
        attachment: '',
        titleFirst:'',
        titleSecond:'',
        niveau: '',
        duration: '',
        isActive: true,
        },
        idImage: '',
        image:'',

    };
  },
  created() {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let myId = myStorageToken.myId;
        setTimeout(() => {
        axios
        .get('http://localhost:3000/api/formations/')
        .then(response => {
          this.myId = myId
          this.formations = response.data
          })
        .catch(error => console.log(error()))
        .finally(() => 
          this.loadingTemplate = false
        )
    }, 1000)
    },
  props: {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>