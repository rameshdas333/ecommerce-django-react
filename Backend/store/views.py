
from datetime import timedelta
from rest_framework.pagination import PageNumberPagination
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import (
    Count,
    DecimalField,
    ExpressionWrapper,
    F,
    Sum,
    Q,
)
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_decode,
    urlsafe_base64_encode,
)
from django.contrib.auth.tokens import default_token_generator

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Cart,
    CartItem,
    Category,
    Order,
    OrderItem,
    Product,
    SiteSettings,
)
from .serializers import (
    CartItemSerializer,
    CartSerializer,
    CategorySerializer,
    CustomerSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    SiteSettingsSerializer,
)


# =========================================================
# ALL PRODUCTS
# =========================================================

@api_view(["GET", "POST"])
def get_product(request):

    # GET - All Products
    if request.method == "GET":
        products = Product.objects.all()

        search = request.GET.get("search")

        if search:
            products = (
                products.filter(name__icontains=search)
                | products.filter(description__icontains=search)
            )
        # Pagination
        paginator = PageNumberPagination()
        # paginator.page_size = 20
        
        paginated_products = paginator.paginate_queryset(
            products,
            request
        )
        
        serializer = ProductSerializer(
            paginated_products,
            many=True
        )
        
        return paginator.get_paginated_response(
            serializer.data
        )
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)

    # POST - Add / Duplicate Product
    if request.method == "POST":
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================================
# SINGLE PRODUCT DETAILS
# =========================================================

@api_view(["GET", "PUT", "PATCH", "DELETE"])
def get_product_details(request, id):

    try:
        product = Product.objects.get(id=id)

    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # GET
    if request.method == "GET":
        serializer = ProductSerializer(product)

        return Response(serializer.data)

    # DELETE
    if request.method == "DELETE":
        product.delete()

        return Response(
            {"message": "Product deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

    # PUT / PATCH
    serializer = ProductSerializer(
        product,
        data=request.data,
        partial=request.method == "PATCH",
    )

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# =========================================================
# ALL CATEGORIES
# =========================================================

@api_view(["GET"])
def get_category(request):

    categories = Category.objects.all()

    serializer = CategorySerializer(
        categories,
        many=True,
    )

    return Response(serializer.data)


# =========================================================
# CART
# =========================================================

@api_view(["GET"])
def get_cart(request):

    cart, created = Cart.objects.get_or_create(
        user=None
    )

    serializer = CartSerializer(cart)

    return Response(serializer.data)


@api_view(["POST"])
def add_to_cart(request):

    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))

    cart, created = Cart.objects.get_or_create(
        user=None
    )

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product_id=product_id,
    )

    if created:
        item.quantity = quantity
    else:
        item.quantity += quantity

    item.save()

    return Response(
        {
            "message": "Item added to cart",
            "cart": CartSerializer(cart).data,
        }
    )


@api_view(["POST"])
def remove_from_cart(request):

    item_id = request.data.get("item_id")

    CartItem.objects.filter(
        id=item_id
    ).delete()

    return Response(
        {"message": "Item removed from cart"}
    )


# =========================================================
# ORDER VIEWSET
# =========================================================

class OrderViewSet(viewsets.ModelViewSet):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


# =========================================================
# CUSTOMER LIST
# =========================================================

class CustomerListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        users = User.objects.all().order_by(
            "-date_joined"
        )

        serializer = CustomerSerializer(
            users,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# =========================================================
# REGISTER
# =========================================================

class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

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


# =========================================================
# LOGIN
# =========================================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {
                    "detail": "Email and password are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If duplicate email exists,
        # staff/superuser account gets priority
        user = (
            User.objects
            .filter(email__iexact=email)
            .order_by(
                "-is_superuser",
                "-is_staff",
                "-id",
            )
            .first()
        )

        if user is None:
            return Response(
                {"detail": "Email not found"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Password check
        if not user.check_password(password):
            return Response(
                {"detail": "Wrong password"},
                status=status.HTTP_401_UNAUTHORIZED,
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
                    "name": user.first_name or user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                },
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# GOOGLE LOGIN
# =========================================================

class GoogleLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        credential = request.data.get("credential")

        if not credential:
            return Response(
                {"detail": "Google credential is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except ValueError:
            return Response(
                {"detail": "Invalid Google credential"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = google_user.get("email")
        email_verified = google_user.get(
            "email_verified",
            False,
        )
        name = google_user.get("name", "")

        if not email or not email_verified:
            return Response(
                {"detail": "Google email is not verified"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = User.objects.filter(
            email__iexact=email
        ).first()

        # User না থাকলে automatically register
        if user is None:

            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=name,
            )

            user.set_unusable_password()
            user.save()

        # JWT তৈরি
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Google login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "name": user.first_name,
                    "email": user.email,
                },
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# FORGOT PASSWORD
# =========================================================

class ForgotPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:
            return Response(
                {
                    "error": (
                        "User with this email does not exist"
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Generate UID
        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        # Generate Token
        token = default_token_generator.make_token(
            user
        )

        # Reset link
        reset_link = (
            f"http://localhost:5173/reset-password/"
            f"{uid}/{token}"
        )

        # Temporarily console-এ link দেখাবে
        print("PASSWORD RESET LINK:")
        print(reset_link)

        return Response(
            {
                "message": (
                    "Password reset link generated "
                    "successfully"
                ),
                "reset_link": reset_link,
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# RESET PASSWORD
# =========================================================

class ResetPasswordView(APIView):

    def post(self, request):

        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get(
            "new_password"
        )

        if not uid or not token or not new_password:
            return Response(
                {
                    "error": (
                        "uid, token and new_password "
                        "are required"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Password minimum 6 characters
        if len(new_password) < 6:
            return Response(
                {
                    "error": (
                        "Password must be at least "
                        "6 characters"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Decode UID
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id
            )

        except Exception:
            return Response(
                {"error": "Invalid reset link"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check Token
        if not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {
                    "error": (
                        "Invalid or expired reset token"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set new password
        user.set_password(new_password)
        user.save()

        return Response(
            {
                "message": (
                    "Password reset successfully"
                )
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# SITE SETTINGS
# =========================================================

class SiteSettingsView(APIView):

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_permissions(self):

        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAdminUser()]

    def get(self, request):

        settings_obj, created = (
            SiteSettings.objects.get_or_create(
                id=1
            )
        )

        serializer = SiteSettingsSerializer(
            settings_obj,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request):

        settings_obj, created = (
            SiteSettings.objects.get_or_create(
                id=1
            )
        )

        serializer = SiteSettingsSerializer(
            settings_obj,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================================
# ADMIN DASHBOARD
# =========================================================

# =========================================================
# ADMIN DASHBOARD
# =========================================================

class AdminDashboardView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        # =================================================
        # BASIC STATS
        # =================================================

        total_products = Product.objects.count()

        total_customers = User.objects.filter(
            is_staff=False,
            is_superuser=False,
        ).count()

        total_orders = Order.objects.count()

        total_sales = (
            Order.objects.aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )

        # =================================================
        # ORDER STATUS
        # =================================================

        pending_orders = Order.objects.filter(
            status__iexact="pending"
        ).count()

        processing_orders = Order.objects.filter(
            status__iexact="processing"
        ).count()

        shipped_orders = Order.objects.filter(
            status__iexact="shipped"
        ).count()

        delivered_orders = Order.objects.filter(
            status__iexact="delivered"
        ).count()

        cancelled_orders = Order.objects.filter(
            status__iexact="cancelled"
        ).count()

        # =================================================
        # SALES ANALYTICS
        # =================================================

        filter_type = request.GET.get(
            "period",
            "1_month"
        )

        today = timezone.localdate()

        # -----------------------------------------------
        # 7 DAYS
        # -----------------------------------------------

        if filter_type == "7_days":

            start_date = today - timedelta(days=6)

            sales_queryset = (
                Order.objects
                .filter(
                    created_at__date__gte=start_date,
                    created_at__date__lte=today,
                )
                .values("created_at__date")
                .annotate(
                    sales=Sum("total_amount"),
                    orders=Count("id"),
                )
                .order_by("created_at__date")
            )

            sales_map = {
                item["created_at__date"]: item
                for item in sales_queryset
            }

            sales_analytics = []

            for i in range(7):

                current_date = (
                    start_date + timedelta(days=i)
                )

                item = sales_map.get(
                    current_date
                )

                sales_analytics.append(
                    {
                        "date": current_date.strftime(
                            "%b %d"
                        ),
                        "value": float(
                            item["sales"]
                            if item
                            else 0
                        ),
                        "sales": float(
                            item["sales"]
                            if item
                            else 0
                        ),
                        "orders": (
                            item["orders"]
                            if item
                            else 0
                        ),
                    }
                )

        # -----------------------------------------------
        # 1 MONTH
        # -----------------------------------------------

        elif filter_type == "1_month":

            start_date = today - timedelta(
                days=29
            )

            sales_queryset = (
                Order.objects
                .filter(
                    created_at__date__gte=start_date,
                    created_at__date__lte=today,
                )
                .values("created_at__date")
                .annotate(
                    sales=Sum("total_amount"),
                    orders=Count("id"),
                )
                .order_by("created_at__date")
            )

            sales_map = {
                item["created_at__date"]: item
                for item in sales_queryset
            }

            sales_analytics = []

            for week in range(4):

                week_start = (
                    start_date
                    + timedelta(days=week * 7)
                )

                week_end = min(
                    week_start
                    + timedelta(days=6),
                    today,
                )

                week_sales = 0
                week_orders = 0

                current_date = week_start

                while current_date <= week_end:

                    item = sales_map.get(
                        current_date
                    )

                    if item:
                        week_sales += float(
                            item["sales"] or 0
                        )
                        week_orders += (
                            item["orders"] or 0
                        )

                    current_date += timedelta(
                        days=1
                    )

                sales_analytics.append(
                    {
                        "date": f"Week {week + 1}",
                        "value": week_sales,
                        "sales": week_sales,
                        "orders": week_orders,
                    }
                )

        # -----------------------------------------------
        # 6 MONTHS
        # -----------------------------------------------

        elif filter_type == "6_months":

            start_date = today.replace(
                day=1
            )

            # Go back 5 months
            for _ in range(5):

                if start_date.month == 1:
                    start_date = start_date.replace(
                        year=start_date.year - 1,
                        month=12
                    )
                else:
                    start_date = start_date.replace(
                        month=start_date.month - 1
                    )

            sales_queryset = (
                Order.objects
                .filter(
                    created_at__date__gte=start_date,
                    created_at__date__lte=today,
                )
                .values(
                    "created_at__year",
                    "created_at__month",
                )
                .annotate(
                    sales=Sum("total_amount"),
                    orders=Count("id"),
                )
                .order_by(
                    "created_at__year",
                    "created_at__month",
                )
            )

            sales_map = {
                (
                    item["created_at__year"],
                    item["created_at__month"],
                ): item
                for item in sales_queryset
            }

            sales_analytics = []

            current_year = start_date.year
            current_month = start_date.month

            for _ in range(6):

                item = sales_map.get(
                    (
                        current_year,
                        current_month,
                    )
                )

                sales_value = float(
                    item["sales"]
                    if item
                    else 0
                )

                order_value = (
                    item["orders"]
                    if item
                    else 0
                )

                month_name = start_date.strftime(
                    "%b"
                )

                sales_analytics.append(
                    {
                        "date": month_name,
                        "value": sales_value,
                        "sales": sales_value,
                        "orders": order_value,
                    }
                )

                if current_month == 12:
                    current_month = 1
                    current_year += 1
                else:
                    current_month += 1

                if current_month == 1:
                    start_date = start_date.replace(
                        year=start_date.year + 1,
                        month=1
                    )
                else:
                    start_date = start_date.replace(
                        month=current_month
                    )

        # -----------------------------------------------
        # 12 MONTHS
        # -----------------------------------------------

        elif filter_type == "12_months":

            start_date = today.replace(
                day=1
            )

            for _ in range(11):

                if start_date.month == 1:
                    start_date = start_date.replace(
                        year=start_date.year - 1,
                        month=12
                    )
                else:
                    start_date = start_date.replace(
                        month=start_date.month - 1
                    )

            sales_queryset = (
                Order.objects
                .filter(
                    created_at__date__gte=start_date,
                    created_at__date__lte=today,
                )
                .values(
                    "created_at__year",
                    "created_at__month",
                )
                .annotate(
                    sales=Sum("total_amount"),
                    orders=Count("id"),
                )
                .order_by(
                    "created_at__year",
                    "created_at__month",
                )
            )

            sales_map = {
                (
                    item["created_at__year"],
                    item["created_at__month"],
                ): item
                for item in sales_queryset
            }

            sales_analytics = []

            current_year = start_date.year
            current_month = start_date.month

            for _ in range(12):

                item = sales_map.get(
                    (
                        current_year,
                        current_month,
                    )
                )

                sales_value = float(
                    item["sales"]
                    if item
                    else 0
                )

                order_value = (
                    item["orders"]
                    if item
                    else 0
                )

                month_date = timezone.datetime(
                    current_year,
                    current_month,
                    1
                )

                sales_analytics.append(
                    {
                        "date": month_date.strftime(
                            "%b"
                        ),
                        "value": sales_value,
                        "sales": sales_value,
                        "orders": order_value,
                    }
                )

                if current_month == 12:
                    current_month = 1
                    current_year += 1
                else:
                    current_month += 1

        # -----------------------------------------------
        # ALL
        # -----------------------------------------------

        else:

            sales_queryset = (
                Order.objects
                .values(
                    "created_at__year"
                )
                .annotate(
                    sales=Sum("total_amount"),
                    orders=Count("id"),
                )
                .order_by(
                    "created_at__year"
                )
            )

            sales_analytics = []

            for item in sales_queryset:

                year = item[
                    "created_at__year"
                ]

                sales_value = float(
                    item["sales"] or 0
                )

                sales_analytics.append(
                    {
                        "date": str(year),
                        "value": sales_value,
                        "sales": sales_value,
                        "orders": (
                            item["orders"] or 0
                        ),
                    }
                )

        # =================================================
        # PERIOD TOTAL
        # =================================================

        period_sales = sum(
            item["value"]
            for item in sales_analytics
        )

        # Expense model এখনো নেই
        period_expenses = 0

        period_balance = (
            period_sales - period_expenses
        )

        # =================================================
        # TOP SELLING PRODUCTS
        # =================================================

        total_price_expression = ExpressionWrapper(
            F("price") * F("quantity"),
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )

        top_products_queryset = (
            OrderItem.objects
            .values(
                "product__id",
                "product__name",
                "product__image",
            )
            .annotate(
                total_quantity=Sum(
                    "quantity"
                ),
                total_sales=Sum(
                    total_price_expression
                ),
            )
            .order_by(
                "-total_quantity"
            )[:5]
        )

        top_selling_products = []

        for item in top_products_queryset:

            image = item[
                "product__image"
            ]

            if image:
                image_url = (
                    request.build_absolute_uri(
                        f"/media/{image}"
                    )
                )
            else:
                image_url = None

            top_selling_products.append(
                {
                    "id": item[
                        "product__id"
                    ],
                    "name": item[
                        "product__name"
                    ],
                    "image": image_url,
                    "quantity": (
                        item[
                            "total_quantity"
                        ] or 0
                    ),
                    "sales": float(
                        item[
                            "total_sales"
                        ] or 0
                    ),
                }
            )

        # =================================================
        # RESPONSE
        # =================================================

        return Response(
            {
                "stats": {
                    "total_sales": float(
                        total_sales
                    ),
                    "total_orders": total_orders,
                    "total_customers": (
                        total_customers
                    ),
                    "total_products": (
                        total_products
                    ),
                },

                "order_status": {
                    "pending": pending_orders,
                    "processing": processing_orders,
                    "shipped": shipped_orders,
                    "delivered": delivered_orders,
                    "cancelled": cancelled_orders,
                },

                "sales_analytics": (
                    sales_analytics
                ),

                "sales_summary": {
                    "income": period_sales,
                    "expenses": period_expenses,
                    "balance": period_balance,
                },

                "top_selling_products": (
                    top_selling_products
                ),
            }
        )

