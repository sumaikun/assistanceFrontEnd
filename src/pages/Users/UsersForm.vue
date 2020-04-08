<template>
  <v-container fluid>

    <v-snackbar v-model="snackbar" :timeout="timeout" :top="true" >
        <span class="red--text" >{{ textResponse }}</span>
        <v-btn color="blue" text @click="snackbar = false" >Cerrar</v-btn>
    </v-snackbar> 


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
                    <v-flex md12 sm12 xs12  class="mx-1 px-0">
                      <v-text-field name="email" label="Correo electónico" autocomplete="off"
                       v-model="user.email"
                        v-bind:rules="rules.email"
                       hint="usuario del sistema es un dato obligatório" value="" 
                        class="input-group--focused" required></v-text-field>
                    </v-flex>
                    <v-flex md12 sm12  class="mx-1 px-0">
                      <v-text-field name="password" label="Contraseña" type="password" minlegth="8"
                       v-model="password" hint="Porfavor ingrese una contraseña, minimo 8 dígitos" value=""
                       v-bind:rules="rules.password" 
                       class="input-group--focused" required></v-text-field>
                    </v-flex>
                    <v-flex md12 sm12  class="mx-1 px-0">
                      <v-text-field name="confirmPassword" label="Confirmar contraseña" type="password"
                       v-model="confirmPassword" v-bind:rules="rules.confirmPassword"
                       minlegth="8" hint="Aquí confirma la contraseña" value="" 
                        class="input-group--focused" required></v-text-field>
                    </v-flex>
                    <v-flex md5 sm12  xs12 class="mx-1 px-0">
                      <v-text-field name="name" type="text" autocomplete="off" label="Nombre de usuario" value=""
                       v-model="user.name"
                       class="input-group--focused" required></v-text-field>
                    </v-flex> 
                    <v-flex md5 sm12  xs12 class="mx-1 px-0">
                      <v-text-field name="lastName" type="text" autocomplete="off" label="Apellido de usuario" value=""
                       v-model="user.lastName"
                       class="input-group--focused" required></v-text-field>
                    </v-flex>
                    <v-flex md6 sm12  xs12 class="mx-1 px-0">
                      <v-autocomplete
                        name="documentType"  utocomplete="off" label="Tipo de documento" value=""
                        v-model="user.documentType"
                        item-text="name"
                        item-value="value"
                        :items="documentTypes"
                        required 
                      ></v-autocomplete>                    
                    </v-flex> 
                  
                    <v-flex md6 sm12  xs12 class="mx-1 px-0">
                      <v-text-field name="number" type="documentNumber"  utocomplete="off" label="Número de documento" value=""
                       v-model="user.documentNumber"  v-bind:rules="rules.email"
                        class="input-group--focused" required></v-text-field>
                    </v-flex>                   

                    <v-flex md12 sm12  class="mx-1 px-0">
                      <v-switch label="Es administrador" :value="'IS_ADMIN'" v-model="user.role" light></v-switch>
                    </v-flex>

                    <v-flex md2 sm12  xs4 v-for="(item, index) in donationPlaces" v-bind:key="index" class="mx-1 px-0">
                      <v-switch 
                        v-model="user.role" :value="item.id" :label="item.name"></v-switch>
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

  import { USER_QUERY,
   CREATE_USER_MUTATION,
   UPDATE_USER_MUTATION,
   ALL_DONATIONPLACES_QUERY
  } from '@/graphql'

  export default {
    components:{
      Loading
    },
    
    data() {
      return {
        donationPlaces: [],
        title: '',
        statusValidation: [],
        password:'',
        confirmPassword:'',
        rules: {        
          email: [() => {
            /* eslint-disable no-useless-escape */
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (this.user && !re.test(this.user.email)) {
              this.statusValidation[0] = false
              return 'Correo es invalido.'
            }
            else{
              this.statusValidation[0] = true
              return true;
            }
            
          }],
          password:[() => {
            if( this.password.length < 8 && this.password.length > 0 ){
              this.statusValidation[1] = false
              return 'Deben haber al menos 8 digitos para la contraseña'
            }
            else{
              this.statusValidation[1] = true
              return true;
            }
          }],
          confirmPassword:  [() => {
            /* eslint-disable no-useless-escape */
            if (this.password  !== this.confirmPassword ) {
              this.statusValidation[2] = false
              return 'Las contraseñas no coinciden.'
            }
            else{
              this.statusValidation[2] = true
              return true;
            }           
            
          }]
        },
        user:{},
        textResponse:"",
        snackbar:null,
        timeout: 0,
        skipQuery: true,
      }
    },
    computed: {
     
    },
    apollo:{
      user:{
        query:USER_QUERY,
        variables() {
          return {
            input: this.$route.params.id
          }
        },
        skip() {
          return this.skipQuery
        }
      },
      donationPlaces: {
          query: ALL_DONATIONPLACES_QUERY,               
          skip() {
          return this.skipQuery
          }
      }      
    },
    methods: {

      save() {

        delete this.user["__typename"]

        this.user.password = this.password || ""

        const userKeys = Object.keys(this.user)

        let objectValidity = true

        userKeys.forEach(  key => {

            /* eslint-disable-next-line */
            //console.log(key)
            if( key !== "id" &&  key !== "password" &&  key !== "role" &&  key !== "donationPlace" )
            {
              /* eslint-disable-next-line */
              console.log(this.user[key],key)
              if(this.user[key].length == 0)
              {
                  objectValidity = false
              }
            }

        })       


          if(!objectValidity)
          {
            this.textResponse = " Error: Por favor ingrese todos los campos"
            this.snackbar = true
            return; 
          }

          if(!this.statusValidation[1] && this.password.length>0)
          {
            this.textResponse = " Error: Ingrese una contraseña valida para continuar"
            this.snackbar = true
            return; 
          }

          if(!this.statusValidation[0] || !this.statusValidation[2])
          {
            this.textResponse = " Error: Porfavor verifique la validación de los campos"
            this.snackbar = true
            return; 
          }else{
            this.user.password = this.password
            this.user.role === null ? this.user.role = "" : false
          }

          console.log(this.user)

          if(this.user.role != "IS_ADMIN")
          {
            this.user.donationPlace = this.user.role
            this.user.role = "IS_ASSISTANCE"

          }else{
            this.user.donationPlace = ""
          }

         if (this.$route.params.id) {
           //eslint-disable-next-line
           console.log("update")
            this.user.id = this.$route.params.id
            this.$apollo
          .mutate({
              mutation: UPDATE_USER_MUTATION,
              variables: {
                input: this.user                 
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
         }
         else{
           console.log("save")
           this.$apollo
          .mutate({
              mutation: CREATE_USER_MUTATION,
              variables: {
                input: this.user                 
              }
          })
          .then(response => {
            //eslint-disable-next-line
            console.log("created",response)
            this.$swal({icon:'success',title: '!Datos registrados!'})
            this.donationPlace = response.data.createUser
          })
          .catch(error =>{
             //eslint-disable-next-line
             console.error("created",error)
             this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
          })
         }
         

      },
      cancel() {
        this.$router.push({ name: 'Users' })
      }
    },
    created() {

      this.statusValidation = [];      
      this.documentTypes = [{name:"Cedula de ciudadania",value:"CC"},
      {name:"Pasaporte",value:"PS"},
      {name:"Cedula de extranjería",value:"CE"} ]  

    },
    mounted() {

      this.$apollo.queries.donationPlaces.skip = false
      this.$apollo.queries.donationPlaces.refetch()

      if (this.$route.params.id) {
        this.title = 'Editar Usuario'
        this.$apollo.queries.user.skip = false
        this.$apollo.queries.user.refetch()
      } else this.title = 'Nuevo Usuario'
    },
    watch:{
      user(val){
          //eslint-disable-next-line
          console.log(val)

          if( val.donationPlace != ""  )
          {
            this.user.role = val.donationPlace
          }
      }
    }
  }
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>
