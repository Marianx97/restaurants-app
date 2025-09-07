# Restaurants App

## Introduction

This app is based on a technical challenge i've faced. I changed some things to add more content to it.

The idea was to build an application where different restaurants would take orders and there were some scenarios to be taken into consideration. For example, a restaurant would have a maximum amount of orders it could take simultaneously and it should deny the creation of new orders until the current amount of orders decreased. An order would have different status (`pending`, `confirmed`, `in process` and `ready`) and when it changed to `ready`, the current amount of orders for the restaurant would decrease.

To the original idea i wanted to add the concept of `Dishes`, a model that represents the products that each restaurant can offer.

Also, i wanted to add `Users` to the application. There should be different kind of users.

* App Admin Users: this would be administrator users that can create and delete the `Restaurant` records.
* Restaurant Admin Users: this would be users that represent the owner of the restaurant and have the ability to create and delete the `Dish` records of each restaurant. Also, this users would have the hability to change the status of the orders that the restaurant has received.
* App Users: this would be the main users of the application. This kind of users should be able to see the list of available restaurants, the list of dishes and the details of each dish. Finally this would be the ones that create orders.

There are many other things that could be added to this application and in time i might add them as practice.