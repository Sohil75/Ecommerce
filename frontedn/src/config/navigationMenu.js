export const navigation = {
    categories: [
      {
        id: 'women',
        name: 'Women',
       
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Tops', id:"top" },
              { name: 'Dresses', id:"women_dress"},
              { name: 'Women Jeans', id: 'women_jeans' },
              { name: 'Jackets', id: 'jacket' },
              { name: 'Gouns', id: 'gouns' },
              { name: 'Sarees', id: 'saree' },
            ],
          },
          
          
        ],
      },
      {
        id: 'men',
        name: 'Men',
       
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Mens Kurtas', id: 'mens_kurta' },
              { name: 'Shirt', id: 'shirt' },
              { name: 'Men Jeans', id: 'men_jeans' },
              { name: 'Sweaters', id: 'sweaters' },
              { name: 'T-Shirts', id: 't-shirt' },
            ],
          },
        ],
      },
    ],
    pages: [
      { name: 'Company', id: '/' },
      { name: 'Stores', id: '/' },
    ],
  }