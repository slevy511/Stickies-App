# How to use the Stickies API

### Table of Contents
- [Intro to APIs](#what-is-an-api)
- [Understanding the Express Code](#understanding-the-api-code)
- [Express Routing Parameters](#express-routing-parameters)
- [Calling API from React Frontend](#how-to-call-the-api-in-the-react-frontend)

### What is an API?
**API (Application Programming Interfaces)**: A set of commands and functions that programmers can use to interact with an external system
In this case, our external system is the MongoDB database containing the user info, note info, and board info. The React application will be using this API to communicate with the MongoDB database. 

**Example: The API as a Menu**
Let's say you're at a restaurant and you start going in the kitchen and cooking your own meal. The chefs would be shocked! They are certain things they'll let you buy, and other things that are off limits to the customers. 

*How do restaurants tell you what you can and cannot access?*

They would do that by providing you a menu! This menu includes things you can buy such as sandwiches, pizza, and coffee. 
An API is just like a menu. For a weather API like OpenWeatherMap, the kind of data you can access include things like temperature, weather conditions, weather images, atmospheric pressure, etc... whereas other data will be off-limits to the public. 

### Understanding the API Code
Let's take a look at the function inside `server.js`:
```
app.get('/api/all-users', function(req, res) {
    User.find(function(err, users) {
        // this code retrieves all user objects
        if (err) {
            console.log(err)
            res.send("Error!")
        }
        else {
            // users is an array of JavaScript user objects
            res.send(users)
        }
    })
})
```
**There are two kinds of express HTTP requests:**
`app.get()` and `app.post()`
Post requests are used to send data
Get requests are used to retrieve data
In this case, it's a get request, so we're retrieving data from the server
Inside the function, we see some Mongoose code that gives us an array of all users. 
So every time we call this API endpoint, we get the array of all users. 

Get requests can be accessed by visiting the domain + the route.
So for example, you can visit: `localhost:8000/api/all-users` and see an array user objects
Post requests cannot be accessed this way!

### Express Routing Parameters
Now how do we pass arguments into our API routes? Say for example you wanted to search for a specific user via username
```
app.get('/api/search-user/:username', function(req, res) {
    // returns user object that matches the username argument
    
    // retrieve the username argument from the route
    const searchUsername = req.params.username

    // sends back the user object that matches the username, error otherwise
    User.findOne({username: searchUsername}, function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(foundUser)
        }
    })
})
```
So if we go to `localhost:8000/api/search-user/kevz21`
It will return a user object that matches the username `kevz21` (assuming it exists)

**Let's look at a POST request**
```
app.post('/api/add-users/:username/:password', function(req, res) {
    // creating a user

    // getting the values of express parameters
    const newUsername = req.params.username
    const newPassword = req.params.password

    const newUser = new User({
        username: newUsername,
        password: newPassword
    })
    
    // save document into database. If no error, send success, otherwise send the error back
    newUser.save(function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success!")
        }
    })
});
```
As you can see, very similar to the get request above.
But... you cannot call this function by typing `localhost:8000/api/add-users/kevz21/agoodpassword` in your browser
since visiting a webpage in a browser always specifies a GET request

### How to call the API in the React Frontend
At the top of the React file, import the module:
```
import Axios from "axios"
```
`axios` should be installed already. If not, run `npm install axios` in client directory

**What is axios?**
An HTTP client that allows Javascript Apps to call APIs and retrieve their data. 

**Example: Searching User via Username**
Let's say we wanted to search a user via username

You may think you can get away with something like this:
```
const response = Axios.get(serverHost + "api/search-user/" + username)
console.log(response.data)
```
But console log throws an `undefined` error. 
Why?
This is because the previous line `const response = await Axios.get(...)` takes time! Javascript doesn't know to wait for this to finish executing before taking the value of the variable. 

To solve this, we put it in an async function and use the keyword await to tell Javascript to wait for the `await` line to finish executing before printing out the response object. 

```
async function search() {
  const response = await Axios.get(serverHost + "api/search-user/" + username)
  console.log(response.data)
}
// call async function immediately after
search()
```

TLDR:
If you want to access the value of an API get or post request, you must bundle all the code inside an `async` function





