import {ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache} from "@apollo/client/core";
import axios from "axios";

async function getNewToken() {
    let response;
    const token = localStorage.getItem('OAuthToken');
    const expireTime = localStorage.getItem('OAuthTokenExpireTime');
    if(!token || Date.now() < expireTime - 864000){
        response = await axios({
            headers:{
                'Content-Type': "application/x-www-form-urlencoded"
            },
            method: 'post',
            data: {
                grant_type: "client_credentials"
            },
            url: 'https://cn.fflogs.com/oauth/token',
            auth: {
                username: '98a68ac5-73a9-4591-9b50-071464ecac36',
                password: '5fGXsGCdbDhifkim5MZbCn7QzxoC8HJUdNHhvK28'
            }
        })
        localStorage.setItem('OAuthToken',response.data.access_token)
        localStorage.setItem('OAuthTokenExpireTime',Date.now() + response.data.expires_in)
        console.log(response)
    }
    return response;
}

getNewToken();

const httpLink = createHttpLink({
    uri: "https://cn.fflogs.com/api/v2/client"
})

const auth = new ApolloLink((operation,forward) => {
    const token = localStorage.getItem('OAuthToken');
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : ""
        }
    });
    return forward(operation);
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    link: concat(auth, httpLink),
    cache
})

export default apolloClient