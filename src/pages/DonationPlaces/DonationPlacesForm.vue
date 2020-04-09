<template>
  <v-container fluid>

 

    <v-flex xs12>
      <v-card class="elevation-0">
        <v-card-title class="title">
          <span style="margin-left:15pt" >{{title}}</span>
          <v-spacer></v-spacer>
          <v-btn fab small class="grey iconButtons" @click.native="cancel()">
            <v-icon>cancel</v-icon>
          </v-btn>
          &nbsp;
          <v-btn fab small class="red iconButtons" @click.native="save()">
            <v-icon>save</v-icon>
          </v-btn>
        </v-card-title>

         <Loading></Loading>

        <v-card-text>
          <v-container fluid grid-list-sm>
            <v-layout row wrap>            
              <v-flex md12 sm12>
                <v-container fluid grid-list-sm>
                  <v-layout row wrap>

                    <v-flex md10 sm12 xs12  class="mx-1 px-0">
                      <v-text-field name="name" label="Nombre" autocomplete="off"                         
                       hint="Nombre  es un dato obligatório" value="" v-model="donationPlace.name"
                       class="input-group--focused" required></v-text-field>
                    </v-flex>                  

                    <v-flex md4 sm12 xs12  class="mx-1 px-0">
                     <v-autocomplete
                        name="city"  utocomplete="off" label="Ciudad" value=""
                        v-model="donationPlace.city"
                        item-text="name"
                        item-value="id"
                        :items="cities"
                        required 
                      ></v-autocomplete>
                    </v-flex>   

                    <v-flex md6 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="address"
                       label="Dirección"
                       autocomplete="off"                         
                       hint="La dirección es un dato obligatório"
                       v-model="donationPlace.address" 
                       value="" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md6 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="contact"
                       label="Representante"
                       autocomplete="off"                         
                       hint="Representate es un dato obligatório"
                       v-model="donationPlace.contact" 
                       value="" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md4 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="phone"
                       label="Teléfono de contacto"
                       autocomplete="off"                         
                       hint="Teléfono es un dato obligatório"
                       v-model="donationPlace.phone" 
                       value="" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>                                    

                    <v-flex md10 sm12 xs12  class="mx-1 px-0" v-if="!donationPlace.picture" >
                      <vue-dropzone ref="myVueDropzone"
                       id="dropzone"
                      :options="dropzoneOptions"
                      @vdropzone-file-added="vfileAdded"
                      @vdropzone-success="vsuccess" 
                      ></vue-dropzone>
                    </v-flex>

                    <v-flex md6 sm12 xs12  class="mx-1 px-0" v-if="donationPlace.picture">
                        <vue-dropzone ref="myVueDropzone"
                          id="dropzone"
                          :options="dropzoneOptions"
                          @vdropzone-file-added="vfileAdded"
                          @vdropzone-success="vsuccess" 
                          ></vue-dropzone>
                          
                    </v-flex>

                    <v-flex md4 sm12 xs12  class="mx-1 px-0" v-if="donationPlace.picture">
                        <v-img :src="imagePath+donationPlace.picture" aspect-ratio="1.7"></v-img>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

      </v-card>
    </v-flex>

  </v-container>
</template>
<script>


  import Loading from "@/components/Loading.vue";

  import vue2Dropzone from 'vue2-dropzone'

  //import { mapState } from 'vuex'

  import { DONATIONPLACE_QUERY,
   ALL_CITIES_QUERY,
   CREATE_DONATIONPLACE_MUTATION,
   UPDATE_DONATIONPLACE_MUTATION 
  } from '@/graphql'

  export default {
    components:{
      Loading,
      vueDropzone: vue2Dropzone
    },
    data() {

      const FileUrl = process.env.VUE_APP_SERVER_HOST + "uploadImage"
      //const FileUrl = "https://httpbin.org/post";

      ///* global Store */

      //const {token} = Store.state.user

      const token = ""

      /* eslint-disable-next-line */
      console.log("FileUrl",FileUrl);

      return {

        title: '',
        selectedCountry: '',
        filteredCities: [],
        statusValidation: [],      
        rules: {       
        },
        donationPlace:{
          name:"",city:"",contact:"",phone:"",address:""
        },
        cities:[],
        imagePath:process.env.VUE_APP_SERVER_HOST,        
        dropzoneOptions: {
            url: FileUrl,
            headers: { "Authorization": "Bearer "+token },
            thumbnailWidth: 150,
            maxFilesize: 3,
            maxFiles: 1,
            addRemoveLinks: true,
            autoProcessQueue: false           
        }

      }
    },
    computed: {
          

    },
    apollo:{
      donationPlace:{
        query:DONATIONPLACE_QUERY,
        variables() {
          return {
            input: this.$route.params.id
          }
        },
        skip() {
          return this.skipQuery
        }
      },
      cities:{
        query:ALL_CITIES_QUERY,
        skip() {
          return this.skipQuery
        }
      }
      
    },
    methods: {

      save() {  
       
        //eslint-disable-next-line
        console.log("donationPlace",this.donationPlace)

        if( this.donationPlace.name === "" ||  this.donationPlace.city === "" ||  this.donationPlace.contact === ""
        ||  this.donationPlace.phone === "" ||  this.donationPlace.address === "" )
        {
          return this.$swal(
                  '',
                  'Debe llenar los datos obligatorios para continuar',
                  'error'
                )
        }
        else{

            delete this.donationPlace["__typename"]

            //eslint-disable-next-line
            console.log("accepted files",this.$refs.myVueDropzone.getAcceptedFiles())

            if(this.$refs.myVueDropzone.getAcceptedFiles().length > 0)
            {
                /* eslint-disable-next-line */
                //console.log(this.$refs.myVueDropzone.processQueue());
                this.$refs.myVueDropzone.processQueue()
            }
            else{

              this.donationPlace.picture = ""
          
              if(this.donationPlace.id)
              {
                this.updateMethod()
              }
              else{
                this.saveMethod()
              }

            }
            

        }

      },
      saveMethod(){

        delete this.donationPlace["id"]

         this.$apollo
          .mutate({
              mutation: CREATE_DONATIONPLACE_MUTATION,
              variables: {
                input: this.donationPlace                 
              }
          })
          .then(response => {
            //eslint-disable-next-line
            console.log("updated",response)

            this.donationPlace = response.data.createDonationPlace

            this.$swal({icon:'success',title: '!Datos registrados!'})
          })
          .catch(error =>{
            //eslint-disable-next-line
            console.error("created",error)
            this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
          })

      },
      updateMethod(){

         this.$apollo
          .mutate({
              mutation: UPDATE_DONATIONPLACE_MUTATION,
              variables: {
                input: this.donationPlace                 
              }
          })
          .then(response => {
            //eslint-disable-next-line
            console.log("updated",response)

            this.$swal({icon:'success',title: '!Datos registrados!'})
          })
          .catch(error =>{
            //eslint-disable-next-line
            console.error("created",error)
            this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
          })

      },
      cancel() {
        this.$router.push({ name: 'DonationPlaces' })
      },
      vfileAdded(file) {
      

        if(this.$refs.myVueDropzone.getAcceptedFiles().length > 0)
        {
          this.$swal(
              '',
              'No se puede subir mas de una imagen',
              'error'
          )

          this.$refs.myVueDropzone.removeFile(file);

        }
        else{
            /* eslint-disable-next-line */
            console.log(file.type,file.type.indexOf("image"));
            if( file.type.indexOf("image") === -1 )
            {
                this.$swal(
                  '',
                  'Solo pueden subirse imágenes',
                  'error'
                )

                this.$refs.myVueDropzone.removeFile(file);
            }
            
        }

      },
      vsuccess(file, response) {
        /* eslint-disable-next-line */
        console.log(file,response)
        if(response)
        {
          this.donationPlace.picture = response[0].filename
          
          if(this.donationPlace.id)
          {
            this.updateMethod()
          }
          else{
            this.saveMethod()
          }

        }
        
      }
    },
    created() {

      this.statusValidation = [];      
       

    },
    mounted() {

      this.$apollo.queries.cities.skip = false
      this.$apollo.queries.cities.refetch()

      if (this.$route.params.id) {
        this.title = 'Editar Lugar de donación'
        
        this.$apollo.queries.donationPlace.skip = false
        this.$apollo.queries.donationPlace.refetch()

      } else this.title = 'Nuevo lugar de donación'     

    },
    watch: {
      
      donationPlace(val){
          console.log(val);         
      }
    }
  }
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>
