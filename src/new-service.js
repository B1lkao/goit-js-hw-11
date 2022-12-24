import axios from "axios";
export default class NewAPIService{

    constructor() {  
}
   fetchArticles(BASE_URL, KEY, options, value, page){
       axios.get(`${BASE_URL}?${KEY}&${options}&q=${value}&page=${page}&per_page=40`)
           .then(res => {
               console.log(res.data.hits)
               return res.data.hits
            })
   
    }
    
}