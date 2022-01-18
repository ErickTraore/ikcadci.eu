<template>
<div>Enregistrez une formation
                  <form @submit="onPostData" method="post" enctype="multipart/form-data" name="formation">
                    <label class="labelForm">Nouveau message avec image optionnelle</label> <br> <br>
                    <p v-if="errors.length">
                        <b>Merci de corriger les erreurs suivantes : </b>
                      <ul>
                          <li v-for="error in errors" :key="error">{{ error }}</li>
                      </ul>
                   </p>
  <input
                            id="titleFirst"
                            v-model="formation.titleFirst"
                            type="text"
                            name="titleFirst"
                            placeholder="Titre principal"
  ><br> <br>
   <input
                            id="titleSecond"
                            v-model="formation.titleSecond"
                            type="text"
                            name="titleSecond"
                            placeholder="Titre secondaire"
  ><br> <br>
    <input
                            id="niveau"
                            v-model="formation.niveau"
                            type="text"
                            name="niveau"
                            placeholder="Niveau du diplome"
  ><br> <br>
    <input
                            id="duration"
                            v-model="formation.duration"
                            type="text"
                            name="duration"
                            placeholder="Durée de la formation"
  ><br> <br>
                            <label class="isActive">Formation en cours? </label>

     <input
                            id="isActive"
                            v-model="formation.isActive"
                            type="checkbox"
                            name="isActive"
                            checked
><br> <br>
  <input
                            id="attachment"
                            v-model="formation.attachment"
                            type="hidden"
                            name="attachment"
                             placeholder="attachment"
                            > 
                            <br> 
                            <div>
                            <div v-if="!image">
                            <h2>Choisir une image</h2>
                            <div id="list">
                            </div>
                            <input 
                            id="file" 
                            type="file" 
                            @change="onFileSelected"
                            name="attachment"
                            alt="example"
                            >
                            </div>
                          <div v-else>
                            <div v-if="loadingImage" class="progress">
                            <div class="value v-80 striped animate s-10">Chargement...</div>
                            </div>
                            <div v-else>
                            <img :src="image" />
                            </div>
                            <button @click="removeImage">Remove image</button>
                          </div>
                         
                        </div><br><br>
                        <div>
                        </div>
   <button 
                      type="submit"
                      value="val"
                    >
                      Envoyer
  </button><br><br>
  </form>
</div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios';
  import VueAxios from 'vue-axios'
  import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

  Vue.use(VueFilterDateFormat);
  Vue.use(VueAxios, axios);
export default {
  name: "Formation",
  created() {},
  data() {
    return {
      loadingTemplate: true,
      loadingImage: true,
      errors: [],
      loading: false,
      idImage: '',
      testName: Boolean,
      file: Blob,
      formation: {
        attachment: '',
        titleFirst:'',
        titleSecond:'',
        niveau: '',
        duration: '',
        isActive: true,
        },
      selectedFile: null,
      formations: [],
      image:'',
      posts: {
        attachment: '',
        titleFirst: '',
        titleSecond:'',
        niveau: '',
        duration: '',
        isActive: '',
        }
    };
  },
  props: {},
  methods: {  
    onPostData(e) {
      e.preventDefault();
      console.log('Je suis un Yankee-1');
        this.errors = [];
                if (!this.formation.titleFirst) {
          this.errors.push('Veillez saisir le titre principal');
          }
         else if (this.formation.titleFirst.length >= 30 || this.formation.titleFirst.length <= 3){
          this.errors.push('Votre titre principal doit comprendre entre 4 et 30 caractères.');
        }
        if (!this.formation.titleSecond) {
          this.errors.push('Veillez saisir le titre secondaire');
          }
         else if (this.formation.titleSecond.length >= 50 || this.formation.titleSecond.length <= 3){
          this.errors.push('Votre second titre doit comprendre entre 4 et 50 caractères.');
        }
        if (!this.formation.niveau) {
          this.errors.push('Veillez saisir le niveau de la formation');
        } else if (this.formation.niveau.length <= 1){
          this.errors.push('Le niveau doit contenir plus d 1 caracteres.');
        }
         if (!this.formation.duration) {
          this.errors.push('Veillez saisir la durée de la formation');
        } else if (this.formation.duration.length <= 1){
          this.errors.push('Votre durée de formation doit contenir plus d 1 caractere.');
        }
        if (!this.errors.length) {
          console.log('Vérification des inputs --> OK')
          return this.post(this.formation);
        }
      console.log(this.errors);
      console.log('Je suis un Yankee-2');
      },
    post: function (formation) {
        console.log('Je suis un Yankee-3');
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        console.log('votre token',token );

        this.axios.post('http://localhost:3000/api/formations/new/', formation, {
            headers: {
              'Authorization': token
            }
          }
        )
         .then(function(Formation) {
            if (Formation) {

                this.resetForm()
            }
               Formation.status(200).json(Formation);


            // this.formation = response.data
            // console.log('formation crée en bdd ok')
            // axios
            //   .get('http://localhost:3000/api/formations/')
            //   .then(response => {
            //     this.formations = response.data
            //     this.resetForm()
            //     this.image = '';
            //     response.status(200).json(this.formations);
            //     })
            //   .catch(function(err) {
            //     err.statusCode = 401;
            //   });
          })
          .catch(function(err) {
                err.statusCode = 401;
              });
      },
 onFileSelected(e) {
      this.selectedFile = e.target.files[0];
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file) {
      // var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
      if(this.image)
        return; 
        this.pushImage();
    },
    pushImage() {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        var fileName = fileName;
        var formData = new FormData();
        var imagefile = document.querySelector('#file');
        console.log('Mon imageFile[0] :',imagefile.files[0]);
        formData.append("file", imagefile.files[0]);
        setTimeout(() => {
        axios
        .post('http://localhost:3000/api/formations/upload', formData, {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data' 
          }
      })   
     .then((response) => {
       console.log('valeure reçu par le back:',response.data);
       console.log('valeure res.data.idImage:',response.data.idImage);

          return response.data.idImage;
     })
     .then(function(idImage){


       const attachment = document.querySelector("#attachment");
          attachment.value = "http://localhost:3000/formations/images/"+idImage;

          attachment.dispatchEvent(new Event('input'));

          status(200).json({idImage})
     })
    .catch(function(err) {
     err.statusCode = 401;
                    })
    .finally(() => 
          this.loadingImage = false
        )
          }, 1000)
  },
    removeImage: function(e) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        var fileName = this.selectedFile.name;
        
        console.log('Envoie dufichier pour écrasement',fileName);
        var formData = new FormData();
        formData.append("file", this.selectedFile);
      
        axios.post('http://localhost:3000/api/formations/delLienImage', formData, {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data' 
          }
      })   

      this.image = '';
      console.log('Le fichier vient d\'être effacé du navigateur');
      this.formation.attachment = '';
      console.log('L\'url du fichier vient d\'être effacé du formulaire');
      e.preventDefault();
    },
    // doDelete: function (id) {
    //     let objMySession = localStorage.getItem("obj")
    //     let myStorageToken = JSON.parse(objMySession)
    //     let token = myStorageToken.myToken;
    //     this.axios.post('http://localhost:3000/api/formations/' + id + '/del', null, {
    //         headers: {
    //           'Authorization': token
    //         }
    //       })
    //     .then((response) => {
    //         this.axios
    //           .get('http://localhost:3000/api/formations/')
    //           .then(response => {
    //             console.log('Deleting formation')
    //             this.formations = response.data
    //             this.resetForm()
    //             response.status(200).json(this.formations);
    //             })
    //            .catch(function(err) {
    //             err.statusCode = 401;
    //             });
    //       })
    //     .catch(function(err) {
    //           err.statusCode = 401;
    //           });
    //   }
  }
  }
</script>

<style lang="scss" scoped></style>