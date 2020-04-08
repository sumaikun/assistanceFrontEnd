<template>
  <v-container fluid>

    <DonationDialog :donationDialog="donationDialog" :cities="cities" :donation="donation" 
     @close="closeDonationDialog"  @save="saveDonation" />

    <v-row justify="center">   

      <v-expansion-panels popout>
        
        <v-expansion-panel
          v-for="(message, i) in messages"
          :key="i"
          hide-actions
        >
          <v-expansion-panel-header>
            <v-row
              align="center"
              class="spacer"
              no-gutters
            >
              <v-col
                cols="4"
                sm="2"
                md="1"
              >
                <v-avatar
                  size="36px"
                >
                  <img
                    v-if="message.avatar"
                    alt="Avatar"
                    :src="message.avatar"
                  >
                  <v-icon
                    v-else
                    :color="message.color"
                    v-text="message.icon"
                  ></v-icon>
                </v-avatar>
              </v-col>

              <v-col
                class="hidden-xs-only"
                sm="5"
                md="3"
              >
                <strong v-html="message.name"></strong>
                <span
                  v-if="message.total"
                  class="grey--text"
                >
                  &nbsp;({{ message.total }})
                </span>
              </v-col>

              <v-col
                class="text-no-wrap"
                cols="5"
                sm="3"
              >
                <v-chip
                  v-if="message.new"
                  :color="`${message.color} lighten-4`"
                  class="ml-0 mr-2 black--text"
                  label
                  small
                >
                  {{ message.new }} 
                </v-chip>
                <strong v-html="message.title"></strong>
              </v-col>

              <v-col
                v-if="message.excerpt"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                &mdash;
                {{ message.excerpt }}
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text v-text="message.description"></v-card-text>
            <strong>{{message.subdescription}}</strong>
            <br><br>
            <v-btn class="mr-4" @click="solve(message)">Resolver Necesidad</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>

import DonationDialog  from "@/components/dialogs/DonationDialog"

import {
    ALL_NEEDS_QUERY,
    ALL_CITIES_QUERY,
    ALL_DONATIONPLACES_QUERY,
    CREATE_DONATION_MUTATION
} from '@/graphql'

  export default {
    components:{
      DonationDialog
    },
    mounted(){
      this.$apollo.queries.needs.skip = false
      this.$apollo.queries.needs.refetch()

      this.$apollo.queries.donationPlaces.skip = false
      this.$apollo.queries.donationPlaces.refetch()

    },
    methods:{
      solve(data){
        //eslint-disable-next-line
        console.log(data)
        this.donationDialog = true
        this.subdata = data

      },
      closeDonationDialog(){
        this.donationDialog = false
      },
      saveDonation(){

        //eslint-disable-next-line
        console.log(this.donation,this.subdata)
        if(this.donation.name === null || this.donation.phone === null || this.donation.address === null ||
             this.donation.city === null  ){
            return this.$swal({icon:'error',title: '!Por favor pon todos los datos!'})
        }

        this.donation.description = this.subdata.description

        this.donation.donationPlace = this.subdata.donationPlace

        this.donation.need = this.subdata.need

        this.$apollo
                .mutate({
                    mutation: CREATE_DONATION_MUTATION,
                    variables: {
                        input: this.donation                 
                    }
                })
                .then(response => {
                    //eslint-disable-next-line
                    console.log("created",response)
                    this.$swal({icon:'success',title: '!Datos registrados, MUCHAS GRACIAS POR SU CONTRIBUCIÓN !'})
                    this.donation = { name:null, phone:null, address:null, description:null, city:null, donationPlace:null }
                })
                .catch(error =>{
                    //eslint-disable-next-line
                    console.error("created",error)
                    this.$swal({icon:'error',title: '!Hay error en la conexión con el servidor!'})
                })


      }
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
    data: () => ({
      skipQuery:true,
      imagePath:process.env.VUE_APP_SERVER_HOST,
      donationDialog: false,
      messages:[],
      donation:{ name:null, phone:null, address:null, city:null },
      subdata:{}
      /*messages: [
        {
          avatar: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
          name: 'John Leider',
          title: 'Welcome to Vuetify.js!',
          excerpt: 'Thank you for joining our community...',
        },
        {
          color: 'red',
          icon: 'people',
          name: 'Social',
          new: 1,
          total: 3,
          title: 'Twitter',
        },
        {
          color: 'teal',
          icon: 'local_offer',
          name: 'Promos',
          new: 2,
          total: 4,
          title: 'Shop your way',
          exceprt: 'New deals available, Join Today',
        },
      ],*/
      //lorem: 'Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.',
    }),
    
    watch:{
        needs(val){
            /* eslint-disable-next-line */
            //console.log("items val",val);
            this.messages = []

            val.forEach(element => {
              if(element.state === 'REGISTERED'  || element.state === 'PARTIAL_SOLVED')
              {
                this.messages.push({
                  avatar:element.donationPlace,
                  name:element.contact,
                  title:element.phone,
                  description:element.description,
                  subdescription:"Personas del nucleo familiar: "+element.peopleNeeded+"   Menores de edad "+element.childrenNeeded,
                  excerpt:element.donationPlace,
                  new:element.state,
                  donationPlace:element.donationPlace,
                  need:element.id              
                })
              }
              
            });
           
        },
        donationPlaces(val){
          let key = 0
          this.messages.forEach(data =>{
            const donationPlaceF =  val.filter( elem => elem.id === data.avatar  )[0]
            //eslint-disable-next-line
            console.log("donationPlaceF",donationPlaceF)
            this.messages[key].avatar = this.imagePath+donationPlaceF.picture
            //eslint-disable-next-line
            //console.log(this.messages)
            this.messages[key].excerpt =  donationPlaceF.name+" ,"+donationPlaceF.address
            key++
          })
        }
    }   
  }
</script>