<style>
  .v-application--wrap{
    background-image: url('./assets/helpBackground.jpg');
    background-size: cover;
  }
  .user-link{
    background:white;
    border-radius: 25px;
  }
</style>
<template>
  <v-app>
    <v-content>
      
      <template v-if=" this.$route.name == 'Home' ">
        <HelloWorld/>
      </template>
      <template v-if=" this.$route.name == 'Login' ">
        <Login/>
      </template>
      <template v-if=" this.$route.name == 'DonationType' ">
        <DonationType/>
      </template>
      <template v-if=" this.$route.name !== 'DonationType' && this.$route.name !== 'Login' && this.$route.name !== 'Home'  ">
        <AppMenu/>
      </template>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Login from './components/Login'
import DonationType from './pages/DonationType'
import AppMenu from './components/AppMenu'

export default {
  name: 'App',

  components: {
    HelloWorld,
    Login,
    DonationType,
    AppMenu
  },

  data: () => ({
    //
  }),
};
</script>
