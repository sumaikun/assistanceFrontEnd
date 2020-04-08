<template>
  <v-container fluid>
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <span class="title"> Usuarios {{pagination? "("+pagination.totalItems+")": ""}}
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
            <Table  :headers="headers" :items="users"  :pagination="pagination" @edit="edit" @remove="remove"></Table>
        
        </v-card>
    </v-flex>
    
   
    <!--
    <confirm-dialog :dialog="dialog" :dialogTitle="dialogTitle" :dialogText="dialogText" @onConfirm="onConfirm" @onCancel="onCancel" ></confirm-dialog>
        <v-snackbar v-if="loading===false" :right="true" :timeout="timeout" :color="mode" v-model="snackbar" >
            {{ notice }}
            <v-btn dark flat @click.native="closeSnackbar">Close</v-btn>
        </v-snackbar>
    -->

  </v-container>
</template>
<script>

import Table from "@/components/Table.vue";
import Loading from "@/components/Loading.vue";
//import { mapState } from "vuex";
import {
    ALL_USERS_QUERY,
    ALL_DONATIONPLACES_QUERY,
    DELETE_USER_MUTATION
 } from '@/graphql'

    export default {
        name: 'UsersList',
        components:{
            Table,
            Loading
        },
        created(){

            this.headers = [
                {
                    text: 'Correo electrónico',
                    left: true,
                    value: 'email'
                },
                { text: 'Nombre', value: 'name' },
                { text: 'Apellido', value: 'lastName' },
                { text: 'Tipo de documento', value: 'documentType' },
                { text: 'número', value: 'documentNumber' },
                { text: 'Lugar de donación', value: 'donationPlace', type: 'relationship',
                    dataSet: this.donationPlaces },
                { text: 'Opciones', value: 'crudButtons', sortable: false }          
            ];

            this.pagination = {}
            this.pagination.totalItems = 0 || this.users.length;
           

        },
        mounted(){
            this.$apollo.queries.users.skip = false
            this.$apollo.queries.users.refetch()

            this.$apollo.queries.donationPlaces.skip = false
            this.$apollo.queries.donationPlaces.refetch()
        },
        data: () => ({
            headers: [],
            skipQuery: true,                            
        }),
        apollo:{
            users: {
                query: ALL_USERS_QUERY,               
                skip() {
                return this.skipQuery
                }
            },donationPlaces:{
                query:ALL_DONATIONPLACES_QUERY,
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
                this.$router.push('usersForm');
            },
            edit(item){
                /* eslint-disable-next-line*/
                console.log(item);
                this.$router.push({ name: 'UsersForm', params: { id: item.id } })
            },
            remove(item){
                /* eslint-disable-next-line*/
                console.log(item);

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
                                mutation: DELETE_USER_MUTATION,
                                variables: {
                                    input: item.id                 
                                }
                            })
                            .then(response => {
                                //eslint-disable-next-line
                                console.log("deleted",response)
                                this.$apollo.queries.users.refetch()        
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
        watch: {
            users(val){
                /* eslint-disable-next-line */
                console.log("items val",val);

                this.pagination.totalItems = val.length
            },
            donationPlaces(val){
                /* eslint-disable-next-line */
                console.log(this.headers[2],val)
                if(val.length > 0)
                {
                    this.headers[5].dataSet = val
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