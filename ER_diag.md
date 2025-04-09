![alt text](hbnb_part3.drawio.png)
## lexicon
* USER: A user of the HBnB system. They have information such as a unique identifier (id), a name, an email, and a password.

* PLACE: A lodging available on HBnB. It has information like an identifier, a title, a description, and a price. Each PLACE is linked to a USER (the owner).

* REVIEW: A review left by a user about a lodging. It has an identifier, text, a rating, and is linked to a USER (the author of the review) and a PLACE (the lodging being reviewed).

* AMENITY: A feature or equipment available in a lodging (e.g., WiFi, swimming pool). It has an identifier and a name.

* PLACE_AMENITY: This is a table used to connect PLACEs and AMENITYs. It indicates which amenities are available at which lodging.

## In summary:

USERs own PLACEs and write REVIEWs.

PLACEs receive REVIEWs and have AMENITYs.

PLACE_AMENITY links PLACEs and their AMENITYs.