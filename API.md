<h1>
    和User有關的路由
</h1>

<font size=5>1.  </font><font size=5>POST /api/register </font>
    
註冊

**Parameters**： n/a

**Request body**：

| name | required | type | description |
| -------- | -------- | -------- | -------- |
| account | required | varchar(255) |  |
| email | required | varchar(255) |  |
| password | required | varchar(255) |  |
| role | required | varchar(255) | 'buyer' or 'seller' |



**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "token" : "12345678"
        "loginUser": 
            {
                "id": 1,
                "role": "buyer",
                "account": "buyer0001",
                "email": "buyer0001@buy.com",
                "avatar": "https://via.placeholder.com/300",
            }
    }
}
```
* Failure | code：401
```
{
    "status": "Unauthorized",
    "message": "[error messages]"
}
```
<br>
<br>
<font size=5>2.  </font>
    <font size=5>POST /api/login  </font>
    
登入

**Parameters**：n/a
**Request body**：


| params | required | type | description |
| -------- | -------- | -------- | -------- |
| account | required | varchar(255) |  |
| password | required | varchar(255) |  |


**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "token" : "12345678"
        "loginUser": 
            {
                "id": 1,
                "role": "buyer",
                "account": "buyer0001",
                "email": "buyer0001@buy.com",
                "avatar": "https://via.placeholder.com/300",
            }
    }
}
```
* Failure | code：401
```
{
    "status": "Unauthorized",
    "message": "[error messages]"
}
```
<br>
<br>
<font size=5>3.  </font>
    <font size=5>GET /api/test-token  </font>
    
驗證身份
**Parameters**：n/a
**Request header**: 'Bearer' + JWTtoken
**Request body**： n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "loginUser": 
            {
                "id": 1,
                "role": "buyer",
                "account": "buyer0001",
                "email": "buyer0001@buy.com",
                "avatar": "https://via.placeholder.com/300",
            }
    }
}
```
* Failure | code：401
```
{
    "status": "Unauthorized",
    "message": "[error messages]"
}
```
<br>
<br>
<font size=5>4.  </font>
<font size=5>GET /api/users/:uid/products
</font>
   
   ? page=1
   &limit=10

取得商家的商品清單
**Parameters**：

| name | required | type | description |
| -------- | -------- | -------- | -------- |
| page | required | int | 頁碼 |
| limit | required | int | 每頁顯示幾筆 |


**Request body**：
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "products":[
            {
                "id": 1,
                "userId": 1,
                "name": "a"
                "price": 100,
                "description": "good",
                "image": "https://via.placeholder.com/300",
                "stock": 10
                "categoryId": "1",
                "onShelf": true
                "version": 0,
                "createdAt": "2022-01-18T07:23:18.000Z",
                "updatedAt": "2022-01-18T07:23:18.000Z",
            },
            ...
        ]
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```
<br>
<br>
<font size=5>5.  </font>
    <font size=5>GET /api/users/:uid/orders    </font>
    
取得user的訂單資訊

**Parameters**：n/a
**Request body**：n/a

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "Orders":[
            {
                "id": 1,
                "userId": 1,
                "isChecked": true,
                "OrderItems": [
                    {
                        "id": 1,
                        "orderId": 1,
                        "productId": 1,
                        "Product": 
                            {
                                "id": 1,
                                "userId": 1,
                                "name": "a"
                                "price": 100,
                                "description": "good",
                                "image": "https://via.placeholder.com/300",
                                "stock": 10
                                "categoryId": "1",
                                "onShelf": true
                                "version": 0,
                                "createdAt": "2022-01-18T07:23:18.000Z",
                                "updatedAt": "2022-01-18T07:23:18.000Z",
                            }
                        "amount": 5
                    
                    },
                    ...
                ]
            },
            ...
        ]
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```
<br>
<br>
<h1>
    和 MainPage 有關的路由
</h1>
<font size=5>6.  </font>
<font size=5>GET /products</font>
     
?keyword=abc
price=100-200
categoryId=1
&page=1
&limit=10
&shopId=123


顯示所有商品 / 搜尋商品

**Parameters**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| keyword | not required | varchar(255) |  |
| price | not required | int |  |
| categoryId | not required | int |  |
| page | required | int | 第幾頁 |
| limit | required | int | 每頁幾筆 |
| shopId | not required | int |  |

<br>

**Request body**：n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "products":[
            {
                "id": 1,
                "userId": 1,
                "name": "a"
                "price": 100,
                "description": "good",
                "image": "https://via.placeholder.com/300",
                "stock": 10
                "categoryId": "1",
                "onShelf": true
                "version": 0,
                "createdAt": "2022-01-18T07:23:18.000Z",
                "updatedAt": "2022-01-18T07:23:18.000Z",
            },
            ...
        ]
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```
<br>
<br>
<h1>
    和 Product 有關的路由
</h1>
<font size=5>7.  </font>
    <font size=5>POST /api/products     </font>
    
新增一個商品

**Parameters**：n/a
**Request body**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| userId | required | int | 商家ID |
| name | required | varchar(255) | 商品名稱 |
| price | required | int |  |
| description | not required | text |  |
| image | not required | varchar(255) |  |
| stock | required | int |  |
| categoryId | required | int |  |

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "product":
            {
                "id": 1,
                "userId": 1,
                "name": "a"
                "price": 100,
                "description": "good",
                "image": "https://via.placeholder.com/300",
                "stock": 10
                "categoryId": "1",
                "onShelf": true
                "version": 0,
                "createdAt": "2022-01-18T07:23:18.000Z",
                "updatedAt": "2022-01-18T07:23:18.000Z",
            }
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<font size=5>8.  </font><font size=5>GET /api/products/:pid </font>
    
取得一個商品資訊

**Parameters**：n/a
**Request body**：n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "product":
            {
                "id": 1,
                "userId": 1,
                "name": "a"
                "price": 100,
                "description": "good",
                "image": "https://via.placeholder.com/300",
                "stock": 10
                "categoryId": "1",
                "onShelf": true
                "version": 0,
                "createdAt": "2022-01-18T07:23:18.000Z",
                "updatedAt": "2022-01-18T07:23:18.000Z",
            }
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<font size=5>9.  </font><font size=5>PUT /api/products/:pid     </font>
    
編輯一個商品、下架一個商品

**Parameters**：n/a
**Request body**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| userId | not required | int | 商家ID |
| name | not required | varchar(255) | 商品名稱 |
| price | not required | int |  |
| description | not required | text |  |
| image | not required | varchar(255) |  |
| stock | not required | int |  |
| categoryId | not required | int |  |
| onShelf | not required | BOOLEAN |  |

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "product":
            {
                "id": 1,
                "userId": 1,
                "name": "a"
                "price": 100,
                "description": "good",
                "image": "https://via.placeholder.com/300",
                "stock": 10
                "categoryId": "1",
                "onShelf": true
                "version": 0,
                "createdAt": "2022-01-18T07:23:18.000Z",
                "updatedAt": "2022-01-18T07:23:18.000Z",
            }
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```

<h1>
    和 Cart 有關的路由
</h1>
<font size=5>10.  </font>
    <font size=5>GET /api/carts/:uid    </font>
    
取得購物車資訊

**Parameters**：n/a
**Request body**：n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "CartItems":[
            {
                "id": 1,
                "userId": 1,
                "productId": 1,
                "Product": 
                    {
                        "id": 1,
                        "userId": 1,
                        "name": "a"
                        "price": 100,
                        "description": "good",
                        "image": "https://via.placeholder.com/300",
                        "stock": 10
                        "categoryId": "1",
                        "onShelf": true
                        "version": 0,
                        "createdAt": "2022-01-18T07:23:18.000Z",
                        "updatedAt": "2022-01-18T07:23:18.000Z",
                    }
                "amount": 1,
                "isOrdered": false
            },
            ...
        ]
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<font size=5>11.  </font><font size=5>POST /api/carts     </font>

新增購物車

**Parameters**：n/a
**Request body**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| userId | required | int | 購買者ID |
| productId | required | int |  |
| amount | required | int |  |

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "CartItems":
            {
                "id": 1,
                "userId": 1,
                "productId": 1,
                "amount": 1,
                "isOrdered": false
            } 
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<font size=5>12.  </font><font size=5>PUT /api/carts/:cid     </font>

編輯購物車

**Parameters**：n/a
**Request body**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| amount | required | int |  |

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "CartItems":
            {
                "id": 1,
                "userId": 1,
                "productId": 1,
                "amount": 1,
                "isOrdered": false
            } 
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```

<font size=5>13.  </font><font size=5>DELETE /api/carts/:cid     </font>

刪除購物車

**Parameters**：n/a
**Request body**：n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "CartItems":
            {
                "id": 1,
                "userId": 1,
                "productId": 1,
                "amount": 1,
                "isOrdered": false
            } 
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<font size=5>14.  </font><font size=5>POST /api/carts/checkout     </font>

下單購物車

**Parameters**：n/a
**Request body**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| cartItemId | required | array |  |

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "CartItems":[
            {
                "id": 1,
                "userId": 1,
                "productId": 1,
                "amount": 1,
                "isOrdered": false
            } 
        ]
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<h1>
    和 Order 有關的路由
</h1>
<font size=5>15.  </font>
    <font size=5>GET /api/orders/:oid    </font>
    
取得訂單資訊

**Parameters**：n/a
**Request body**：n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "Order": {
            "id": 1,
            "userId": 1,
            "isChecked": false,
            "OrderItem":[
                {
                "id": 1,
                "orderId": 1,
                "productId": 1,
                "Product": 
                    {
                        "id": 1,
                        "userId": 1,
                        "name": "a"
                        "price": 100,
                        "description": "good",
                        "image": "https://via.placeholder.com/300",
                        "stock": 10
                        "categoryId": "1",
                        "onShelf": true
                        "version": 0,
                        "createdAt": "2022-01-18T07:23:18.000Z",
                        "updatedAt": "2022-01-18T07:23:18.000Z",
                    }
                "amount": 1,
            },
            ...
        ]
        }

    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```

<font size=5>16.  </font>
    <font size=5>PUT /api/orderItems/:orderItem-id    </font>
    
修改訂單項目

**Parameters**：n/a
**Request body**：
| params | required | type | description |
| -------- | -------- | -------- | -------- |
| amount | required | int |  |

**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "OrderItem":
            {
                "id": 1,
                "orderId": 1,
                "productId": 1,
                "amount": 1,
            } 
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```


<font size=5>17.  </font><font size=5>DELETE /api/orderItems/:orderItem-id     </font>

刪除購物車

**Parameters**：n/a
**Request body**：n/a
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "OrderItem":
            {
                "id": 1,
                "orderId": 1,
                "productId": 1,
                "amount": 1,
            } 
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```

<font size=5>18.  </font><font size=5>POST /api/orders/:oid     </font>

訂單結帳

**Parameters**：n/a
**Request body**：
**Response**：
* Success | code：200
```
{
    "status": "success",
    "data": {
        "Order":
            {
                "id": 1,
                "userId": 1,
                "isOrdered": true
            } 
        
    }
}
```
* Failure | code：500
```
{
    "status": "error",
    "message": "[error messages]"
}
```