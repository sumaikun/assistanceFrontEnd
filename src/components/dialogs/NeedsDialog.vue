<template>
   <v-dialog v-model="needsDialog" persistent max-width="1600px">  
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <span class="title"> Necesidades {{ needs ? "("+needs.length+")": ""}}
                    <v-text-field append-icon="search" label="Buscar" single-line hide-details ></v-text-field>
                </span>
                <v-spacer></v-spacer>

                
            </v-card-title>

            <Loading></Loading>
            <Table  :headers="headers" :items="needs ? needs.filter( data => data.state === 'REGISTERED' || data.state === 'PARTIAL_SOLVED' ) : []"
                  :pagination="pagination" :selectedItem="selectedItem" ></Table>

             <v-flex xs12>
                <v-btn color="blue darken-1" text @click.native="$emit('saveNeed')">Asociar necesidad</v-btn>
                <v-btn color="blue darken-1" text @click.native="$emit('close')">Cerrar</v-btn>
             </v-flex>

        </v-card>
    </v-flex>    

   


  </v-dialog>
</template>
<script>

import Table from "@/components/Table.vue";
import Loading from "@/components/Loading.vue";
import {
    //ALL_NEEDS_QUERY,
    ALL_CITIES_QUERY,
    ALL_DONATIONPLACES_QUERY
} from '@/graphql'

    export default {
        name: 'NeedsDialog',
        components:{
            Table,
            Loading
        },
        created(){

            this.headers = [
                
                { text: 'Dirección', value: 'address', radioSelector:true },
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
                     
            ];
         
            this.pagination = {}         

        },
        data: () => ({
            headers: [],
            items:[],            
            cities:[],
            donationPlaces:[],
            skipQuery:true                   
        }),
        computed: {
         
        },
        props:{
          needsDialog:Boolean,
          selectedItem:{},
          needs:Array          
        },
        mounted(){
            this.$apollo.queries.donationPlaces.skip = false
            this.$apollo.queries.donationPlaces.refetch()

            this.$apollo.queries.cities.skip = false
            this.$apollo.queries.cities.refetch()

            
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
        methods: {

          

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