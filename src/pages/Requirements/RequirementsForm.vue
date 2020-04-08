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

                     <v-flex md6 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="contact"
                       label="Contacto"
                       autocomplete="off"                         
                       hint="Representate es un dato obligatório"
                       v-model="need.contact" 
                       value="" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md4 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="phone"
                       label="Teléfono de contacto"
                       autocomplete="off"                         
                       hint="Teléfono es un dato obligatório"
                       v-model="need.phone" 
                       value="" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md6 sm12  xs12 class="mx-1 px-0">
                      <v-autocomplete
                        name="documentType"  utocomplete="off" label="Tipo de documento" value=""
                        v-model="need.documentType"
                        item-text="name"
                        item-value="value"
                        :items="documentTypes"
                        required 
                      ></v-autocomplete>                    
                    </v-flex> 
                  
                    <v-flex md6 sm12  xs12 class="mx-1 px-0">
                      <v-text-field name="number" type="documentNumber"  utocomplete="off" label="Número de documento" value=""
                       v-model="need.documentNumber"  v-bind:rules="rules.email"
                        class="input-group--focused" required></v-text-field>
                    </v-flex>  

                    <v-flex md4 sm12 xs12  class="mx-1 px-0">
                     <v-autocomplete
                        name="city"  utocomplete="off" label="Ciudad" value=""
                        v-model="need.city"
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
                       v-model="need.address" 
                       value="" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md4 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="peopleNeeded"
                       label="Número de personas del núcleo familiar"
                       autocomplete="off"                         
                       hint="Número de adultos es un dato obligatório"
                       v-model="need.peopleNeeded" 
                       value="" 
                       type="number"
                       class="input-group--focused" required></v-text-field>
                    </v-flex>

                    <v-flex md4 sm12 xs12  class="mx-1 px-0">
                      <v-text-field 
                       name="childrenNeeded"
                       label="Número de niños"
                       autocomplete="off"                         
                       hint="Número de niños es un dato obligatório"
                       v-model="need.childrenNeeded" 
                       value="" 
                       type="number"
                       class="input-group--focused" required></v-text-field>
                    </v-flex>               

                    

                    <v-flex md6 sm12 xs12  class="mx-1 px-0">
                     <v-textarea
                     outlined
                       label="Descripción" autocomplete="off"                         
                       hint="La descripción es un dato obligatório"
                       value="" v-model="need.description"
                       class="input-group--focused" required></v-textarea>
                    </v-flex>

                    <v-flex md6 sm12 xs12  class="mx-1 px-0" v-if="userRole === 'IS_ADMIN'" >
                     <v-autocomplete
                        name="donationPlace"  utocomplete="off" label="Lugar de donación" value=""
                        v-model="need.donationPlace"
                        item-text="name"
                        item-value="id"
                        :items="donationPlaces"
                        required 
                      ></v-autocomplete>
                    </v-flex>                        

                   

                    <v-flex md4 sm12 xs12  class="mx-1 px-0" v-if="need.picture">
                        <v-img :src="need.picture" aspect-ratio="1.7"></v-img>
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

  
  //import { mapState } from 'vuex'

  import { 
   ALL_CITIES_QUERY,
   NEED_QUERY,
   ALL_DONATIONPLACES_QUERY,
   CREATE_NEED_MUTATION,
   UPDATE_NEED_MUTATION
  } from '@/graphql'


  export default {
    components:{
      Loading,     
    },
    data() {

      
      return {

        title: '',
        selectedCountry: '',
        cities: [],
        statusValidation: [],      
        rules: {       
        },
        need:{},
        userRole: localStorage.getItem("role"),        
        donationPlaces:[],
        documentTypes:[],
        skipQuery:true

      }
    },
    computed: {
          

    },
    apollo:{      
      cities:{
        query:ALL_CITIES_QUERY,
        skip() {
          return this.skipQuery
        }
      },
      need:{
        query:NEED_QUERY,
        variables() {
          return {
            input: this.$route.params.id
          }
        },
        skip() {
          return this.skipQuery
        }
      },
      donationPlaces:{
        query:ALL_DONATIONPLACES_QUERY,
        skip() {
          return this.skipQuery
        }
      }
    },
    methods: {

      save() {  

        delete this.need["__typename"]
       
        if( this.userRole === "IS_ADMIN" )
        {
          if(this.need.donationPlace === "" )
          {
            return this.$swal(
                  '',
                  'Como administrador debe llenar el lugar de donación',
                  'error'
                )
          } 
        }

        if( this.need.address === "" ||  this.need.contact === "" ||  this.need.phone === ""
        ||  this.need.description === "" ||  this.need.peopleNeeded === "" ||  this.need.childrenNeeded === "")
        {
          return this.$swal(
                  '',
                  'Debe llenar los datos obligatorios para continuar',
                  'error'
                )
        }
        else{
          //eslint-disable-next-line
          console.log("lets go",this.need)

          this.need.peopleNeeded = Number(this.need.peopleNeeded)

          this.need.childrenNeeded = Number(this.need.childrenNeeded)

          if( this.userRole != "IS_ADMIN" )
          {
            this.donationPlace = ""
          }

          if (this.need.id) {
            this.$apollo
            .mutate({
                mutation: UPDATE_NEED_MUTATION,
                variables: {
                  input: this.need                 
                }
            })
            .then(response => {
              //eslint-disable-next-line
              console.log("created",response)
              this.$swal({icon:'success',title: '!Datos registrados!'})
            })
            .catch(error =>{
              //eslint-disable-next-line
              console.error("created",error)
              this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
            })
          }
          else{
            this.$apollo
            .mutate({
                mutation: CREATE_NEED_MUTATION,
                variables: {
                  input: this.need                 
                }
            })
            .then(response => {
              //eslint-disable-next-line
              console.log("created",response)
              this.$swal({icon:'success',title: '!Datos registrados!'})

              this.need = response.data.createNeed

            })
            .catch(error =>{
              //eslint-disable-next-line
              console.error("created",error)
              this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
            })
          }


        }
      

      },
      cancel() {
        this.$router.push({ name: 'Requirements' })
      }
     
    },
    created() {

      this.statusValidation = [];
      
      this.documentTypes = [{name:"Cedula de ciudadania",value:"CC"},
      {name:"Pasaporte",value:"PS"},
      {name:"Cedula de extranjería",value:"CE"}] 
       

    },
    mounted() {
      this.$apollo.queries.cities.skip = false
      this.$apollo.queries.cities.refetch()

      //eslint-disable-next-line
      console.log("userRole",this.userRole)

      if(this.userRole === "IS_ADMIN")
      {
        this.$apollo.queries.donationPlaces.skip = false
        this.$apollo.queries.donationPlaces.refetch()
      }

      if (this.$route.params.id) {
        this.$apollo.queries.need.skip = false
        this.$apollo.queries.need.refetch()
        this.title = 'Editar Necesidad'
      } else this.title = 'Nueva Necesidad'     

    },
    watch: {
      
      need(val){
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
