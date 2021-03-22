//build router with Express.js
const router = require('express').Router();
const { Category, Product } = require('../../models');

//Find all categories
router.get('/', (req, res) => {
  Category.findAll({
    attributes: ['id', 'category_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  ]
})
.then(categoryData => res.json(categoryData))
.catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});

// .catch(err => {
//     console.log(err);
//     res.status(500).json(err)
// });
// });
  // find all categories
  // be sure to include its associated Products
//   try {
//     const categoryData = await Category.findAll({
//       include: [{ 
//         model: Product,
//         attributes: ['id', 'product_name', 'stock', 'category_id']
//       }
//     ],
//     });
//     res.status(200).json(categoryData);
//   } catch (err) {
//     res.status(500).json({ message: 'Sorry, no categories found.' });
//   }
// });
router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
      where: {
          id: req.params.id
      },
      attributes: ['id', 'category_name'],
      include: [
          {
              model: Product,
              attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
          }
      ]
  })
      .then(categoryData => {
          if (!categoryData) {
              res.status(404).json({ message: 'Sorry, no category found with this id.' });
              return;
          }
          res.json(categoryData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});
// router.get('/:id', async (req, res) => {
//   // find one category by its `id` value
//   // be sure to include its associated Products
//   try {
//     const categoryData = await Category.findByPk(req.params.id, {
//       include: [{ model: Product }],
//     });
//     if (!categoryData) {
//       res.status(404).json({ message: 'No category found with that id!' });
//       return;
//     }
//     res.status(200).json(categoryData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// CREATE a category - use post
router.post('/', (req, res) => {

  Category.create({
          category_name: req.body.category_name
      })
      .then(categoryData => res.json(categoryData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});
// Editing to try to stop the unhandled promise rejection error
// router.post('/', async (req, res) => {
//   try {
//     const categoryData = await Category.create(req.body);
//     res.status(200).json(categoryData);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// router.put('/:id', async (req, res) => {
//   // update a category by its `id` value
//   try {
//     const categoryData = await Category.update(req.body {
//       where: {
//         id: req.params.id,
//       },
//       individualHooks: true
//     });
//     if (!categoryData[0]) {
//       res.status(404).json({ message: 'Update failed - no category found with that id!' });
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
    // update a category by its `id` value
    Category.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(categoryData => {
            if (!categoryData[0]) {
                res.status(404).json({ message: 'Sorry, this category has not been updated.' });
                return;
            }
            res.json(categoryData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
  // Delete route for a category with a matching id

    // If the database is updated successfully, what happens to the updated data below?
    // The updated data is then sent back to handler that dispatched the request.
  //   router.delete('/:id', async (req, res) => {
  //   const deletedCategory = await Category.destroy({
  //     where: {
  //       id: req.params.id,
  //     },
  //   });
    
  //   res.json(deletedCategory);
  // });
  router.delete('/:id', (req, res) => {
    // delete a category by its `id` value
    Category.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(categoryData => {
            if (!categoryData) {
                res.status(404).json({ message: 'No category was deleted. No category found by that id.' });
                return;
            }
            res.json(categoryData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;
