# Justificación de embebido y referenciado

## Decisiones de modelado

- **Propiedad embebida:**

  - En el modelo `User`, la dirección (`address`) se embebe porque es información propia y dependiente del usuario, no requiere consulta independiente.
  - En el modelo `Order`, la dirección de envío (`shippingAddress`) también se embebe por la misma razón.
  - En el array `products` de `Order`, se embeben cantidad y precio para mantener el historial de la orden.

- **Propiedad referenciada:**
  - Cada `Order` tiene un único `User` (referenciado por `user`).
  - Un `User` vendedor puede tener muchos `Product` (referenciado por `seller`).
  - Un `Order` puede tener muchos `Product` y un `Product` puede estar en muchas órdenes (referenciado en el array `products` de `Order` y en el array `orders` de `Product`).

---

## Justificación de conceptos en el proyecto

### ● Uso de `populate` en el proyecto

En este proyecto, se utiliza el método `populate` de Mongoose en los controladores para obtener información relacionada de los modelos referenciados. Por ejemplo, al listar productos se pobla el campo `seller` con los datos del usuario, y al listar órdenes se poblan los campos `user` y `products.product` con información relevante.

**Ejemplo en el proyecto:**

```js
// src/controllers/product.controllers.js
const products = await ProductModel.find({ active: true }).populate(
  "seller",
  "username email"
);

// src/controllers/order.controllers.js
const orders = await OrderModel.find({ active: true })
  .populate("user", "username email")
  .populate("products.product", "name price");
```

---

### ● Eliminaciones lógicas y en cascada

- **Eliminación lógica:** En vez de borrar documentos, se actualiza un campo (`active: false`) en el modelo correspondiente (`User`, `Order`, `Product`), permitiendo mantener los datos y su historial.

- **Eliminación en cascada:** Cuando se desactiva un usuario, también se desactivan sus productos y órdenes relacionados mediante un pre-hook en el modelo de usuario.

**Ejemplo en el proyecto:**

```js
// src/models/user.model.js
UserSchema.pre("findOneAndUpdate", async function (next) {
  const userId = this.getQuery()._id;
  await require("./product.model").ProductModel.updateMany(
    { seller: userId },
    { active: false }
  );
  await require("./order.model").OrderModel.updateMany(
    { user: userId },
    { active: false }
  );
  next();
});
```

---

### ● Endpoint para agregar un nuevo vínculo en una relación muchos a muchos

En relaciones muchos a muchos (por ejemplo, productos y órdenes), se utiliza un array de referencias en los modelos. Para agregar un nuevo vínculo, se crea un endpoint que reciba los IDs y actualice ambos documentos.

**Ejemplo en el proyecto:**

```js
// src/routes/order.routes.js
router.post("/orders/:orderId/products/:productId", async (req, res) => {
  const { orderId, productId } = req.params;
  await Order.findByIdAndUpdate(orderId, {
    $addToSet: { products: productId },
  });
  await Product.findByIdAndUpdate(productId, {
    $addToSet: { orders: orderId },
  });
  res.status(200).json({ message: "Vínculo agregado correctamente" });
});
```

Este endpoint permite crear la relación entre órdenes y productos de forma dinámica.

---
