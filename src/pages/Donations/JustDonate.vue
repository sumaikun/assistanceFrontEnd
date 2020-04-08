<template>
    <v-container >
        <v-card class="elevation-0">
            
            <form id="formContainer" @submit="checkForm()">
                <h2>Formulario de donación</h2>
                <v-text-field
                    label="Nombre"
                    name="name"
                    v-model="donation.name"
                ></v-text-field>
                <v-text-field
                    label="Teléfono de contacto"
                    name="phone"
                    v-model="donation.phone"
                ></v-text-field>

                <v-flex md4 sm12 xs12  class="mx-1 px-0">
                     <v-text-field
                     label="Ciudad"
                      name="phone"
                      v-model="donation.city"
                      ></v-text-field>
                    </v-flex> 

                <v-text-field
                    label="Dirección"
                    name="phone"
                    v-model="donation.address"
                ></v-text-field>
                
                <v-flex md6 sm12 xs12  class="mx-1 px-0">
                     <v-textarea
                     outlined
                       label="Descripción de la donación" autocomplete="off"                         
                       hint="La descripción es un dato obligatório"
                       value="" v-model="donation.description"
                       class="input-group--focused" required></v-textarea>
                </v-flex>

                <span>Lugar de donación:</span>

                <br>

                <v-card class="d-inline-block mx-auto card-container" v-for="(item, index) in donationPlaces" v-bind:key="index" >
                    <h3>{{  item.name }}</h3>
                    <v-container>
                        <v-row justify="space-between">
                            <v-col cols="auto">
                                <v-img
                                    height="200"
                                    width="200"
                                    :src="imagePath+item.picture"
                                ></v-img>
                                <p> {{  item.address }} </p>
                            </v-col>
                        </v-row> 
                    </v-container>
                    <v-switch 
                        v-model="donation.donationPlace" :value="item.id" ></v-switch>
                </v-card>  

                <br><br>   

                <v-flex md12 sm12 xs12  >
                    <v-btn class="mr-4" @click="submit">Guardar</v-btn>
                    <v-btn @click="clear">Limpiar</v-btn>
                </v-flex>

            </form>
        </v-card>
    </v-container>
</template>
<script>

import { 
   ALL_CITIES_QUERY,
   ALL_DONATIONPLACES_QUERY,
   CREATE_DONATION_MUTATION,
} from '@/graphql'

  export default {
    name: 'JustDonate',
    methods:{
      
      submit () {
        // eslint-disable-next-line
          console.log("formulario",this.donation)

          this.donation.need = ""


          if(this.donation.name === null || this.donation.phone === null || this.donation.address === null ||
             this.donation.description === null || this.donation.city === null || this.donation.donationPlace === null ){
            return this.$swal({icon:'error',title: '!Por favor pon todos los datos!'})
          }

          this.$apollo
                .mutate({
                    mutation: CREATE_DONATION_MUTATION,
                    variables: {
                        input: this.donation                 
                    }
                })
                .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados! , MUCHAS GRACIAS POR SU CONTRIBUCIÓN '})
                    this.donation = { name:null, phone:null, address:null, description:null, city:null, donationPlace:null }
                })
                .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                })
      },
      clear () {
        this.donation = { name:null, phone:null, address:null, description:null, city:null, donationPlace:null }
      },
    },
    data(){
        return{
            donation:{ name:null, phone:null, address:null, description:null, city:null, donationPlace:null },
            skipQuery:true,
            imagePath:process.env.VUE_APP_SERVER_HOST
        }
    },
    apollo:{      
      cities:{
        query:ALL_CITIES_QUERY,
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
    mounted(){
      this.$apollo.queries.cities.skip = false
      this.$apollo.queries.cities.refetch()

      this.$apollo.queries.donationPlaces.skip = false
      this.$apollo.queries.donationPlaces.refetch()
    }      
  }
</script>
<style>
    #formContainer{
        padding: 20px;
    }
    .card-container{
        padding: 15px;
        margin: 15px;
    }
</style>