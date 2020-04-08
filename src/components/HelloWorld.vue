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
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Bienvenido a ¡ Deseo ayudar !
        </h1>

        <p class="subheading font-weight-regular" style="color:white">
          Quieres realizar una donación
          <br>Por favor ingresa a
          <a
            @click="clickMenu('DonationType')" 
          >Este enlace</a>
        </p>
      </v-col>

      <v-col
        class="mb-5 user-link"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          ¿ Quieres verificar los pedidos o la trazabilidad de las donaciones ?, haz click
        </h2>

        <v-row justify="center">
          <a
            @click="clickMenu('Login')" 
          >aqui</a>
        </v-row>
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
