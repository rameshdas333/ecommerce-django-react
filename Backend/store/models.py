from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)
    slug = models.SlugField(max_length=100,unique=True,default=None)      


    def __str__(self):
        return self.name
    

class Product(models.Model):
    category = models.ForeignKey(Category,related_name='products',on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=200,unique=True)
    slug = models.SlugField( 
    max_length=200,
    unique=True,
    null=True,
    blank=True)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='product_images/',blank=True,null=True)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
      )
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    

    def __str__(self):
        return self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15,blank=True)
    address = models.CharField(max_length=255,blank=True)
   

    def __str__(self):
        return self.user.username   

class Size(models.Model):

    SIZE_CHOICES = [
        ("S", "S"),
        ("M", "M"),
        ("L", "L"),
        ("XL", "XL"),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="sizes"
    )

    size = models.CharField(
        max_length=10,
        choices=SIZE_CHOICES,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.product.name} - {self.size}"


class Order(models.Model):

    PAYMENT_CHOICES = (
        ("bank", "Bank"),
        ("cash_on_delivery", "Cash on Delivery"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    # ================= BILLING INFORMATION =================

    first_name = models.CharField(max_length=100)

    company_name = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    street_address = models.CharField(max_length=255)

    apartment = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    town_city = models.CharField(max_length=100)

    phone_number = models.CharField(max_length=20)

    email = models.EmailField(
    blank=True,
    null=True
   )

    # ================= PAYMENT =================

    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_CHOICES,
        default="cash_on_delivery"
    )

    # ================= PRICE =================

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    discount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    shipping_charge = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    coupon_code = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    # ================= ORDER STATUS =================

    status = models.CharField(
        max_length=30,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Order #{self.id} - {self.first_name}"

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(default=1)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    selected_size = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    
    @property
    def total_price(self):
     price = self.price or 0
     quantity = self.quantity or 0

     return price * quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class Cart(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user}"

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def subtotal(self):
        return self.product.price * self.quantity
    
    