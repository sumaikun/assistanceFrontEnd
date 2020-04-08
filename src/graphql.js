import gql from 'graphql-tag'

//Login
export const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
    login(input:$input){
        access_token,
        role
    }
  }`
//Users
  export const ALL_USERS_QUERY = gql`
  query users {
    users {
      id
      email
      name
      lastName
      documentType
      documentNumber
      role
      donationPlace
    }
  }`

  export const CREATE_USER_MUTATION = gql`
  mutation  createUser($input: UsersInput!) {
    createUser(input:$input){
      id
      name
      email
      lastName
      documentType
      documentNumber
      role
      donationPlace
    }
  }`

  export const UPDATE_USER_MUTATION = gql`
  mutation  updateUser($input: UpdateUsersInput!) {
    updateUser(input:$input)
  }`

  export const USER_QUERY = gql`
  query user($input: String!) {
    user(input: $input) {
      id
      name
      email
      lastName
      documentType
      documentNumber
      role
      donationPlace
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation deleteUserByID($input: String!) {
    deleteUserByID(input: $input)
  }
`
//Cities

export const ALL_CITIES_QUERY = gql`
  query cities {
    cities {
      id
      name
    }
  }`

  
  export const CREATE_CITY_MUTATION = gql`
  mutation  createCity($input: CitiesInput!) {
    createCity(input:$input){
      id
      name      
    }
  }`

  export const UPDATE_CITY_MUTATION = gql`
  mutation  updateCity($input: UpdateCitiesInput!) {
    updateCity(input:$input)
  }`

  export const CITY_QUERY = gql`
  query city($input: String!) {
    city(input: $input) {
      id
      name      
    }
  }
`

export const DELETE_CITY_MUTATION = gql`
  mutation deleteCityByID($input: String!) {
    deleteCityByID(input: $input)
  }
`

//DonationPlaces

export const ALL_DONATIONPLACES_QUERY = gql`
  query donationPlaces {
    donationPlaces {
      id
      name
      address
      city
      picture
      contact
      phone
    }
  }`


export const CREATE_DONATIONPLACE_MUTATION = gql`
mutation  createDonationPlace($input: DonationPlacesInput!) {
  createDonationPlace(input:$input){
    id
      name
      address
      city
      picture
      contact
      phone        
  }
}`

export const UPDATE_DONATIONPLACE_MUTATION = gql`
mutation  updateDonationPlace($input: UpdateDonationPlacesInput!) {
  updateDonationPlace(input:$input)
}`

export const DONATIONPLACE_QUERY = gql`
query donationPlace($input: String!) {
  donationPlace(input: $input) {
    id
    name
    address
    city
    picture
    contact
    phone          
  }
}
`

export const DELETE_DONATIONPLACE_MUTATION = gql`
mutation deleteDonationPlaceByID($input: String!) {
  deleteDonationPlaceByID(input: $input)
}
`

//Needs

export const ALL_NEEDS_QUERY = gql`
  query needs {
    needs {
      id
      address
      contact
      city
      phone
      description
      donationPlace
      state,
      peopleNeeded,
      childrenNeeded,
      documentType
      documentNumber
    }
  }`

export const CREATE_NEED_MUTATION = gql`
mutation  createNeed($input: NeedsInput!) {
  createNeed(input:$input){
    id
    address
    contact
    city
    phone
    description
    donationPlace
    state,
    peopleNeeded,
    childrenNeeded,
    documentType
      documentNumber      
  }
}`

export const UPDATE_NEED_MUTATION = gql`
mutation  updateNeed($input: UpdateNeedsInput!) {
  updateNeed(input:$input)
}`

export const NEED_QUERY = gql`
query need($input: String!) {
  need(input: $input) {
    id
    address
    contact
    city
    phone
    description
    donationPlace
    state,
    peopleNeeded,
    childrenNeeded,
    documentType
      documentNumber      
  }
}
`

export const NEED_QUERY_BY_DOCUMENT = gql`
mutation getByDocumentNumber($input: String!) {
  getByDocumentNumber(input: $input) {
    id
    address
    contact
    city
    phone
    description
    donationPlace
    state,
    peopleNeeded,
    childrenNeeded,
    documentType
      documentNumber    
  }
}
`

export const DELETE_NEED_MUTATION = gql`
mutation deleteNeedByID($input: String!) {
  deleteNeedByID(input: $input)
}
`

//Transporters

export const ALL_TRANSPORTERS_QUERY = gql`
  query transporters {
    transporters {
      id
      name
    }
  }`

  
  export const CREATE_TRANSPORTER_MUTATION = gql`
  mutation  createTransporter($input: TransportersInput!) {
    createTransporter(input:$input){
      id
      name      
    }
  }`

  export const UPDATE_TRANSPORTER_MUTATION = gql`
  mutation  updateTransporter($input: UpdateTransportersInput!) {
    updateTransporter(input:$input)
  }`

  export const TRANSPORTER_QUERY = gql`
  query transporter($input: String!) {
    transporter(input: $input) {
      id
      name      
    }
  }
`

export const DELETE_TRANSPORTER_MUTATION = gql`
  mutation deleteTransporterByID($input: String!) {
    deleteTransporterByID(input: $input)
  }
`
//Donations

export const ALL_DONATIONS_QUERY = gql`
  query donations {
    donations {
      id
      name
      address
      city
      phone
      description
      state
      donationPlace {
        id
        name
      }
      need {
        id
        contact
      }
    }
  }`

  
  export const CREATE_DONATION_MUTATION = gql`
  mutation  createDonation($input: DonationsInput!) {
    createDonation(input:$input){
      id
          
    }
  }`

  export const UPDATE_DONATION_MUTATION = gql`
  mutation  updateDonation($input: UpdateDonationsInput!) {
    updateDonation(input:$input)
  }`

  export const DONATION_QUERY = gql`
  query donation($input: String!) {
    donation(input: $input) {
      id
      name
      address
      city
      phone
      description
      donationPlace
      need      
    }
  }
`

export const DONATION_QUERY_BY_NEED = gql`
  mutation getDonationByNeed($input: String!) {
    getDonationByNeed(input: $input) {
      id            
    }
  }
`

export const DELETE_DONATION_MUTATION = gql`
  mutation deleteDonationByID($input: String!) {
    deleteDonationByID(input: $input)
  }
`

//Transportations

export const ALL_TRANSPORTIONS_QUERY = gql`
  query transportations {
    transportations {
      id
      transporter
      transactionNumber
      donation
    }
  }`

  
  export const CREATE_TRANSPORTATION_MUTATION = gql`
  mutation createTransportation($input: TransportationsInput!) {
    createTransportation(input:$input){
      id
      transporter
      transactionNumber
      donation     
    }
  }`

  export const UPDATE_TRANSPORTATION_MUTATION = gql`
  mutation updateTransportation($input: UpdateTransportationsInput!) {
    updateTransportation(input:$input)
  }`

  export const TRANSPORTATION_QUERY = gql`
  query transportation($input: String!) {
    transportation(input: $input) {
      id
      transporter
      transactionNumber
      donation      
    }
  }
`

export const TRANSPORTATION_BY_DONATION = gql`
  mutation getTransportationByDonation($input: String!) {
    getTransportationByDonation(input: $input) {
      id
      transporter
      transactionNumber
      donation      
    }
  }
`

export const DELETE_TRANSPORTATION_MUTATION = gql`
  mutation deleteTransportationByID($input: String!) {
    deleteTransporterByID(input: $input)
  }
`

//Delivers

export const ALL_DELIVERS_QUERY = gql`
  query delivers {
    delivers {
      id
      donation{
        id
        name
        phone
        description
        address
      }
      need{
        id
        contact
        address
        phone
        description
      }
      donationPlace{
        id
        name
      }
      description
      pictures
    }
  }`

  
  export const CREATE_DELIVER_MUTATION = gql`
  mutation createDeliver($input: DeliversInput!) {
    createDeliver(input:$input){
      id
         
    }
  }`

  export const UPDATE_DELIVER_MUTATION = gql`
  mutation updateDeliver($input: UpdateDeliversInput!) {
    updateDeliver(input:$input)
  }`

  export const DELIVER_QUERY = gql`
  query deliver($input: String!) {
    deliver(input: $input) {
      id
      donation{
        id
        name
      }
      need{
        id
        contact
        address
        phone
        description
      }
      donationPlace{
        id
        name
      }
      description
      pictures    
    }
  }
`

export const DELETE_DELIVER_MUTATION = gql`
  mutation deleteDeliverByID($input: String!) {
    deleteDeliverTransporterByID(input: $input)
  }
`