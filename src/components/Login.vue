<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        
        <v-snackbar v-model="snackbar" :timeout="timeout" :top="true" >
          {{ textResponse }}
          <v-btn color="blue" text @click="snackbar = false" >Cerrar</v-btn>
        </v-snackbar> 

        <v-row align="center" justify="center">
          <v-img
            :src="require('../assets/helpicon.png')"
            :lazy-src="require('../assets/helpicon.png')"
            aspect-ratio="3"
            class=""
            max-width="500"
            max-height="300"
            contain
          ></v-img>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="indigo darken-4"
                dark
                flat
              >
                <v-toolbar-title>INGRESA AL SISTEMA</v-toolbar-title>
                <v-spacer />                
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login">

                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    autocomplete="off"
                    type="email"
                    v-model="username"
                    required
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="password"
                    required
                  />

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="indigo darken-4" @click="makeLogin()">
                    <span style="color:white;" >Login</span>
                    
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>      
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

 
  import { LOGIN_MUTATION } from '@/graphql'

  export default {
    name: 'Login',
    props: {
      source: String,
    }, created (){
       this.snackbar = false;
       this.timeout = 5000;
       // eslint-disable-next-line no-console
       //console.log(this.$router);
    },
    data () {
      return {
        username:"",
        password:"",
        textResponse:"",
        snackbar:null,
        timeout: 0,
        login:{}
      }
    },
    methods: {
      makeLogin () {
        // eslint-disable-next-line no-console
        console.log(this.username, this.password);

        if(this.username.length == 0 ||  this.password.length == 0)
        {
          this.textResponse = "por favor ingrese los datos de usuario y contraseña"
          this.snackbar = true
          return; 
        }

        if(this.password.length <= 6)
        {
          this.textResponse = "La contraseña debe contener por lo menos 6 dígitos"
          this.snackbar = true
          return;
        }

        this.$Progress.start()

        this.$apollo
          .mutate({
              mutation: LOGIN_MUTATION,
              variables: {
                input: {email: this.username, password: this.password}                 
              }
          })
          .then(response => {
              // save user token to localstorage
              localStorage.setItem('authorization_token', response.data.login.access_token)
              localStorage.setItem('role', response.data.login.role)

              //eslint-disable-next-line 
              console.log(response.data.login.access_token)           

              this.$Progress.finish()
              this.textResponse = "Bienvenid@"
              this.snackbar = true
              
              const self = this

              window.setTimeout(function(){ 
                self.$router.push("Welcome")
              }, 1000);

          }).catch(error =>{

               //eslint-disable-next-line 
              console.error(error)

              this.$Progress.finish()
              this.textResponse = "No puede ingresar"
              this.snackbar = true
          })  

     }
    }
  }
</script>