<template>
  <v-container fluid>
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <span class="title"> Necesidades {{pagination? "("+pagination.totalItems+")": ""}}
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
            <Table  :headers="headers" :items="needs"  :pagination="pagination" @edit="edit" @remove="remove"></Table>
        
        </v-card>
    </v-flex>    


  </v-container>
</template>
<script>

import Table from "@/components/Table.vue";
import Loading from "@/components/Loading.vue";
import {
    ALL_NEEDS_QUERY,
    ALL_CITIES_QUERY,
    ALL_DONATIONPLACES_QUERY,
    DELETE_NEED_MUTATION
} from '@/graphql'

    export default {
        name: 'DonationPlacesList',
        components:{
            Table,
            Loading
        },
        created(){

            this.headers = [
                
                { text: 'Dirección', value: 'address' },
                { text: 'Ciudad', value: 'city', type: 'relationship',
                    dataSet: this.cities },
                { text: 'Contacto', value: 'contact' },
                { text: 'Tipo de documento', value: 'documentType' },
                { text: 'número', value: 'documentNumber' },
                { text: 'Teléfono', value: 'phone' },
                { text: 'Lugar de donación', value: 'donationPlace', type: 'relationship',
                    dataSet: this.donationPlaces },
                { text: 'No. adultos', value: 'peopleNeeded' },
                { text: 'No. niños', value: 'childrenNeeded' },
                { text: 'Descripción', value: 'description' },
                { text: 'Estado', value: 'state' },                               
                { text: 'Opciones', value: 'crudButtons', sortable: false }          
            ];
         
            this.pagination = {}
            this.pagination.totalItems = 0 || this.needs.length

           

        },
        data: () => ({
            headers: [],
            items:[],
            needs:[],
            cities:[],
            donationPlaces:[],
            skipQuery:true                   
        }),
        computed: {
         
        },
        mounted(){
            this.$apollo.queries.donationPlaces.skip = false
            this.$apollo.queries.donationPlaces.refetch()

            this.$apollo.queries.cities.skip = false
            this.$apollo.queries.cities.refetch()

            this.$apollo.queries.needs.skip = false
            this.$apollo.queries.needs.refetch()
        },
        apollo:{
            needs: {
                query: ALL_NEEDS_QUERY,               
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
            donationPlaces:{
                query:ALL_DONATIONPLACES_QUERY,
                skip() {
                return this.skipQuery
                }
            }
        },
        methods: {

            reloadData(){
                /* eslint-disable-next-line */
                //console.log(this.$store);
              
            },
            add(){
                this.$router.push('RequirementsForm');
            },
            edit(item){
                /* eslint-disable-next-line*/
                console.log(item);
                this.$router.push({ name: 'RequirementsForm', params: { id: item.id } })
            },
            remove(item){
                /* eslint-disable-next-line*/
                console.log(item);

                if(item.state != "REGISTERED" )
                {
                   return this.$swal({icon:'warning',title: '!Solo se puede eliminar si la necesidad esta asociada a otro proceso!'})
                }

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
                                mutation: DELETE_NEED_MUTATION,
                                variables: {
                                    input: item.id                 
                                }
                            })
                            .then(response => {
                                //eslint-disable-next-line
                                console.log("deleted",response)
                                this.$apollo.queries.needs.refetch()        
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

        },
        watch:{
            needs(val){
                /* eslint-disable-next-line */
                console.log("items val",val);

                this.pagination.totalItems = val.length
            },
            cities(val){
                /* eslint-disable-next-line */
                console.log(this.headers[2],val)
                if(val.length > 0)
                {
                    this.headers[1].dataSet = val
                }
            },
            donationPlaces(val){
                /* eslint-disable-next-line */
                console.log(this.headers[2],val)
                if(val.length > 0)
                {
                    this.headers[6].dataSet = val
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