<template>
  <v-container >
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/helpicon.png')"
          class="my-3"
          contain
          height="200"
        />

        <!--
        <v-img
          style="position:absolute; width:15vw"
          :src="require('../assets/emaus.png')"
          class="my-3"
          contain
          
        />-->
      </v-col>       
      

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          ¡ Bienvenido a solidaridad 4 all !
        </h1>

      <v-col
        class="mb-5 user-link"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
            Quieres ayudar, porfavor ingresa a este 
        </h2>

        <v-row justify="center">          
          <a
            @click="clickMenu('DonationType')" 
          >enlace</a>
        </v-row>
      </v-col>

        <p class="subheading font-weight-regular" style="color:white">
           Para los asistentes de las parroquias o lugares de donación, para acceder al sistema hagan click 
          <a
            @click="clickMenu('Login')" 
          >aqui</a>
        </p>
      </v-col>


      <v-col cols="12">
        <div style="float: right;">
          <span style="color:white" >Powered By</span>
          <img
            :src="require('../assets/apes.png')"
            style="width:40%"
          />
        </div>
      </v-col>
    

     

    
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    methods:{
      clickMenu(route) {        
        this.$router.push({
          name: route
        });
      },
    }    
  }
</script>
