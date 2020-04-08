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

                    <v-flex md8 sm12 xs12  class="mx-1 px-0">
                      <v-text-field name="name" label="Número de identificación" autocomplete="off"                         
                       hint="Número  es un dato obligatório" value="" v-model="documentNumber"
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md3 sm12 xs12  class="mx-1 px-0">
                      <v-btn fab small class="grey iconButtons" @click.native="searchNeeded()">
                        <v-icon>search</v-icon>
                      </v-btn>
                    </v-flex>

                    <v-flex md6 sm12 xs12  class="mx-1 px-0">
                      <v-textarea
                       outlined
                       label="Descripción adicional" autocomplete="off"                         
                       hint="La descripción no es un dato obligatório"
                       value="" v-model="deliver.description"
                       class="input-group--focused" required></v-textarea>
                    </v-flex>
                    
                    <v-flex md10 sm12 xs12  class="mx-1 px-0">
                       <p>Fotos de entrega</p>
                    </v-flex>

                    <v-flex md10 sm12 xs12  class="mx-1 px-0"  >
                      <vue-dropzone ref="myVueDropzone"
                       id="dropzone"
                      :options="dropzoneOptions"
                      @vdropzone-file-added="vfileAdded"
                      @vdropzone-success="vsuccess"
                      @vdropzone-queue-complete="vqueueCompleted" 
                      ></vue-dropzone>
                    </v-flex>

                    <v-flex md10 sm12 xs12  class="mx-1 px-0" v-if="deliver.need" >
                    
                    <v-switch                       
                        v-model="solutionLevel" :value="'SOLVED'" :label="'Necesidad Completamente solucionada'"></v-switch>
                    <v-switch 
                        v-model="solutionLevel" :value="'PARTIAL_SOLVED'" :label="'Necesidad Parcialmente solucionada'"></v-switch>

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

  import {
    NEED_QUERY_BY_DOCUMENT,
    DONATION_QUERY_BY_NEED,
    CREATE_DELIVER_MUTATION,
    UPDATE_DELIVER_MUTATION,
    UPDATE_NEED_MUTATION

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
        deliver:{  description:"", need:null, donation:null, pictures:[] },
        imagePath:process.env.VUE_APP_SERVER_HOST,        
        dropzoneOptions: {
            url: FileUrl,
            headers: { "Authorization": "Bearer "+token },
            thumbnailWidth: 150,
            maxFilesize: 3,
            addRemoveLinks: true,
            autoProcessQueue: false
        },    
        solutionLevel:null,
        need:{},
        documentNumber:""

      }
    },
    computed: {
          

    },
    apollo:{
      
      
    },
    methods: {

      async save() {  

        //eslint-disable-next-line
        console.log(this.deliver)
       
        if(this.deliver.need === null || this.deliver.donation === null)
        {
          return this.$swal(
              '',
              'No se encuentra la información necesaria para continuar',
              'error'
          )
        }

        if(this.solutionLevel === null)
        {
          return this.$swal(
              '',
              'Porfavor ponga un nivel de solución para finalizar la entrega',
              'error'
          )
        }

        if(this.$refs.myVueDropzone.getAcceptedFiles().length == 0)
        {
          return this.$swal(
              '',
              'Debe subir al menos una imagen de evidencia',
              'error'
          )
        }

        this.$refs.myVueDropzone.processQueue()

        
        /*if (this.deliver.id) {     
          this.updateMethod()              
        } else this.saveMethod()*/

      },
      saveMethod(){

        this.$apollo
            .mutate({
                mutation: CREATE_DELIVER_MUTATION,
                variables: {
                  input: this.deliver                 
                }
            })
        .then(response => {
          //eslint-disable-next-line
          console.log("save",response)
          this.$swal({icon:'success',title: '!Datos registrados!'})
          this.updateNeedMethod()
          this.deliver.id = response.data.createDeliver
          //this.deliver = { documentNumber:"", description:"", need:null, donation:null, pictures:[] }
          //this.need = {}
            this.deliver.pictures = []
        })        

      },
      updateMethod(){

        this.$apollo
            .mutate({
                mutation: UPDATE_DELIVER_MUTATION,
                variables: {
                  input: this.deliver                 
                }
            })
        .then(response => {
          //eslint-disable-next-line
          console.log("update",response)
          this.$swal({icon:'success',title: '!Datos registrados!'})
          this.updateNeedMethod()
          //this.deliver = { documentNumber:"", description:"", need:null, donation:null, pictures:[] }
          //this.need = {}
           this.deliver.pictures = []
        })
         

      },
      updateNeedMethod(){

        this.need.state = this.solutionLevel

        delete this.need.__typename

        this.$apollo
            .mutate({
                mutation: UPDATE_NEED_MUTATION,
                variables: {
                  input: this.need                
                }
            })
        .then(response => {
          //eslint-disable-next-line
          console.log("need",response)
          this.$swal({icon:'success',title: '!Necesidad actualizada!'})
        })
      },
      cancel() {
        this.$router.push({ name: 'Delivers' })
      },
      vfileAdded(file) {
      

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
      },
      vsuccess(file, response) {
        /* eslint-disable-next-line */
        console.log(file,response)

        this.deliver.pictures.push(response[0].filename)

        // eslint-disable-next-line
        console.log("deliver",this.deliver)

       
      },
      vqueueCompleted(){
        //eslint-disable-next-line
              console.log("All files have uploaded ",this.deliver)
              
              //this.deliver.pictures = JSON.stringify(this.deliver.pictures)

              if (this.deliver.id) {     
                  this.updateMethod()              
              } else this.saveMethod()
              
                            
                
      },
      searchNeeded(){
          if(this.documentNumber === "")
          {
            this.$swal(
              '',
              'Pon un número de documento para continuar',
              'error'
            )
          }else{
            this.$apollo
            .mutate({
                mutation: NEED_QUERY_BY_DOCUMENT,
                variables: {
                  input: this.documentNumber                 
                }
            })
            .then(response => {
              //eslint-disable-next-line
              console.log("created",response)
              
              alert("Adjunta evidencia para confirmar la entrega")

              this.need = response.data.getByDocumentNumber

              this.deliver.need = response.data.getByDocumentNumber.id
              this.deliver.donationPlace = response.data.getByDocumentNumber.donationPlace

              this.$apollo
                .mutate({
                    mutation: DONATION_QUERY_BY_NEED,
                    variables: {
                      input: this.deliver.need                 
                    }
                })
                .then(response => {
                  //eslint-disable-next-line
                  console.log("response",response)
                  this.deliver.donation = response.data.getDonationByNeed.id
                })
                .catch(error => {
                  //eslint-disable-next-line    
                  console.error("created",error)
                  this.deliver.donation = null
                })

            })
            .catch(error =>{
              //eslint-disable-next-line
              console.error("query",error)
              this.$swal(
              '',
              'Aun no hay una donación asociada a este número de documento',
              'error'
              )

              this.deliver.need = null
              this.deliver.donationPlace = null

            })
            
          }
      }
    },
    created() {      

    },
    mounted() {

     if (this.$route.params.id) {
        this.title = 'Editar Entrega'
        
      } else this.title = 'Nueva entrega'     

    },
    watch: {    
    
    }
  }
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>
