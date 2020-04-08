<template>  
  <v-container fluid>   
    <CityDialog :cityDialog="cityDialog" :city="city" 
     @close="closeCityDialog" @save="saveCity" />


    <TransporterDialog :transporterDialog="transporterDialog" :transporter="transporter" 
     @close="closeTransporterDialog" @save="saveTransporter" />

    <v-row>        

        <v-flex lg6 md6 xs12 class="table-container">
            <v-card>
                <v-card-title>
                    <span class="title"> Ciudades {{pagination ? "("+pagination.totalItems+")": ""}}
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
                <Table  :headers="headers" :items="cities"  :pagination="pagination" @edit="editCity" @remove="removeCity"></Table>

                
            
            </v-card>

        </v-flex>


        <v-flex lg6 md6 xs12 class="table-container">
            <v-card>
                <v-card-title>
                    <span class="title"> Transportadoras {{transporters ? "("+transporters.length+")": ""}}
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

                        <v-btn class="deep-orange darken-3 iconButtons" fab small dark @click.native="addTransporter">
                            <v-icon>add</v-icon>
                        </v-btn>
                    
                </v-card-title>

                <Loading></Loading>
                <Table  :headers="headers2" :items="transporters"  :pagination="pagination" @edit="editTransporter" @remove="removeTransporter"></Table>

                
            
            </v-card>

        </v-flex>



    </v-row>   

  </v-container>
</template>
<script>

import Table from "@/components/Table.vue"
import Loading from "@/components/Loading.vue"
import CityDialog  from "@/components/dialogs/CityDialog"
import TransporterDialog  from "@/components/dialogs/TransporterDialog"

import { ALL_CITIES_QUERY, 
CREATE_CITY_MUTATION,
UPDATE_CITY_MUTATION,
ALL_TRANSPORTERS_QUERY,
CREATE_TRANSPORTER_MUTATION,
UPDATE_TRANSPORTER_MUTATION
} from '@/graphql'

 export default {
     name:"Parameters",
     components:{
         Table,
         Loading,
         CityDialog,
         TransporterDialog
     },
     created(){
            this.headers = [
                {
                    text: 'Nombre Ciudad',
                    left: true,
                    value: 'name'
                },
                { text: 'Opciones', value: 'crudButtons', sortable: false }  
                       
            ];

            this.headers2 = [
                {
                    text: 'Nombre Transportadora',
                    left: true,
                    value: 'name'
                },
                { text: 'Opciones', value: 'crudButtons', sortable: false }  
                       
            ];

            this.pagination.totalItems = 0
    },
    mounted(){
            this.$apollo.queries.cities.skip = false
            this.$apollo.queries.cities.refetch()


            this.$apollo.queries.transporters.skip = false
            this.$apollo.queries.transporters.refetch()
    },
    data: () => ({
        headers: [],
        headers2:[],
        cityDialog: false,
        transporterDialog: false,
        city:{},
        cities:[],
        transporters:[],
        transporter:{},
        pagination:{},
        skipQuery: true,
    }),
    apollo:{
        cities:{
            query: ALL_CITIES_QUERY,               
            skip() {
                return this.skipQuery
            }
        },
        transporters:{
            query: ALL_TRANSPORTERS_QUERY,               
            skip() {
                return this.skipQuery
            }
        }
    },
    methods:{
        add(){
            this.cityDialog = true;
            this.city = {}                
        },
        closeCityDialog(){
            this.cityDialog = false;
        },
        closeTransporterDialog(){
            this.transporterDialog = false;
        },
        saveCity(){
            //eslint-disable-next-line
            if(this.city.id)
            {
                this.$apollo
                .mutate({
                    mutation: UPDATE_CITY_MUTATION,
                    variables: {
                        input: this.city                 
                    }
                })
                .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados!'})
                    this.$apollo.queries.cities.refetch()
                })
                .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                })
            }
            else{
                this.$apollo
                .mutate({
                    mutation: CREATE_CITY_MUTATION,
                    variables: {
                        input: this.city                 
                    }
                })
                .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados!'})
                    this.$apollo.queries.cities.refetch()
                })
                .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                })
            } 
        },
        editCity(data){
            //eslint-disable-next-line
            console.log(data)
            delete data["__typename"]
            this.city = data
            this.cityDialog = true;  
        },
        removeCity(){

        },
        addTransporter(){
            this.transporterDialog = true;
            this.transporter = {}  
        },
        editTransporter(data){
            //eslint-disable-next-line
            console.log(data)
            delete data["__typename"]
            this.transporter = data
            this.transporterDialog = true
        },
        removeTransporter(){

        },
        saveTransporter(){
            //eslint-disable-next-line
            console.log(this.transporter)
            if(this.transporter.id)
            {
                this.$apollo
                .mutate({
                    mutation: UPDATE_TRANSPORTER_MUTATION,
                    variables: {
                        input: this.transporter                 
                    }
                })
                .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados!'})
                    this.$apollo.queries.transporters.refetch()
                })
                .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                })
            }
            else{
                this.$apollo
                .mutate({
                    mutation: CREATE_TRANSPORTER_MUTATION,
                    variables: {
                        input: this.transporter                 
                    }
                })
                .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados!'})
                    this.$apollo.queries.transporters.refetch()
                })
                .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                })
            }
        }
    },
    watch:{
        cities(val){
            /* eslint-disable-next-line */
            console.log("items val",val);

            this.pagination.totalItems = val.length
        }
    }

 }

</script>
<style>
   
    .table-container{
        padding:20px;
    }
</style>