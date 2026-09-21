from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.text import slugify

from .models import (
    Cart,
    CartItem,
    Product,
    Category,
    Order,
    OrderItem,
    Size,
    SiteSettings,
)


# =========================================================
# CATEGORY SERIALIZER
# =========================================================

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"

    def create(self, validated_data):

        name = validated_data.get("name")

        if not validated_data.get("slug") and name:
            validated_data["slug"] = slugify(name)

        return Category.objects.create(
            **validated_data
        )

    def update(self, instance, validated_data):

        name = validated_data.get(
            "name",
            instance.name
        )

        if name:
            validated_data["slug"] = slugify(name)

        return super().update(
            instance,
            validated_data
        )


# =========================================================
# SIZE SERIALIZER
# =========================================================

class SizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = [
            "id",
            "size",
        ]


# =========================================================
# PRODUCT SERIALIZER
# =========================================================

class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(
        read_only=True
    )

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    sizes = SizeSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):

        return Product.objects.create(
            **validated_data
        )

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(
                instance,
                attr,
                value
            )

        instance.save()

        return instance


# =========================================================
# CART ITEM SERIALIZER
# =========================================================

class CartItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = "__all__"


# =========================================================
# CART SERIALIZER
# =========================================================

class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = "__all__"


# =========================================================
# ORDER ITEM SERIALIZER
# =========================================================

class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    total_price = serializers.SerializerMethodField(
        read_only=True
    )

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "selected_size",
            "total_price",
        ]

        read_only_fields = [
            "id",
            "price",
            "product_name",
            "product_image",
            "total_price",
        ]

    def get_total_price(self, obj):

        return float(
            (obj.price or 0)
            *
            (obj.quantity or 0)
        )


# =========================================================
# ORDER SERIALIZER
# =========================================================

class OrderSerializer(serializers.ModelSerializer):

    # =====================================================
    # CUSTOMER DETAILS
    # =====================================================

    customer_name = serializers.SerializerMethodField(
        read_only=True
    )

    customer_email = serializers.SerializerMethodField(
        read_only=True
    )

    customer_phone = serializers.SerializerMethodField(
        read_only=True
    )

    # =====================================================
    # ORDER ITEMS
    # =====================================================

    items = OrderItemSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = Order

        fields = [
            "id",

            # Customer
            "customer_name",
            "customer_email",
            "customer_phone",

            # Billing
            "first_name",
            "last_name",
            "street_address",
            "apartment",
            "town_city",
            "phone_number",
            "email",

            # Payment
            "payment_method",

            # Price
            "subtotal",
            "discount",
            "shipping_charge",
            "total_amount",
            "coupon_code",

            # Order
            "status",
            "items",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "customer_name",
            "customer_email",
            "customer_phone",
            "created_at",
        ]

    # =====================================================
    # CUSTOMER NAME
    # =====================================================

    def get_customer_name(self, obj):

        # 1. Order billing name
        name = (
            f"{obj.first_name or ''} "
            f"{obj.last_name or ''}"
        ).strip()

        if name:
            return name

        # 2. Registered user's name
        if obj.user:

            user_name = (
                f"{obj.user.first_name or ''} "
                f"{obj.user.last_name or ''}"
            ).strip()

            if user_name:
                return user_name

            # 3. Username
            if obj.user.username:
                return obj.user.username

        return "Unknown Customer"

    # =====================================================
    # CUSTOMER EMAIL
    # =====================================================

    def get_customer_email(self, obj):

        # 1. Order email
        if obj.email:
            return obj.email

        # 2. User email
        if obj.user:
            return obj.user.email or ""

        return ""

    # =====================================================
    # CUSTOMER PHONE
    # =====================================================

    def get_customer_phone(self, obj):

        # 1. Order phone
        if obj.phone_number:
            return obj.phone_number

        # 2. UserProfile phone
        if obj.user:

            try:

                profile = obj.user.userprofile

                if profile.phone_number:
                    return profile.phone_number

            except Exception:
                pass

        return ""

    # =====================================================
    # CREATE ORDER
    # =====================================================

    def create(self, validated_data):

        # Get order items
        items_data = validated_data.pop(
            "items",
            []
        )

        # Get logged-in user
        request = self.context.get(
            "request"
        )

        if request is None:
            raise serializers.ValidationError(
                "Request context is missing."
            )

        # Create order
        order = Order.objects.create(
            user=request.user,
            **validated_data
        )

        # Create order items
        for item_data in items_data:

            product = item_data.get(
                "product"
            )

            if not product:
                continue

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data.get(
                    "quantity",
                    1
                ),
                price=product.price,
                selected_size=item_data.get(
                    "selected_size",
                    ""
                ),
            )

        return order


# =========================================================
# REGISTER SERIALIZER
# =========================================================

class RegisterSerializer(serializers.ModelSerializer):

    # Frontend থেকে "name" আসবে
    name = serializers.CharField(
        write_only=True
    )

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User

        fields = [
            "id",
            "name",
            "email",
            "password",
        ]

    # =====================================================
    # VALIDATE EMAIL
    # =====================================================

    def validate_email(self, value):

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    # =====================================================
    # CREATE USER
    # =====================================================

    def create(self, validated_data):

        name = validated_data.pop(
            "name"
        )

        user = User.objects.create_user(
            username=validated_data["email"],
            first_name=name,
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user


# =========================================================
# CUSTOMER SERIALIZER
# =========================================================

class CustomerSerializer(serializers.ModelSerializer):

    phone_number = serializers.SerializerMethodField()

    address = serializers.SerializerMethodField()

    total_orders = serializers.SerializerMethodField()

    total_spent = serializers.SerializerMethodField()

    last_order_date = serializers.SerializerMethodField()

    status = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "address",
            "total_orders",
            "total_spent",
            "last_order_date",
            "status",
            "date_joined",
        ]

    # =====================================================
    # PHONE
    # =====================================================

    def get_phone_number(self, obj):

        # UserProfile
        try:

            profile = getattr(
                obj,
                "userprofile",
                None
            )

            if profile and profile.phone_number:
                return profile.phone_number

        except Exception:
            pass

        # Latest order
        order = (
            obj.orders
            .order_by("-created_at")
            .first()
        )

        if order:
            return order.phone_number

        return ""

    # =====================================================
    # ADDRESS
    # =====================================================

    def get_address(self, obj):

        # UserProfile address
        try:

            profile = getattr(
                obj,
                "userprofile",
                None
            )

            if profile and profile.address:
                return profile.address

        except Exception:
            pass

        # Latest order address
        order = (
            obj.orders
            .order_by("-created_at")
            .first()
        )

        if order:

            address_parts = [
                order.street_address,
                order.apartment,
                order.town_city,
            ]

            return ", ".join(
                part
                for part in address_parts
                if part
            )

        return ""

    # =====================================================
    # TOTAL ORDERS
    # =====================================================

    def get_total_orders(self, obj):

        return obj.orders.count()

    # =====================================================
    # TOTAL SPENT
    # =====================================================

    def get_total_spent(self, obj):

        from django.db.models import Sum

        total = (
            obj.orders
            .aggregate(
                total=Sum("total_amount")
            )
            ["total"]
        )

        return total or 0

    # =====================================================
    # LAST ORDER DATE
    # =====================================================

    def get_last_order_date(self, obj):

        order = (
            obj.orders
            .order_by("-created_at")
            .first()
        )

        if order:
            return order.created_at

        return None

    # =====================================================
    # CUSTOMER STATUS
    # =====================================================

    def get_status(self, obj):

        if obj.is_active:
            return "Active"

        return "Inactive"


# =========================================================
# SITE SETTINGS SERIALIZER
# =========================================================

class SiteSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = SiteSettings

        fields = [
            "id",
            "user_logo",
            "admin_logo",
            "sidebar_logo",
            "banner_1",
            "banner_2",
            "banner_3",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "updated_at",
        ]