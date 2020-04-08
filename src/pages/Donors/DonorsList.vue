<template>
  <v-container fluid>

      <TransportationDialog :transportationDialog="transportationDialog"
       :transportation="transportation" @save="saveTransportation"
       @close="closeTransportationDialog"  :transporters="transporters" :donation="donation" @assocNeed="assocNeed"   />

     <NeedsDialog :needsDialog="needsDialog" @saveNeed="saveNeed"
       :selectedItem="selectedItem" @close="closeNeedsDialog" :needs="needs" />

    <v-flex xs12>
        <v-card>
            <v-card-title>
                <span class="title"> Donantes {{ donations ? "("+ donations.length +")": ""}}
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

                    
                
            </v-card-title>

            <Loading></Loading>
            <Table  :headers="headers" :items="donations"  :pagination="pagination" ></Table>
        
        </v-card>
    </v-flex> 
    

  </v-container>
</template>
<script>

import Table from "@/components/Table.vue";
import Loading from "@/components/Loading.vue";
import TransportationDialog from "@/components/dialogs/TransportationDialog.vue"
import NeedsDialog from "@/components/dialogs/NeedsDialog.vue"
import { 
    ALL_DONATIONS_QUERY,
    ALL_DONATIONPLACES_QUERY,
    ALL_TRANSPORTERS_QUERY,
    CREATE_TRANSPORTATION_MUTATION,
    UPDATE_TRANSPORTATION_MUTATION,
    UPDATE_DONATION_MUTATION,
    ALL_NEEDS_QUERY,
    TRANSPORTATION_BY_DONATION
} from '@/graphql'

    export default {
        name: 'DonationPlacesList',
        components:{
            Table,
            Loading,
            TransportationDialog,
            NeedsDialog
        },
        created(){

            this.headers = [

                {
                    text: 'nombre',
                    left: true,
                    value: 'name'                    
                },
                { text: 'Telefono', value: 'phone' },
                { text: 'Dirección', value: 'address' },
                { text: 'Ciudad', value: 'city' },
                { text: 'Donación', value: 'description' },
                { text: 'Lugar asociado', value: 'donationPlace.name' },
                { text: 'Necesidad asoc', value: 'need.contact', asAction:this.checkNeed  },
                { text: 'Estado', value: 'state' },
                { text: 'Opciones', type:'customActions', actions:[
                    { title:"Transporte", action: this.traceTransport }
                ]}                               
                       
            ];          

        },
        mounted(){

            this.$apollo.queries.donations.skip = false
            this.$apollo.queries.donations.refetch()

            this.$apollo.queries.transporters.skip = false
            this.$apollo.queries.transporters.refetch()

            this.$apollo.queries.needs.skip = false
            this.$apollo.queries.needs.refetch()
        
        },
        data: () => ({
            headers: [],
            items:[],
            skipQuery:true,
            pagination:{},
            transportation:{  transactionNumber:null, transporter:null },
            donation:{},
            transportationDialog: false,
            needsDialog: false,
            selectedItem:{}                   
        }),
        computed: {
         
        },
        apollo:{      
            donations:{
                query:ALL_DONATIONS_QUERY,
                skip() {
                    return this.skipQuery
                }
            },
            donationPlaces:{
                query:ALL_DONATIONPLACES_QUERY,
                skip() {
                    return this.skipQuery
                }
            },
            transporters:{
                query: ALL_TRANSPORTERS_QUERY,               
                skip() {
                    return this.skipQuery
                }
            },
            needs: {
                query: ALL_NEEDS_QUERY,               
                skip() {
                return this.skipQuery
                }
            },
        },
        methods: {

            reloadData(){              
              
            },
            
            traceTransport(item){
                //eslint-disable-next-line
                console.log("trace transport",item)
                this.donation = item

                this.transportation = { transactionNumber:"" ,transporter:"" }

                this.$apollo
                    .mutate({
                        mutation: TRANSPORTATION_BY_DONATION,
                        variables: {
                        input: this.donation.id                 
                        }
                    })
                    .then(response => {

                        //eslint-disable-next-line
                        console.log("response",response)
                        
                        this.transportation = response.data.getTransportationByDonation

                        this.transportationDialog = true;

                    }).catch(error =>{
                        //eslint-disable-next-line
                        console.error("error",error)

                        this.transportationDialog = true;
                   
                    })


                
            },

            closeTransportationDialog(){
                this.transportationDialog = false;
            },

            assocNeed(){
                //eslint-disable-next-line
                console.log("asociar necesidad")
                this.needsDialog = true
            },

            saveNeed(){
                //eslint-disable-next-line
                console.log("saveNeed",this.selectedItem,this.donation)
                this.donation.need = this.selectedItem.id
                this.donation.donationPlace = this.donation.donationPlace.id     
                
                delete this.donation.__typename

                delete this.donation.state

                this.$apollo
                    .mutate({
                        mutation: UPDATE_DONATION_MUTATION,
                        variables: {
                        input: this.donation                 
                        }
                    })
                    .then(response => {

                        //eslint-disable-next-line
                        console.log("UPDATED",response)
                        this.$swal({icon:'success',title: '!Datos registrados!'})                  

                        this.$apollo.queries.donations.skip = false
                        this.$apollo.queries.donations.refetch()

                        this.$apollo.queries.needs.skip = false
                        this.$apollo.queries.needs.refetch()

                        this.needsDialog = false

                    })
                    .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                    })

            },

            closeNeedsDialog(){
                this.needsDialog = false
            },

            saveTransportation(){
                //eslint-disable-next-line
                console.log("transportation",this.transportation)

                delete this.transportation.__typename    

                this.transportation.donation = this.donation.id

                if( this.transportation.transactionNumber === "" || this.transportation.transporter === "" )
                {
                    return this.$swal({icon:'error',title: '!Llena todos los campos para continuar!'})
                }

                if (this.transportation.id) {
                    this.$apollo
                    .mutate({
                        mutation: UPDATE_TRANSPORTATION_MUTATION,
                        variables: {
                        input: this.transportation                 
                        }
                    })
                    .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados!'})
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
                        mutation: CREATE_TRANSPORTATION_MUTATION,
                        variables: {
                        input: this.transportation                 
                        }
                    })
                    .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados!'})

                    this.transportation = response.data.createTransportation

                     this.$apollo.queries.donations.skip = false
                    this.$apollo.queries.donations.refetch()

                    })
                    .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                    })
                }

                this.transportationDialog = false
            },
            checkNeed(data){
                //eslint-disable-next-line
                console.log("check data",data)
                const filteredNeed = this.needs.filter( el => data.need.id === el.id )[0]
                //eslint-disable-next-line
                console.log("filtered",filteredNeed)
                
                let html = "<strong> Info </strong><br><br>"
                html += "<ul style='list-style-type: none;' ><li>Dirección:"+filteredNeed.address+"</li>"
                html += "<li>Contacto:"+filteredNeed.contact+"</li>"
                html += "<li>Teléfono:"+filteredNeed.phone+"</li>"
                html += "<li>Descripción:"+filteredNeed.description+"</li>"
                html += "</ul>"

                this.$swal({html})
                    
            },
            cancelDonation(){
                alert("proximamente")
            },
            infoArrive(){
                alert("proximamente")
            }

        }
    };

    /* ,
                    { title:"Cancelar donación", action: this.cancelDonation } */
</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>