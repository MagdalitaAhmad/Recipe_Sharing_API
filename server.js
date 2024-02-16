//import all needed modules and library 
const express = require('express');
const app = express();
const recipeSchema = require('./models/recipes')
const mongoose = require('mongoose');

//middle ware
app.use(express.json());

//to test if port is working
app.get('/', (req, res)=>{
    res.send('Test....');
});


// to post or create recipe
app.post('/api/recipe', async (req, res)=>{
    try{
        const addRecipe = await recipeSchema.create(req.body)
        res.status(200).json(addRecipe)
    } catch (error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})


//get all the recipe
app.get('/api/recipe', async(req, res) => {
    try {
        const getrecipe = await recipeSchema.find({});
        res.status(200).json(getrecipe)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
})


//to get the recipe based on id
app.get('/api/recipe/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipeSchema.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error("Error retrieving recipe:", error);
        res.status(500).json({ message: "An error occurred while retrieving the recipe. Please try again later." });
    }
});


//get the recipe by name
app.get('/api/recipe/recipeName/:recipeName', async (req, res) => {
    try {
        let recipename = req.params.recipeName;
        
        // para makapag search parin ng recipe kahit may space sa route 
        recipename = recipename.replace(/\s/g, '\\s*');

        const regex = new RegExp(recipename, 'i'); // Construct a case-insensitive regular expression
        const recipes = await recipeSchema.find({ recipeName: { $regex: regex } });


        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(200).json(recipes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



//get the revipe by ingredients
app.get('/api/recipe/ingredients/:ingredient', async (req, res) => {
    try {
        const ingredient = req.params.ingredient;
        
        const recipes = await recipeSchema.find({ ingredients: { $regex: new RegExp(ingredient, 'i') } });

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: "Recipes not found" });
        }

        res.status(200).json(recipes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



// edit or update a recipe by id
app.put('/api/recipe/:id', async(req,res) => {
    try {
        //get the id
        const recipeId = req.params.id;
        //serch for the id
        const updateRecipe = await recipeSchema.findById(recipeId);
        //if condition to return if the the recipe is not found with the id entered
        if (!updateRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        //to update the data
        updateRecipe.recipeName = req.body.recipeName;
        updateRecipe.ingredients = req.body.ingredients;
        updateRecipe.instruction = req.body.instruction;

        await updateRecipe.save();

        res.status(200).json(updateRecipe);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


//edit or update recipe by name
app.put('/api/recipe/recipeName/:recipeName', async (req, res) => {
    try {
        const recipename = req.params.recipeName;
        const regex = new RegExp(recipename, 'i');
        const updateRecipe = await recipeSchema.findOne({ recipeName: { $regex: regex } });


        if (!updateRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        //to update the data
        updateRecipe.recipeName = req.body.recipeName;
        updateRecipe.ingredients = req.body.ingredients;
        updateRecipe.instructions = req.body.instructions;

        await updateRecipe.save();

        res.status(200).json(updateRecipe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



// delete a recipe using id
app.delete('/api/recipe/:id', async(req,res) => {
    try {
        //get the id
        const recipeId = req.params.id;
        //serch for the id and delete 
        const deleterecipe = await recipeSchema.findByIdAndDelete(recipeId);
        //if condition to return if the the recipe is not found with the id entered
        if (!deleterecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        //send back the response to the client
        res.status(200).json("Successfully deleted the recipe!!");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


//edit or update recipe by name
app.delete('/api/recipe/recipeName/:recipeName', async (req, res) => {
    try {
        const recipename = req.params.recipeName;
        const regex = new RegExp(recipename, 'i'); // Construct a case-insensitive regular expression
        const deleterecipe = await recipeSchema.findOneAndDelete({ recipeName: { $regex: regex } });


        if (!deleterecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }


        res.status(200).json("Recipe Successfully Deleted");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});




//to initialize port
const port = process.env.PORT || 3000;
//to connect to the data base
mongoose.connect('mongodb+srv://magdalitaahmad93:bIFNH9q2MfgMPduV@cluster0.lt6ddot.mongodb.net/Node-API?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB ...');
        app.listen(port, ()=> {console.log(`Now listening to ${port} ...`)})
    })
    
    .catch((error) => {
        console.log(error);
    });