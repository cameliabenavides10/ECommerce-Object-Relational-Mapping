const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // (try) try this, (catch) if something fails, tell us
  try {
    // this variable will hold all of the products in the product table
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
// products: [
    // id: 4,
    // name: "Lotion",
    // category: [{
    // "Skin"
    // }]
    // ]
    // tag: [{
      // 1, 4
    // }] 
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
// ":" means it could be different values adn have the same end goal
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    // this vriable will hold the info/data for a single product based on its PK = Primary Key
    // req.params is always info in the url (id, page routes, things like that)
    const productData = await Product.findByPk(req.params.id, {
      // be sure to include its associated Category and Tag data
    });
    // if there is no productData (that id doesnt exist) then give a 404 not found and tell us no products found with that id
    if (!productData) {
      res.status(404).json({ message: 'No products found with that id!' });
      // empty returns just stop the function from running
      return;
    }
    // else if everything goes right, then give us in json format our data requested
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
 // we are gonna go into the product tablle, and create data based on the req.body(frontend/data coming in)
  Product.create(req.body)
  // take the req.body (info coming in) and do something with it...
    .then((product) => {
      // if such thing exists as tagIds(there are more then 0 tag Ids) then we want do do something
      if (req.body.tagIds.length) {
        // create a varaible that holds the value of a all of our tag ids ()
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  //find by product by its id to update using the req.body to change values
  Product.update(req.body, {
    // where just tells us how we are gonna find the product, so in our csae, by its id
    where: {
      id: req.params.id,
    },
  })
    .then(async () => {
      if (req.body.tagIds && req.body.tagIds.length) {
        // if tag id exists, create variable that holds value of all current product tags
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id }
        });
        //show us all product tags
        console.log("product Tags", productTags)  //ok
        // product tags is an array, so we just want to map through it
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        // show us the mapped product tags
        console.log("productTagIds", productTagIds);  //ok
        // setting newProductTags to the newly updated product tags, given by the body
        const newProductTags = req.body.tagIds
        // were gonna search through the new tag id values, and try to find values that are previously existing
        // if no productTagId inlcudes previous tag id
          .filter((tag_id) => !productTagIds.includes(tag_id))
          // then loop the new tag_ids and return what needs to be updated, as well as values that were pre-existing
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        console.log("newproducttags", newProductTags);
        // figure out which ones to remove

        // same thing as above, but what needs to be new --- whats above was for what doesnt need to be updated
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
        console.log("tags to remove", productTagsToRemove);
        // run both actions
        // at the same time, destory the tag ids we dont need, and add the tag ids we do need
        Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
        return res.json("Successfully updated with product tags")
      }
      return res.json("successfully updated without product tags");
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((product) => {
    res.json(product)
  })
  .catch((err) => {
    // console.log(err);
    res.status(400).json(err);
  });
});

module.exports = router;
