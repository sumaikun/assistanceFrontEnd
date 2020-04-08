<template>
  <v-container fluid>
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <span class="title"> Lugares de donación {{pagination? "("+pagination.totalItems+")": ""}}
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
            <Table  :headers="headers" :items="donationPlaces"  :pagination="pagination" @imageSelected="selectedImage" @edit="edit" @remove="remove"></Table>
        
        </v-card>
    </v-flex>
    
    <ImageDialog :dialog="imageDialog" :imageTaken="selectImage"  ></ImageDialog>
   

  </v-container>
</template>
<script>

import Table from "@/components/Table.vue"
import Loading from "@/components/Loading.vue"
import ImageDialog from "@/components/dialogs/ImageDialog.vue"
//import { mapState } from "vuex";

import {
    ALL_DONATIONPLACES_QUERY,
    ALL_CITIES_QUERY
} from '@/graphql'

    export default {
        name: 'DonationPlacesList',
        components:{
            Table,
            Loading,
            ImageDialog
        },
        created(){

            this.headers = [
                {
                    text: 'nombre',
                    left: true,
                    value: 'name'
                },
                { text: 'Dirección', value: 'address' },
                { text: 'Ciudad', value: 'city', type: 'relationship',
                    dataSet: this.cities },
                { text: 'Foto', value: 'picture', type: 'image' },
                { text: 'Representante', value: 'contact' },
                { text: 'Número de contacto', value: 'phone' },               
                { text: 'Opciones', value: 'crudButtons', sortable: false }          
            ];
         
            this.pagination = {}
            this.pagination.totalItems = 0 || this.donationPlaces.length;

           

        },
        mounted(){
            this.$apollo.queries.donationPlaces.skip = false
            this.$apollo.queries.donationPlaces.refetch()

            this.$apollo.queries.cities.skip = false
            this.$apollo.queries.cities.refetch()
            
        },
        data: () => ({
            headers: [],
            donationPlaces:[],
            cities:[],
            imagePath:process.env.VUE_APP_SERVER_HOST,
            imageDialog: false,
            selectImage:""             
        }),
        apollo:{
            donationPlaces: {
                query: ALL_DONATIONPLACES_QUERY,               
                skip() {
                return this.skipQuery
                }
            },
            cities:{
                query:ALL_CITIES_QUERY,
                skip() {
                return this.skipQuery
                }
            }
        },
        computed: {
         
        },
        methods: {

            reloadData(){
                /* eslint-disable-next-line */
                //console.log(this.$store);
              
            },
            add(){
                this.$router.push('DonationPlacesForm');
            },
            edit(item){
                /* eslint-disable-next-line*/
                console.log(item);
                this.$router.push({ name: 'DonationPlacesForm', params: { id: item.id } })
            },
            remove(item){
                /* eslint-disable-next-line*/
                console.log(item);               
            },
            selectedImage(data){
                /* eslint-disable-next-line*/
                console.log(data);
                this.imageDialog = true
                this.selectImage = this.imagePath+data.picture
            }

        },
        watch: {
            donationPlaces(val){
                /* eslint-disable-next-line */
                console.log("items val",val);

                this.pagination.totalItems = val.length
            },
            cities(val){
                /* eslint-disable-next-line */
                console.log(this.headers[2],val)
                if(val.length > 0)
                {
                    this.headers[2].dataSet = val
                }
            }
        }
    };
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>