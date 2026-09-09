
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Order, Product, Category, Cart, CartItem
from .serializers import ProductSerializer, CategorySerializer,CartSerializer, CartItemSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer
from .models import Order
from .serializers import OrderSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.filters import SearchFilter
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str

# All Products
# @api_view(["GET"])
# def get_product(request):
#     products = Product.objects.all()
#     serializer = ProductSerializer(products, many=True)
#     return Response(serializer.data)

@api_view(["GET"])
def get_product(request):
    products = Product.objects.all()

    search = request.GET.get("search")

    if search:
        products = products.filter(
            name__icontains=search
        ) | products.filter(
            description__icontains=search
        )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# Single Product Details
@api_view(["GET"])
def get_product_details(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductSerializer(product)
    return Response(serializer.data)


# All Categories
@api_view(["GET"])
def get_category(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_cart(request):  
    cart, created = Cart.objects.get_or_create(user=None)  
    serializer = CartSerializer(cart)  
    return Response(serializer.data)

@api_view(["POST"])
def add_to_cart(request):

    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))

    cart, created = Cart.objects.get_or_create(user=None)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product_id=product_id
    )

    if created:
        item.quantity = quantity
    else:
        item.quantity += quantity

    item.save()

    return Response({
        "message": "Item added to cart",
        "cart": CartSerializer(cart).data
    })


@api_view(["POST"])
def remove_from_cart(request):  
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({"message": "Item removed from cart"})



class OrderViewSet(viewsets.ModelViewSet):

    serializer_class = OrderSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "name": user.first_name,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )




class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # একই email থাকলেও প্রথম user নিবে
        user = User.objects.filter(email=email).first()

        if user is None:
            return Response(
                {"detail": "Email not found"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Password check
        if not user.check_password(password):
            return Response(
                {"detail": "Wrong password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # JWT Token
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),

                "user": {
                    "id": user.id,
                    "name": user.first_name,
                    "email": user.email,
                }
            },
            status=status.HTTP_200_OK
        )


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Generate UID
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Generate Token
        token = default_token_generator.make_token(user)

        # Reset link
        # reset_link = (
        #     f"http://localhost:5173/reset-password/"
        #     f"{uid}/{token}/"
        # )

        reset_link = (
             f"http://localhost:5173/reset-password/"
             f"{uid}/{token}"
                       )

        # এখন temporarily console-এ link দেখাবে
        print("PASSWORD RESET LINK:")
        print(reset_link)

        return Response(
            {
                "message": "Password reset link generated successfully",
                "reset_link": reset_link
            },
            status=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uid or not token or not new_password:
            return Response(
                {
                    "error": "uid, token and new_password are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Password minimum 6 characters
        if len(new_password) < 6:
            return Response(
                {
                    "error": "Password must be at least 6 characters"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Decode UID
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except Exception:
            return Response(
                {
                    "error": "Invalid reset link"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check Token
        if not default_token_generator.check_token(user, token):
            return Response(
                {
                    "error": "Invalid or expired reset token"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password
        user.set_password(new_password)
        user.save()

        return Response(
            {
                "message": "Password reset successfully"
            },
            status=status.HTTP_200_OK
        )


    
