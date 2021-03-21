//build router with Express.js
const router = require('express').Router();
const { Category } = require('../../models/Category');
const { Product } = require('../../models/Product');

//Find all categories
router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ 
        model: Product,
        attributes: ['id', 'product_name', 'stock', 'category_id']
      }
    ],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a category - use post
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

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
router.put('/:id', async (req, res) => {
  // It is sending the data to the Model so that one category can be updated with new data in the database.
    const updatedCategory = await Category.update(
    {
      category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id,
      },
    }
    );
  
    res.json(updatedCategory);
  });
  // Delete route for a category with a matching id
router.delete('/:id', async (req, res) => {
    // If the database is updated successfully, what happens to the updated data below?
    // The updated data is then sent back to handler that dispatched the request.
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    
    res.json(deletedCategory);
  });


module.exports = router;
