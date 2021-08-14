import { Product } from '../src/product/models/product.entity';
import { createConnection } from 'typeorm';
import { products } from './products';
(async () => {
  const connection = await createConnection({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    entities: [Product],
  });

  const data = connection.getRepository('product').create(products);
  await connection.getRepository('product').save(data);
})();
