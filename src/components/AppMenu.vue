<style>
  .v-application--wrap{
    background-image: none;
  }
 
</style>
<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :expand-on-hover="true"
      v-if="token"
    >
      <v-list dense> 

        <v-list-item @click="clickMenu('Users')" v-if="role==='IS_ADMIN'" router>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title >Usuarios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="clickMenu('Parameters')" v-if="role==='IS_ADMIN'" router>
          <v-list-item-action>
            <v-icon>mdi-hammer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title >Configurar Parametros</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-list-item @click="clickMenu('DonationPlaces')" v-if="role==='IS_ADMIN'"   router>
          <v-list-item-action>
            <v-icon>mdi-star</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Lugares de donación</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="clickMenu('Requirements')"   router>
          <v-list-item-action>
            <v-icon>mdi-cart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Necesidades</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="clickMenu('Donors')"   router>
          <v-list-item-action>
            <v-icon>mdi-heart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Donantes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="clickMenu('Delivers')"   router>
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Entregas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-list-item @click="signOut()" router>
          <v-list-item-action>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      

    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Sistema ayuda</v-toolbar-title>
    </v-app-bar>

    <v-content>
       <v-container        
        fluid
      >
        <router-view></router-view>          
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019  APES </span>
    </v-footer>
  </v-app>
</template>

<script>
  
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      token:localStorage.getItem("authorization_token"), 
      role:localStorage.getItem("role")     
    }),
    created () {
      this.$vuetify.theme.light = true
    },
    computed:{
      /*userRole(){
        return this.$store.state.user.user.ROLE
      }*/
    },
    methods:{
      clickMenu(route) {        
        this.$router.push({
          name: route
        });
      },
      signOut(){
        

        const self = this;

        this.$swal({
                title: '¿Estas seguro de cerrar sesión?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#424242',
                cancelButtonColor: '#ff7674',
                confirmButtonText: 'Si, adelante!',
                cancelButtonText: 'Cancelar'
                }).then((result) => {
                  if (result.value) {
                      //eslint.-disable-next-line
                      localStorage.clear();
                      self.$router.push("Home")
                  }
        });          
       
      }
    }
  }
</script>
