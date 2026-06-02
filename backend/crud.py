from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models import Product
from models import Customer
from models import Order


def create_product(
    db: Session,
    name: str,
    sku: str,
    price: float,
    stock: int
):

    product = Product(

        name=name,

        sku=sku,

        price=price,

        stock=stock

    )

    try:

        db.add(product)

        db.commit()

        db.refresh(product)

        return product

    except IntegrityError:

        db.rollback()

        raise Exception(
            "SKU already exists"
        )


def get_products(
    db: Session
):

    return db.query(
        Product
    ).all()

def update_product(

    db: Session,

    product_id: int,

    name: str,

    sku: str,

    price: float,

    stock: int

):

    product = db.query(

        Product

    ).filter(

        Product.id == product_id

    ).first()


    if not product:

        raise Exception(

            "Product not found"

        )


    product.name = name

    product.sku = sku

    product.price = price

    product.stock = stock


    try:

        db.commit()

        db.refresh(product)

        return product

    except IntegrityError:

        db.rollback()

        raise Exception(

            "SKU already exists"

        )



def delete_product(

    db: Session,

    product_id: int

):

    product = db.query(

        Product

    ).filter(

        Product.id == product_id

    ).first()


    if not product:

        raise Exception(

            "Product not found"

        )


    db.delete(product)

    db.commit()

    return {

        "message":"Deleted"

    }

def create_customer(

    db:Session,

    name:str,

    email:str

):

    customer = Customer(

        name=name,

        email=email

    )


    try:

        db.add(customer)

        db.commit()

        db.refresh(customer)

        return customer

    except IntegrityError:

        db.rollback()

        raise Exception(

            "Email already exists"

        )



def get_customers(

    db:Session

):

    return db.query(

        Customer

    ).all()

def create_order(

    db:Session,

    customer_id:int,

    product_id:int,

    quantity:int

):

    product = db.query(

        Product

    ).filter(

        Product.id==product_id

    ).first()


    if not product:

        raise Exception(

            "Product not found"

        )


    if product.stock < quantity:

        raise Exception(

            "Insufficient stock"

        )


    product.stock -= quantity


    order = Order(

        customer_id=customer_id,

        product_id=product_id,

        quantity=quantity

    )


    db.add(

        order

    )

    db.commit()

    db.refresh(

        order

    )

    return order



def get_orders(

    db:Session

):

    return db.query(

        Order

    ).all()