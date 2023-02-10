// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Categories have many Products
Category.hasMany( Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
  });

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, { // tag id sumer = 1. beach = 2  product: towel has tagId of: [1, 2]
    through: ProductTag,
    foreignKey: 'product_id',
  });

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {  
  through: ProductTag,
  foreignKey: 'tag_id',
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
