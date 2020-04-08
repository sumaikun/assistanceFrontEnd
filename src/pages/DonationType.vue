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
     

      <v-col
         lg="6" md="12" sm="12"
         class="cursorContainer"
         @click="clickMenu('DonateSomeOne')"
        
      >
        <div class="selectionContainer">
            <strong>¡Donarle a alguien!</strong>
            <v-img
                :src="require('../assets/vector-donation.webp')"
                class="my-3"
                contain
                height="200"
            />
            <p class="text-justify" >Tenemos pedidos especificos de madres lactantes, mayores de edad, personas en estado de vulnerabilidad
                 que necesitan medicamentos, leche en polvo, así como comida u otra necesidad especial,
                  ¡Si quieres conocer esos casos haz click aqui! </p>
        </div>
      </v-col>


      <v-col
         lg="6" md="12" sm="12"
         class="cursorContainer"
         @click="clickMenu('JustDonate')"
      >
        <div class="selectionContainer">
            <strong>¡Solo quiero donar!</strong>
            <v-img
                :src="require('../assets/justDonate.svg')"
                class="my-3"
                contain
                height="200"
            />
            <span class="text-justify">
                Quieres realizar una donación por que para ti lo mas importante es ayudar a la mayoria de personas que puedas, en la medida que puedas ¡haz click aqui!
            </span>
        </div>
       
      </v-col>

     

    
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'DonationType',
    methods:{
      clickMenu(route) {        
        this.$router.push({
          name: route
        });
      },
    }    
  }
</script>
<style>

    .selectionContainer{        
        background-color: #ffffff;
        border-radius: 25px;
        padding: 10%;
        cursor:grab;     
    }

    .descriptionText{
        text-align: justify;
    }


</style>