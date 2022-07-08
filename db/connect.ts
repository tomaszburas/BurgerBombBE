import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');

client.connect();
const db = client.db('burger_bomb');

export const burgersCollection = db.collection('burgers');
export const ingredientsCollection = db.collection('ingredients');
export const informationsCollection = db.collection('informations');
export const ordersCollection = db.collection('orders');
export const usersCollection = db.collection('users');
export const couponsCollection = db.collection('coupons');
export const botdCollection = db.collection('botd');
