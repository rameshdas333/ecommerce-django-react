from rest_framework import serializers
from .models import Cart, CartItem, Product, Category, Order, OrderItem,Size
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
    sizes = SizeSerializer(
        many=True,
        read_only=True
    )


    class Meta:
        model = Product
        fields = '__all__'

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
            "company_name",
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
            "status",
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


         
