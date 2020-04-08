<template>
    <v-dialog v-model="donationDialog" persistent max-width="600px">       
        <v-card>
          <v-card-title>
            <span class="headline">Datos del donante</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field
                    label="Nombre"
                    name="name"
                    v-model="donation.name"
                ></v-text-field>
                
                <v-flex md4 sm12 xs12  class="mx-1 px-0">
                    <v-text-field
                        label="Teléfono de contacto"
                        name="phone"
                        v-model="donation.phone"
                    ></v-text-field>
                </v-flex> 

                <v-flex md4 sm12 xs12  class="mx-1 px-0">
                     <v-text-field
                     label="Ciudad"
                      name="phone"
                      v-model="donation.city"
                      ></v-text-field>
                    </v-flex> 

                <v-text-field
                    label="Dirección"
                    name="address"
                    v-model="donation.address"
                ></v-text-field>                         
              </v-row>
            </v-container>
            <small>* Indica campo obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click.native="$emit('close')">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click.native="$emit('save')">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>
<script>

    export default {
        name: 'DonationDialog',
        props:{
          donationDialog:Boolean,
          donation:Object,
          cities:Array
        },
        created(){
          //this.countryDialog = false;
          /* eslint-disable-next-line */
          console.log(this.donationDialog);
        }
    }

</script>