<template>
     <v-dialog v-model="dialog" max-width="85vw" @click.stop="dialog=false">
     <img :src="imageTaken" alt="" width="100%" >
 </v-dialog>
</template>

<script>

    export default {
        name: 'CityDialog',
        props:{
          dialog:Boolean,
          imageTaken:String          
        },
        created(){
          //this.countryDialog = false;
          /* eslint-disable-next-line */
          //console.log(this.cityDialog);
        }
    }

</script>