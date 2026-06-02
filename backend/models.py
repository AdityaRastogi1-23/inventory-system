from sqlalchemy import Column,Integer,String,Float
from sqlalchemy.orm import declarative_base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()

class Product(Base):

    __tablename__="products"

    id=Column(Integer,primary_key=True,index=True)

    name=Column(String)

    sku=Column(String,unique=True)

    price=Column(Float)

    stock=Column(Integer)


class Customer(Base):

    __tablename__ = "customers"


    id = Column(

        Integer,

        primary_key=True,

        index=True

    )


    name = Column(

        String,

        nullable=False

    )


    email = Column(

        String,

        unique=True,

        nullable=False

    )

class Order(Base):

    __tablename__="orders"

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )


    customer_id = Column(

        Integer,

        ForeignKey(

            "customers.id"

        )

    )


    product_id = Column(

        Integer,

        ForeignKey(

            "products.id"

        )

    )


    quantity = Column(

        Integer,

        nullable=False

    )


    customer = relationship(

        "Customer"

    )


    product = relationship(

        "Product"

    )