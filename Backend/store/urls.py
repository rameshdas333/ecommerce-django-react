from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ForgotPasswordView,
    ResetPasswordView,
)



router = DefaultRouter()

router.register(
    "orders",
    views.OrderViewSet,
    basename="orders"
)


urlpatterns = [
    path("products/", views.get_product),
    path("products/<int:id>/", views.get_product_details),
    path("categories/", views.get_category),

    path("cart/", views.get_cart),
    path("cart/add/", views.add_to_cart),
    path("cart/remove/", views.remove_from_cart),

    # Register
    path(
        "auth/register/",
        views.RegisterView.as_view()
    ),

    # Custom Email Login
    path(
        "auth/login/",
        views.LoginView.as_view()
    ),

    # Token Refresh
    path(
        "auth/token/refresh/",
        TokenRefreshView.as_view()
    ),

    path(
        "auth/forgot-password/",
        views.ForgotPasswordView.as_view()
       
    ),

    path(
        "auth/reset-password/",
        views.ResetPasswordView.as_view()
      
    ),


    # Orders
    path("", include(router.urls)),
]
# ========================================================================
# ========================================================================
# ========================================================================



# from django.urls import path, include
# from . import views
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenRefreshView

# router = DefaultRouter()

# router.register(
#     "orders",
#     views.OrderViewSet,
#     basename="orders"
# )

# urlpatterns = [
#     path("products/", views.get_product),
#     path("products/<int:id>/", views.get_product_details),
#     path("categories/", views.get_category),

#     path("cart/", views.get_cart),
#     path("cart/add/", views.add_to_cart),
#     path("cart/remove/", views.remove_from_cart),
     
#     # Register
#     path("auth/register/", views.RegisterView.as_view()),

#     # Login
#    path(
#     "auth/login/",
#     views.LoginView.as_view(),
# ),

#     # Refresh Token
#    path(
#     "auth/token/refresh/",
#     TokenRefreshView.as_view()
# ),
#     # Order ViewSet
#     path("", include(router.urls)),
# ]


