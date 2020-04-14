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
    ALL_CITIES_QUERY,
    NEEDS_BY_DONATION_PLACE,
    DELETE_DONATIONPLACE_MUTATION
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
            selectImage:"",
            idToSearch:0             
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
            },
            needsByDonation:{
                query:NEEDS_BY_DONATION_PLACE,
                variables() {
                return {
                    input: this.idToSearch
                }
                },
                skip() {
                return this.skipQuery
                }
            },
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
                this.idToSearch = item.id
                this.$apollo.queries.needsByDonation.skip = false
                this.$apollo.queries.needsByDonation.refetch().then( result => {
                    console.log("result of queries",result)

                    if(this.needsByDonation.length > 0)
                    {
                        this.$swal({icon:'warning',title: '!No puede eliminarse un lugar de donación que ya tiene necesidades asociadas!'})
                    }else{
                        //eslint-disable-next-line
                        console.log("time to delete")

                        this.$swal({
                        title: '¿Estas seguro?',
                        text: "¡No posdrás revertir este proceso!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, adelante!',
                        cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.value) {
                                //eslint-disable-next-line
                                console.log("time to delete")
                                this.$apollo
                                .mutate({
                                    mutation: DELETE_DONATIONPLACE_MUTATION,
                                    variables: {
                                        input: item.id                 
                                    }
                                })
                                .then(response => {
                                    //eslint-disable-next-line
                                    console.log("deleted",response)
                                    this.$apollo.queries.donationPlaces.refetch()        
                                    this.$swal({icon:'success',title: '!Datos eliminados!'})
                                })
                                .catch(error =>{
                                    //eslint-disable-next-line
                                    console.error("deleted",error)
                                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                                })
                                
                            }                   
                        })
                    }
                })
                
                
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
            },
            needsByDonation(val){
                console.log("needs by donation",val)
            }
        }
    };
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>