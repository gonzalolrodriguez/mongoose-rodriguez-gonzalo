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

Se eligió embebido cuando los datos dependen directamente del documento principal y no requieren consulta independiente. Se eligió referenciado cuando los datos pueden existir por separado y requieren integridad o consultas cruzadas.
