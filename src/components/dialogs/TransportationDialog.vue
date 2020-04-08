<template>
    <v-dialog v-model="transportationDialog" persistent max-width="600px">       
        <v-card>
          <v-card-title>
            <span class="headline">Datos</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field label="Número de transacción *" 
                  v-model="transportation.transactionNumber"
                   required>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    item-text="name"
                    item-value="id"
                    :items="transporters"
                    label="Transportador"
                    v-model="transportation.transporter"               
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-if=" donation  && donation.need === null ">
                    <v-btn color="blue darken-1" text @click.native="$emit('assocNeed')">Asociar necesidad</v-btn>              
                </v-col>                                 
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
        name: 'TransportationDialog',
        props:{
          transportationDialog:Boolean,
          transportation:Object,
          transporters:Array,
          donation:Object
        },
        created(){
          //this.countryDialog = false;
          /* eslint-disable-next-line */
          console.log(this.transportationDialog);
        }
    }

</script>