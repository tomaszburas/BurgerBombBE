import { MongoClient } from 'mongodb';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config';

const client = new MongoClient(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}.${DB_HOST}`);

client.connect();
const db = client.db('burger_bomb');

export const burgersCollection = db.collection('burgers');
export const ingredientsCollection = db.collection('ingredients');
export const infoCollection = db.collection('info');
export const ordersCollection = db.collection('orders');
export const usersCollection = db.collection('users');
export const couponsCollection = db.collection('coupons');
export const botdCollection = db.collection('botd');
