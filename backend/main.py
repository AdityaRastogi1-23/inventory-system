from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base
from fastapi.middleware.cors import CORSMiddleware

from schemas import (

    ProductCreate,

    ProductResponse,

    CustomerCreate,

    CustomerResponse,
    
    OrderCreate,
    
    OrderResponse

)

from crud import (

    create_product,

    get_products,

    update_product,

    delete_product,

    create_customer,
    
    get_customers,

    create_order,
    
    get_orders

)
from fastapi import HTTPException

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(

CORSMiddleware,

allow_origins=["*"],

allow_credentials=True,

allow_methods=["*"],

allow_headers=["*"]

)


@app.get("/")
def home():

    return {"message":"API Working"}

@app.put(

    "/products/{product_id}",

    response_model=ProductResponse

)

def edit_product(

    product_id:int,

    product:ProductCreate,

    db:Session=Depends(get_db)

):

    try:

        return update_product(

            db,

            product_id,

            product.name,

            product.sku,

            product.price,

            product.stock

        )

    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )
    
@app.delete(

    "/products/{product_id}"

)

def remove_product(

    product_id:int,

    db:Session=Depends(get_db)

):

    try:

        return delete_product(

            db,

            product_id

        )

    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )

@app.post(
    "/products",
    response_model=ProductResponse
)
def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    try:

        return create_product(

            db,

            product.name,

            product.sku,

            product.price,

            product.stock

        )

    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )


@app.get(
    "/products",
    response_model=list[ProductResponse]
)
def products(
    db: Session = Depends(get_db)
):

    return get_products(db)

@app.get(

    "/customers",

    response_model=list[CustomerResponse]

)

def customers(

    db:Session=Depends(get_db)

):

    return get_customers(

        db

    )



@app.post(

    "/customers",

    response_model=CustomerResponse

)

def add_customer(

    customer:CustomerCreate,

    db:Session=Depends(get_db)

):

    try:

        return create_customer(

            db,

            customer.name,

            customer.email

        )

    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )
    
@app.get(

    "/orders",

    response_model=list[OrderResponse]

)

def orders(

    db:Session=Depends(get_db)

):

    return get_orders(

        db

    )



@app.post(

    "/orders",

    response_model=OrderResponse

)

def add_order(

    order:OrderCreate,

    db:Session=Depends(get_db)

):

    try:

        return create_order(

            db,

            order.customer_id,

            order.product_id,

            order.quantity

        )

    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )