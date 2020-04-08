<template>
  <div>
    <v-data-table class="elevation-1" 
      v-bind:headers="headers"
      v-bind:items="items"
      v-bind:search="search"  >    
     
      <!-- table options -->      
      
      <template v-slot:item="props">
         <tr> 
          <td  v-for="(header, index) in headers" :key="index" 
              :class="[ index === 0? 'text-xs-left': 'text-xs-center', 'body-2']" >
            <div v-if="header.value!=='' && header.value!=='crudButtons'" >

                <a v-if="header.asAction"  @click=" () => header.asAction(props.item)" >
                    {{ renderData(props.item, header) }}
                </a>
                                             
               
                <span v-if="header.type !== 'relationship' && header.type !== 'image' && !header.asAction " >
                  <v-switch v-if="header.radioSelector"
                        v-model="selectedItem" :value="props.item" ></v-switch>  
                  {{ renderData(props.item, header) }}
                </span>

                <span v-if="header.type === 'relationship' " >
                  {{ solverRelationShip(props.item, header.dataSet, header.value) }}
                </span>

                <div v-if="header.type === 'image' " style="margin:0.1px" >
                  <v-img @dblclick="$emit('imageSelected', props.item)" :src="renderData(props.item, header)" aspect-ratio="3" width="350"></v-img>
                </div>

                <div v-if="header.type === 'customActions' "  style="margin:0.1px" >
                    <v-btn style="margin:5px" @click.native=" () => item.action(props.item)" color="primary" v-for="(item, index) in header.actions" v-bind:key="index" >
                      {{ item.title }}
                    </v-btn>
                </div>

            </div>
            <div v-else>            
              <v-btn class="teal iconButtons" title="editar" fab small dark @click.native="$emit('edit', props.item)">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn class="cyan iconButtons" title="eliminar" fab small @click.native="$emit('remove', props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </div>  
          </td>
        </tr>        

      </template>       
      
      <template slot="no-data">
        <span >
          <p class="pt-2 blue--text subheading">   <v-icon medium class="blue--text" >info</v-icon>Lo sentimos, aun no hay información disponible :(</p>
        </span>
      </template>
      

    </v-data-table> 
  </div>
</template>
<script>
/* eslint-disable */
export default {
  props: {
    headers: "",
    items: "",
    pagination: "",
    selectedItem: {}
  },
  data () {
    return {
      search: ""
    }
  },
  methods: {
    renderData: (item, header) => {

      try{

        let val = "";
        if (header.value.includes('.')) {
          const vals = header.value.split('.')
          val = vals.reduce((acc, val) => acc[val], item)
        } else {

          if(header.type === "image")
          {
            val = process.env.VUE_APP_SERVER_HOST+item[header.value]
          }else{
            val = item[header.value]
          }
          
        }
        if (typeof val === "boolean") {
          val = val ? "Yes" : "No";
        }
        return val;

      }catch(error){
        return ""
      }
      
    },
    solverRelationShip: (item, dataSet, property) => {
      /* eslint-disable-next-line */
      console.log(dataSet);

      const result = dataSet.filter( data => data.id === item[property] )

      try{
        return result[0].name
      }catch(e){
        return ""
      }
      

    }
  },
  computed: {
    isNotEmpty () {
      return this.items && this.items.length > 0;
    }
  }
}

/* 

  Agregar personas relacionadas a un pedido, miembros de la familia, cuantos niños menores a 17 años 
  cuantos niños menores a 5 años
  y cuantos adultos mayores

  por atender, seleccionada (parcial o total), en camino, entregado 
*/

</script>
<style>
    .iconButtons{
        margin:10px;
    }
</style>


