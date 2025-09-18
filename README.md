# Justificación de embebido y referenciado

## Decisiones de modelado

- **Propiedad embebida:**

  - En el modelo `User`, la dirección (`address`) se embebe porque es información propia y dependiente del usuario, no requiere consulta independiente.
  - En el modelo `Order`, la dirección de envío (`shippingAddress`) también se embebe por la misma razón.
  - En el array `products` de `Order`, se embeben cantidad y precio para mantener el historial de la orden.

- **Relación 1:1:**

  - Cada `Order` tiene un único `User` (referenciado por `user`).

- **Relación 1:N:**

  - Un `User` vendedor puede tener muchos `Product` (referenciado por `seller`).

- **Relación N:M:**
  - Un `Order` puede tener muchos `Product` y un `Product` puede estar en muchas órdenes (referenciado en el array `products` de `Order`).

---

## Justificación de conceptos en el proyecto

### ● Uso de `populate` desde colecciones sin referencias

En este proyecto, si una colección (por ejemplo, `Profile`) no tiene referencias directas (`ObjectId`) a otra colección (`User`), no se puede usar el método `populate` de Mongoose. En su lugar, se realiza una consulta manual: primero se obtiene el documento principal y luego, usando un campo identificador (como `userId`), se consulta la colección relacionada.

**Ejemplo en el proyecto:**

```js
// src/controllers/profile.controllers.js
const profile = await Profile.findOne({ userId: someId });
const user = await User.findById(profile.userId);
```

Esto simula el comportamiento de `populate` cuando no existen referencias directas en el esquema.

---

### ● Eliminaciones lógicas y en cascada

- **Eliminación lógica:** En vez de borrar documentos, se actualiza un campo (por ejemplo, `isDeleted: true`) en el modelo correspondiente (`User`, `Order`, etc.), permitiendo mantener los datos y su historial.

- **Eliminación en cascada:** Cuando se elimina lógicamente un documento principal (por ejemplo, un usuario), también se marcan como eliminados los documentos relacionados (por ejemplo, sus órdenes).

**Ejemplo en el proyecto:**

```js
// src/controllers/user.controllers.js
await User.findByIdAndUpdate(userId, { isDeleted: true });
await Order.updateMany({ user: userId }, { isDeleted: true });
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
