import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import HelloWorld from '@/components/HelloWorld'
import HelloWorld2 from '@/components/HelloWorld2'
import DonationType from '@/pages/DonationType'

// Donation Forms

import JustDonate from '@/pages/Donations/JustDonate'
import DonateSomeOne from '@/pages/Donations/DonateSomeOne'

//Users

import UsersList from '@/pages/Users/UsersList'
import UsersForm from '@/pages/Users/UsersForm'

//Donation Places

import DonationPlacesList from '@/pages/DonationPlaces/DonationPlacesList'
import DonationPlacesForm from '@/pages/DonationPlaces/DonationPlacesForm'

//Requirements

import RequirementsList from '@/pages/Requirements/RequirementsList'
import RequirementsForm from '@/pages/Requirements/RequirementsForm'

//Donors

import DonorsList from '@/pages/Donors/DonorsList'

//Delivers

import DeliversList from '@/pages/Delivers/DeliversList'
import DeliversForm from '@/pages/Delivers/DeliversForm'

//import auth from '@/utils/auth'

//Parameters

import Parameters from '@/pages/Parameters/Parameters'

Vue.use(Router)

/* eslint-disable-next-line */
function requireAuth (to, from, next) {
    const token = localStorage.getItem('authorization_token');

    if (!token) {
        next({
        path: '/login',
        query: { redirect: to.fullPath }
        })
    } else {
        next()
    }
}


export default new Router({
    base: __dirname,
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/login', component: Login, name: 'Login' },        
        { path: '/home', component: HelloWorld, name: 'Home'},
        { path: '/welcome', component: HelloWorld2, name: 'Welcome' , beforeEnter: requireAuth },
        { path: '/donationType', component: DonationType, name: 'DonationType', },
        { path: '/justDonate', component: JustDonate, name: 'JustDonate', },
        { path: '/donation', component: DonateSomeOne, name: 'DonateSomeOne', },
        { path: '/users', component: UsersList, name: 'Users', beforeEnter: requireAuth },
        { path: '/usersForm', component: UsersForm, name: 'UsersForm', beforeEnter: requireAuth },
        { path: '/parameters', component: Parameters, name: 'Parameters', beforeEnter: requireAuth },
        { path: '/donationPlaces', component: DonationPlacesList, name: 'DonationPlaces', beforeEnter: requireAuth },
        { path: '/donationPlacesForm', component: DonationPlacesForm, name: 'DonationPlacesForm', beforeEnter: requireAuth },
        { path: '/requirements', component: RequirementsList, name: 'Requirements', beforeEnter: requireAuth },
        { path: '/requirementsForm', component: RequirementsForm, name: 'RequirementsForm', beforeEnter: requireAuth },
        { path: '/donors', component: DonorsList, name: 'Donors', beforeEnter: requireAuth },
        { path: '/delivers', component: DeliversList, name: 'Delivers', beforeEnter: requireAuth },
        { path: '/deliversForm', component: DeliversForm, name: 'DeliversForm', beforeEnter: requireAuth },
        { path: '/', redirect: '/home' }
    ]
});