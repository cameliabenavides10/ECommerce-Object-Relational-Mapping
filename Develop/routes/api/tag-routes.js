const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {

    const tagData = await Tag.findAll({
      include: [Product],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: {
        id: req.params.id
      },
      include: [Product]
    })
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});


router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body) // create a tag using values inserted to the body
  .then((tag) => res.status(200).json(tag)) // give response if all goes well, up the new tag
  .catch((err) => res.status(400).json(err)) // if something goes wrong, tell us what went wrong
});


router.put('/:id', (req, res) => {
  Tag.update(req.body, { // update a category where the categorys id matches the id in the url(req.params)
    where: {
      id: req.params.id // this is us telling the server what /:id means
    }
  })
  .then((tag) => res.status(200).json(tag)) // give response if all goes well, up the new category
  .catch((err) => res.status(400).json(err))
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((tag) => res.status(200).json(tag))
  .catch((err) => res.status(400).json(err))

});

module.exports = router;
