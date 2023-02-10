const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  try {

    const categoryData = await Category.findAll({
      include: [Product],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const categoryData = await Category.findOne({
      where: {
        id: req.params.id
      },
      include: [Product]
    })
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body) // create a category using values inserted to the body
  .then((category) => res.status(200).json(category)) // give response if all goes well, up the new category
  .catch((err) => res.status(400).json(err)) // if something goes wrong, tell us what went wrong
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, { // update a category where the categorys id matches the id in the url(req.params)
    where: {
      id: req.params.id // this is us telling the server what /:id means
    }
  })
  .then((category) => res.status(200).json(category)) // give response if all goes well, up the new category
  .catch((err) => res.status(400).json(err))
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((category) => res.status(200).json(category))
  .catch((err) => res.status(400).json(err))
});

module.exports = router;
