from django.contrib import admin
from .models import (
    Product,
    Category,
    Cart,
    CartItem,
    Order,
    OrderItem,
)


# =========================
# CATEGORY
# =========================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )


# =========================
# PRODUCT
# =========================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "price",
        "stock",
    )


# =========================
# ORDER ITEM INLINE
# =========================
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

    readonly_fields = (
        "product",
        "quantity",
        "price",
        "total_price",
    )

    fields = (
        "selected_size",
        "product",
        "quantity",
        "price",
        "total_price",
    )


# =========================
# ORDER
# =========================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "first_name",
        "email",
        "phone_number",
        "products",
        "total_amount",
        "payment_method",
        "created_at",
    )

    list_filter = (
        "payment_method",
        "created_at",
    )

    search_fields = (
        "id",
        "email",
        "phone_number",
    )

    readonly_fields = (
        "created_at",
    )

    inlines = [
        OrderItemInline,
    ]

    def products(self, obj):
        return ", ".join(
            item.product.name
            for item in obj.items.select_related("product").all()
        )

    products.short_description = "Products"


# =========================
# CART
# =========================
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
    )


# =========================
# CART ITEM
# =========================
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart",
        "product",
        "quantity",
    )