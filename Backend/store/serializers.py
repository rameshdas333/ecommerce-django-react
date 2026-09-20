from rest_framework import serializers
from .models import Cart, CartItem, Product, Category, Order, OrderItem,Size,SiteSettings
from django.contrib.auth.models import User




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "size"]    


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

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
        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=True
    )

    sizes = SizeSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product
        fields = "__all__"

    class Meta:
        model = Product
        fields = "__all__"

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)   
    product_image = serializers.ImageField(source='product.image', read_only=True)  

    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = '__all__' 

class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "quantity",
            "price",
            "selected_size",
        ]

        read_only_fields = [
            "id",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True
    )

    class Meta:
        model = Order

        fields = [
            "id",

            "first_name",
            "last_name",
            "street_address",
            "apartment",
            "town_city",
            "phone_number",
            "email",

            "payment_method",

            "subtotal",
            "discount",
            "shipping_charge",
            "total_amount",
            "coupon_code",

            "status",
            "items",

            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        request = self.context.get("request")

        order = Order.objects.create(
            user=request.user,
            **validated_data
        )

        for item_data in items_data:

            product = item_data["product"]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data["quantity"],
                price=product.price,
                selected_size=item_data.get(
                    "selected_size",
                    ""
                ),
            )

        return order




from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    # Frontend থেকে "name" আসবে
    name = serializers.CharField(write_only=True)

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

    # একই email দিয়ে multiple account বন্ধ করবে
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    def create(self, validated_data):
        # name 
        name = validated_data.pop("name")

        user = User.objects.create_user(
            username=validated_data["email"],
            first_name=name,
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user

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

    def get_phone_number(self, obj):
        # First try UserProfile
        try:
            if hasattr(obj, "userprofile") and obj.userprofile.phone_number:
                return obj.userprofile.phone_number
        except Exception:
            pass

        # If profile phone is empty, get latest order phone
        order = obj.orders.order_by("-created_at").first()

        if order:
            return order.phone_number

        return ""

    def get_address(self, obj):
        # UserProfile address
        try:
            if hasattr(obj, "userprofile") and obj.userprofile.address:
                return obj.userprofile.address
        except Exception:
            pass

        # Latest order address
        order = obj.orders.order_by("-created_at").first()

        if order:
            address_parts = [
                order.street_address,
                order.apartment,
                order.town_city,
            ]

            return ", ".join(
                part for part in address_parts if part
            )

        return ""

    def get_total_orders(self, obj):
        return obj.orders.count()

    def get_total_spent(self, obj):
        from django.db.models import Sum

        total = obj.orders.aggregate(
            total=Sum("total_amount")
        )["total"]

        return total or 0

    def get_last_order_date(self, obj):
        order = obj.orders.order_by("-created_at").first()

        if order:
            return order.created_at

        return None

    def get_status(self, obj):
        if obj.is_active:
            return "Active"

        return "Inactive"

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
         
