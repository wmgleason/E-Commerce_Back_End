const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }
    ]
  })
    .then(tagData => res.json(tagData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }
    ]
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({ message: 'No tag found with this id'});
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name
  })
    .then(tagData => res.json(tagData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});


// router.put('/:id', (req, res) => {
//   // update a tag's name by its `id` value
//   try {
//     const tagData = await Tag.update(req.body {
//       where: {
//         id: req.params.id,
//       },
//       individualHooks: true
//     });
//     if (!tagData[0]) {
//       res.status(404).json({ message: 'Update failed - no tag found with that id!' });
//       return;
//     }
//     res.status(200).json(categoryData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// This action method is the Controller. It accepts input and sends data to the Model and the View.
  // It is sending the data to the Model so that one category can be updated with new data in the database.
  router.put('/:id', (req, res) => {
    // update a tag's name by its `id` value
    Tag.update(req.body, {
      where: {
          id: req.params.id
      }
    })
      .then(dbTagData => {
          if (!dbTagData[0]) {
              res.status(404).json({ message: 'No tag found with this id'});
              return;
          }
          res.json(dbTagData);
    })
    // If the database is updated successfully, what happens to the updated data below?
    // The updated data is then sent back to handler that dispatched the request.
      .catch(err => {
          console.log(err); 
          res.status(500).json(err);
    });
  
  });
    

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: 'Sorry, no tag was found with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
