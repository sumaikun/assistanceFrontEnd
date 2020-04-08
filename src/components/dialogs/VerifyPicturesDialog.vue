<template>
    <v-dialog v-model="verifyPicturesDialog" persistent max-width="500px" @click.stop="verifyPicturesDialog=false">       
        <v-card>
          <v-card-title>
            <span class="headline">Datos</span>
          </v-card-title>
          <v-card-text>
            <v-container>
                
                <v-flex md12 sm12 xs12  class="mx-1 px-0" >
                    <v-img v-for="(item, index) in pictures" v-bind:key="index" 
                     :src="imagePath+item" aspect-ratio="2" @dblclick="$emit('imageSelected', item)" ></v-img>
                </v-flex>

            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click.native="$emit('close')">Cerrar</v-btn>            
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>
<script>

    export default {
        name: 'TransporterDialog',
        props:{
          verifyPicturesDialog:Boolean,
          pictures:Array,
          imagePath:String
        },
        created(){
          //this.countryDialog = false;
          /* eslint-disable-next-line */
          console.log(this.verifyPicturesDialog);
        }
    }

</script>