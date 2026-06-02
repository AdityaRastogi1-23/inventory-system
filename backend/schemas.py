from pydantic import BaseModel

class ProductCreate(BaseModel):

    name: str

    sku: str

    price: float

    stock: int


class ProductResponse(ProductCreate):

    id: int

    class Config:

        from_attributes = True

class CustomerCreate(

    BaseModel

):

    name:str

    email:str



class CustomerResponse(

    CustomerCreate

):

    id:int

    model_config = {

        "from_attributes":True

    }

class OrderCreate(

    BaseModel

):

    customer_id:int

    product_id:int

    quantity:int



class OrderResponse(

    OrderCreate

):

    id:int

    model_config={

        "from_attributes":True

    }