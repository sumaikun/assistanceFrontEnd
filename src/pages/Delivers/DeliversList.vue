<template>
  <v-container fluid>

      <VerifyPicturesDialog :verifyPicturesDialog="verifyPicturesDialog" 
        @close="closeVpsDialog" :pictures="pictures" @imageSelected="selectedImage" :imagePath="imagePath" />

     <ImageDialog :dialog="imageDialog" :imageTaken="selectImage"  ></ImageDialog>

    <v-flex xs12>
        <v-card>
            <v-card-title>
                <span class="title"> Entregas {{delivers ? "("+delivers.length+")": ""}}
                    <v-text-field append-icon="search" label="Buscar" single-line hide-details ></v-text-field>
                </span>
                <v-spacer></v-spacer>

                    <!--
                    <v-btn class="blue-grey iconButtons" fab small dark @click.native.stop="rightDrawer = !rightDrawer">
                        <v-icon>search</v-icon>
                    </v-btn>
                    -->

                    <v-btn class="brown lighten-1 iconButtons" fab small dark @click.native="reloadData()">
                        <v-icon>refresh</v-icon>
                    </v-btn>
                    <!--
                    <v-btn class="teal darken-2 iconButtons" fab small dark @click.native="print()">
                        <v-icon>print</v-icon>
                    </v-btn>
                    -->

                    <v-btn class="deep-orange darken-3 iconButtons" fab small dark @click.native="add">
                        <v-icon>add</v-icon>
                    </v-btn>
                
            </v-card-title>

            <Loading></Loading>
            <Table  :headers="headers" :items="delivers"  :pagination="pagination" @edit="edit" @remove="remove"></Table>
        
        </v-card>
    </v-flex> 
  

  </v-container>
</template>
<script>

import Table from "@/components/Table.vue";
import Loading from "@/components/Loading.vue";
import VerifyPicturesDialog from "@/components/dialogs/VerifyPicturesDialog.vue"
import ImageDialog from "@/components/dialogs/ImageDialog.vue"

import {
    ALL_DELIVERS_QUERY
} from '@/graphql'

    export default {
        name: 'DeliversList',
        components:{
            Table,
            Loading,
            VerifyPicturesDialog,
            ImageDialog
        },
        created(){

            this.headers = [
                {
                    text: 'id',
                    left: true,
                    value: 'id'
                },
                { text: 'Donante', value: 'donation.name', asAction:this.checkDonant },
                { text: 'Lugar de donación', value: 'donationPlace.name' },
                { text: 'Pedido', value: 'need.contact', asAction:this.checkNeed },
                { text: 'Fotos y trazabilidad', type:'customActions', actions:[
                    { title:"Verificar", action: this.verifyPictures }
                ] },               
                          
            ];
         
            this.pagination = {};
           

        },
        data: () => ({
            headers: [],
            items:[],
            verifyPicturesDialog:false,
            pictures:[],
            imagePath:process.env.VUE_APP_SERVER_HOST,
            imageDialog: false,
            selectImage:""                   
        }),
        computed: {
         
        },
        apollo:{
            delivers: {
                query: ALL_DELIVERS_QUERY,               
                skip() {
                return this.skipQuery
                }
            }
        },
        mounted(){
            this.$apollo.queries.delivers.skip = false
            this.$apollo.queries.delivers.refetch()
        },
        methods: {
            closeVpsDialog(){
                this.imageDialog = false
                this.verifyPicturesDialog = false
            },
            reloadData(){
                /* eslint-disable-next-line */
                //console.log(this.$store);
              
            },
            add(){
                this.$router.push('DeliversForm');
            },
            edit(item){
                /* eslint-disable-next-line*/
                console.log(item);
                this.$router.push({ name: 'DeliversForm', params: { id: item.id } })
            },
            remove(item){
                /* eslint-disable-next-line*/
                console.log(item);               
            },
            checkNeed(data){
                //eslint-disable-next-line
                console.log("check data",data)
                
                const filteredNeed = data.need

                let html = "<strong> Info </strong><br><br>"
                html += "<ul style='list-style-type: none;' ><li>Dirección:"+filteredNeed.address+"</li>"
                html += "<li>Contacto:"+filteredNeed.contact+"</li>"
                html += "<li>Teléfono:"+filteredNeed.phone+"</li>"
                html += "<li>Descripción:"+filteredNeed.description+"</li>"
                html += "</ul>"

                this.$swal({html})
            },
            checkDonant(data){
                //eslint-disable-next-line
                console.log("check data",data)

                const filteredNeed = data.donation

                let html = "<strong> Info </strong><br><br>"
                html += "<ul style='list-style-type: none;' ><li>Dirección:"+filteredNeed.address+"</li>"
                html += "<li>Contacto:"+filteredNeed.name+"</li>"
                html += "<li>Teléfono:"+filteredNeed.phone+"</li>"
                html += "<li>Descripción:"+filteredNeed.description+"</li>"
                html += "</ul>"

                this.$swal({html})
            },
            verifyPictures(data){
                //eslint-disable-next-line
                console.log("verify pictures",data)
                this.verifyPicturesDialog = true
                this.pictures = data.pictures
            },
            selectedImage(data){
                /* eslint-disable-next-line*/
                console.log(data);
                this.imageDialog = true
                this.selectImage = this.imagePath+data
            }
        }
    };
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>