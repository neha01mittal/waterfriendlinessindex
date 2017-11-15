API
===

CONSUMER
--------

**POST**

POST: userlogin/ 
 - username *string*
	
Login as a user.
	
    curl -d "user_name=Daniel" -X POST 0.0.0.0:8000/userlogin/

RETURN:

    {"credit": 89.5, "user_id": "1"}

---

POST: transaction/
 - quantity *int*
 - company_id 
 - value_at_buy *float*
 - user_id 
 - block_address *string*
	
Make a new transaction.

    curl -d "user_id=1&company_id=1&quantity=1&value_at_buy=10.5&block_address=0x111" -X POST 0.0.0.0:8000/transaction/

RETURN:

    {"credit": 79.0}

**GET**

GET: companydata/

Get all company data.

RETURN:

    [{"logo": "none", "data": [{"wfi": 37, "val": 70.0, "time": "2017-11-14 13:33:26.965747+00:00"}, {"wfi": 35, "val": 60.0, "time": "2017-11-14 13:32:53.979662+00:00"}], "name": "Apple"}]

---

GET: companydata/(?P<company_id>[0-9]+)

Get data of one specific company.

RETURN: 

    [{"logo": "none", "data": [{"wfi": 37, "val": 70.0, "time": "2017-11-14 13:33:26.965747+00:00"}, {"wfi": 35, "val": 60.0, "time": "2017-11-14 13:32:53.979662+00:00"}], "name": "Apple"}]

---

GET: portfolio/(?P<user_id>[0-9]+)

Get the portfolio of one specific user.

RETURN:

    {"transactions": [{"wfi_at_buy": "0.0", "company": "Apple", "block_address": "0x111", "time": "2017-11-14 18:36:06.275138+00:00", "value_at_buy": "12.5", "accumulation": -50.0, "quantity": -4}]}


COMPANY
-------

**POST**

POST: upload/

 - company_id
 - wfi
 
Update the database with the new calculated wfi.

     curl -d "company_id=1&wki=60.0" -X POST 0.0.0.0:8000/upload/

RETURN:

    {"success": "ok"}

---

POST: companylogin/ 
 - company_name
 
Login as a company with the name.

    curl -d "company_name=Apple" -X POST 0.0.0.0:8000/companylogin/

RETURN:

    {"company_id": "1"}