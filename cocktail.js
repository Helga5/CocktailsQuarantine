

// Creating a xhr object
const xhr = new XMLHttpRequest();
// Creating a const variable with the url
const url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
// Changing the api response type to JSON
xhr.responseType = "json";
// When the api responds
xhr.onreadystatechange = function() {
    // If it was a success
    if (xhr.readyState == XMLHttpRequest.DONE) {
        // Putting the JSON obj into result
        let result = xhr.response;
        // Send result to render
        renderResult(result);
    }
};
// Renders the data from the cocktail db api into html
function renderResult(result) {
    console.log(result);
    // Putting the JSON into an object
    let drink = result.drinks[0];
    // Grabbing the name from the JSON and putting it into name
    let name = drink.strDrink;
    // Grabbing the image url and putting it into imageSrc
    let imageSrc = drink.strDrinkThumb;
    // Creating an array of all ingredients called ingredientList
    var ingredientList = [
        drink.strIngredient1,
        drink.strIngredient2,
        drink.strIngredient3,
        drink.strIngredient4,
        drink.strIngredient5,
        drink.strIngredient6,
        drink.strIngredient7,
        drink.strIngredient8,
        drink.strIngredient9,
        drink.strIngredient10,
        drink.strIngredient11,
        drink.strIngredient12,
        drink.strIngredient13,
        drink.strIngredient14,
        drink.strIngredient15
    ];
    // Creating an html element for all ingredients to be added to
    // Initializing it with the first ingredient in ingredientsList
    var ingredients = "<li>" + ingredientList[0] + "</li>";
    // Iterating through Ingredients list
    for (var x = 1; x < ingredientList.length; x++) {
        // If the ingredient isn't null
        if (ingredientList[x]) {
            // Adding a li element to ingredients with ingredient from list at x
            ingredients += "<li>" + ingredientList[x] + "</li>";
        }
    }
    // Grabs the drink instructions and puts them into instructions
    let instructions = drink.strInstructions;

    // Creates string of HTML with all drink data
    let cocktail = `<text class = "name">${name}</text>
         <img src = "${imageSrc}" class = "image">
         <div class = "info">
         <ul class = "ingredients">${ingredients}</ul>
         <text class = "instructions">${instructions}</text>
         </div>`;
    // Log drink name into console for testing
    console.log(name);
    // Add the cocktail obj to the maincontainer in html
    $(".cocktail-container").html(cocktail);
}
// Make request for data from Cocktail DB
function getCocktail() {
    xhr.open("GET", url);
    xhr.send();
}


// When the refresh button is clicked
$(".refresh-button").on("click", function() {
    getCocktail();
});
