const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', (req, res) => {
  // find all products
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
    .then(productData => res.json(productData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
  // be sure to include its associated Category and Tag data
//   try {
//     const productData = await Product.findAll({
//       include: [{ model: Category.category_name,
//       as: 'Category' },
//     ],
//     include: [{ model: Tag.tag_name,
//       as: 'Tag' }
//     ]
//   });
//     res.status(200).json(productData);
//   } catch (err) {
//     res.status(500).json('Uh-oh. Something went wrong.');
//   }
// });

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
    .then(productData => {
      if (!productData) {
        res.status(404).json({ message: 'No product found with this id'}); 
        return; 
      }
      res.json(productData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
//   try {
//     const productData = await Product.findByPk(req.params.id, {
//       include: [{ model: Category.category_name,
//       as: 'Category'
//      }],
//     });
//     if (!productData) {
//       res.status(404).json({ message: 'No category found with that id!' });
//       return;
//     }
//     res.status(200).json(categoryData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// create new product
router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tag_id
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIDs.length) {
        const productTagIdArr = req.body.tagIDs.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(prodTagIDArray);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((prodTagIDs) => res.status(200).json(prodTagIDs))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
//  try {
//    const newProduct = await Product.create({
//      product_name: req.body.productname,
//      price: req.body.price,
//      stock: req.body.stock,
//      id: req.session.id,
//      category: req.body.category_id
//    });

//    res.status(200).json(newProduct);
//   } catch(err) {
//     res.status(400).json(err);
//   }
// });


//   Product.create(req.body)
//     .then((product) => {
//       // if there are product tags, we need to create pairings to bulk create in the ProductTag model
//       if (req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       // if no product tags, just respond
//       res.status(200).json(product);
//     })
//     .then((productTagIds) => res.status(200).json(productTagIds))
//     .catch((err) => console.error('Promise rejected:', err));
//       res.status(400).json(err);
// ;

// update product
router.put('/:id', async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const prodTagIDs = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIDs
        .filter((tag_id) => !prodTagIDs.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToDelete = productTags
        .filter(({ tag_id }) => !req.body.tagIDs.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToDelete } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// router.delete('/:id', (req, res) => {
//   // delete one product by its `id` value
// });

router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
        id: req.session.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
